// 注意：阿里云边缘函数需确保已安装 @web-std/form-data 依赖
import { FormData } from '@web-std/form-data';
import { parseMultipartFormData } from '@web-std/form-data/parse-multipart';

// ===================== 图片处理核心函数 =====================
async function imageFormat(request, format = 'png') {
  return fetch(request, {
    image: [
      {
        action: 'format',
        option: { param: { f: format } },
      },
    ],
  });
}

async function imageResize(request, width, height, quality = 90) {
  const resizeParam = { p: quality };
  if (width) resizeParam.fw = width;
  if (height) resizeParam.fh = height;

  return fetch(request, {
    image: [
      {
        action: 'resize',
        option: {
          mode: 'custom',
          param: resizeParam,
        },
      },
    ],
  });
}

async function imageRotate(request, angle = 0) {
  return fetch(request, {
    image: [
      {
        action: 'rotate',
        option: {
          mode: 'custom',
          param: { a: angle },
        },
      },
    ],
  });
}

async function imageWatermark(request, text = 'ImageProcess') {
  return fetch(request, {
    image: [
      {
        action: 'watermark',
        option: {
          mode: 'text',
          param: {
            text: text,        // 水印文字
            fontSize: 16,      // 字体大小
            color: '#ffffff80',// 字体颜色（半透明白色）
            dx: 10,            // 水平偏移
            dy: 10,            // 垂直偏移
            rotate: 30,        // 水印旋转角度
          },
        },
      },
    ],
  });
}

// 组合处理：支持多步骤链式处理
async function imageCompositeProcess(request, processConfig) {
  const imageActions = [];
  // 格式转换
  if (processConfig.format) {
    imageActions.push({
      action: 'format',
      option: { param: { f: processConfig.format } },
    });
  }
  // 缩放
  if (processConfig.width || processConfig.height) {
    imageActions.push({
      action: 'resize',
      option: {
        mode: 'custom',
        param: {
          p: processConfig.quality || 90,
          fw: processConfig.width,
          fh: processConfig.height,
        },
      },
    });
  }
  // 旋转
  if (processConfig.angle) {
    imageActions.push({
      action: 'rotate',
      option: {
        mode: 'custom',
        param: { a: processConfig.angle },
      },
    });
  }
  // 水印
  if (processConfig.watermarkText) {
    imageActions.push({
      action: 'watermark',
      option: {
        mode: 'text',
        param: {
          text: processConfig.watermarkText,
          fontSize: 16,
          color: '#ffffff80',
          dx: 10,
          dy: 10,
          rotate: 30,
        },
      },
    });
  }

  // 无处理动作时直接返回原请求
  if (imageActions.length === 0) return fetch(request);
  
  return fetch(request, { image: imageActions });
}

// ===================== FormData解析修复 =====================
async function parseFormData(request) {
  const contentType = request.headers.get('content-type') || '';
  
  // 非FormData请求（JSON）
  if (!contentType.includes('multipart/form-data')) {
    try {
      const body = await request.json();
      return { file: null, config: body.config || body };
    } catch (e) {
      throw new Error('JSON解析失败：' + e.message);
    }
  }

  // FormData解析（修复阿里云边缘函数适配）
  try {
    // 克隆请求避免body被消费
    const reqClone = request.clone();
    const formData = await parseMultipartFormData(reqClone);
    
    const file = formData.get('file');
    let config = {};
    const configStr = formData.get('config');
    
    if (configStr) {
      try {
        config = JSON.parse(configStr);
      } catch (e) {
        throw new Error('配置JSON解析失败：' + e.message);
      }
    }

    return { file, config };
  } catch (e) {
    throw new Error('FormData解析失败：' + e.message);
  }
}

// ===================== 主处理函数 =====================
async function handleRequest(request) {
  // 处理OPTIONS预检请求（跨域核心修复）
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
        'Access-Control-Max-Age': '86400', // 预检缓存1天
      },
    });
  }

  const url = new URL(request.url);
  const path = url.pathname;
  const searchParams = new URLSearchParams(url.search);

  try {
    // 1. 基础单操作接口
    if (path === '/api/process/format') {
      const format = searchParams.get('format') || 'png';
      return await imageFormat(request, format);
    }
    if (path === '/api/process/resize') {
      const width = parseInt(searchParams.get('width') || '');
      const height = parseInt(searchParams.get('height') || '');
      const quality = parseInt(searchParams.get('quality') || '90');
      return await imageResize(request, width, height, quality);
    }
    if (path === '/api/process/rotate') {
      const angle = parseInt(searchParams.get('angle') || '0');
      return await imageRotate(request, angle);
    }
    if (path === '/api/process/watermark') {
      const text = searchParams.get('text') || 'ImageProcess';
      return await imageWatermark(request, text);
    }

    // 2. 组合处理接口（核心修复）
    if (path === '/api/process/composite') {
      const { file, config } = await parseFormData(request);
      
      // 校验文件
      if (!file) {
        return new Response(JSON.stringify({
          success: false,
          error: '请上传有效的图片文件'
        }), {
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      // 构建图片处理请求（修复文件传递逻辑）
      const imageRequest = new Request(request.url, {
        method: 'POST',
        body: file,
        headers: {
          'Content-Type': file.type || 'image/jpeg',
        },
      });

      // 执行组合处理
      const processedResponse = await imageCompositeProcess(imageRequest, config);
      
      // 处理成功：返回Blob并添加跨域头
      const responseClone = new Response(processedResponse.body, processedResponse);
      responseClone.headers.set('Access-Control-Allow-Origin', '*');
      return responseClone;
    }

    // 3. 静态文件/默认返回
    return new Response('Image Process Edge Function', { 
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    // 全局错误处理
    return new Response(JSON.stringify({
      success: false,
      error: '处理失败：' + e.message
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// ===================== 导出边缘函数 =====================
export default {
  async fetch(request) {
    return handleRequest(request);
  },
};