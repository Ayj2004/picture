import { ref, onMounted } from "vue";
import type { ImageProcessConfig, ProcessResult, UploadFile } from "@/types";

// 边缘函数部署地址（替换为你的实际地址）
const EDGE_FUNCTION_URL = "https://usepicture.4fa2a2a9.er.aliyun-esa.net";

// 引入默认静态图片
import defaultImageUrl from "@/assets/test.jpg";

export const useImageProcess = () => {
  const loading = ref(false);
  const error = ref("");
  const uploadedFile = ref<UploadFile | null>(null);
  const processedImageUrl = ref("");
  // 存储默认图片的Blob URL
  const defaultImageBlobUrl = ref("");

  // 初始化默认图片
  const initDefaultImage = async () => {
    try {
      const response = await fetch(defaultImageUrl);
      const blob = await response.blob();
      const file = new File([blob], "test.jpg", { type: blob.type });
      const url = URL.createObjectURL(blob);
      defaultImageBlobUrl.value = url;
      // 初始化默认上传文件对象
      uploadedFile.value = { file, url };
    } catch (e) {
      console.error("加载默认图片失败:", e);
      error.value = "默认图片加载失败，请上传图片后重试";
    }
  };

  // 页面挂载时加载默认图片
  onMounted(() => {
    initDefaultImage();
  });

  // 1. 上传图片（生成本地预览URL）
  const uploadImage = (file: File): UploadFile => {
    // 释放之前的默认图片URL
    if (defaultImageBlobUrl.value) {
      URL.revokeObjectURL(defaultImageBlobUrl.value);
      defaultImageBlobUrl.value = "";
    }
    const url = URL.createObjectURL(file);
    const uploadFileObj: UploadFile = { file, url };
    uploadedFile.value = uploadFileObj;
    return uploadFileObj;
  };

  // 2. 处理图片（支持默认图片，修复请求逻辑）
  const processImage = async (
    config: ImageProcessConfig
  ): Promise<ProcessResult> => {
    // 校验：优先使用上传文件，无则使用默认图片
    if (!uploadedFile.value || !uploadedFile.value.file) {
      const errMsg = "图片加载失败，请稍后重试";
      error.value = errMsg;
      return { success: false, error: errMsg };
    }

    loading.value = true;
    error.value = "";
    try {
      // 步骤1：构建FormData（同时传递文件和配置）
      const formData = new FormData();
      formData.append("file", uploadedFile.value.file);
      // 将配置转为JSON字符串传递
      formData.append("config", JSON.stringify(config));

      // 步骤2：调用边缘函数接口（增强跨域+超时配置）
      const response = await fetch(
        `${EDGE_FUNCTION_URL}/api/process/composite`,
        {
          method: "POST",
          body: formData,
          // 新增：显式跨域配置 + 超时控制
          mode: "cors",
          credentials: "omit",
          timeout: 30000, // 30秒超时
          headers: {
            // 移除Content-Type自动设置，由浏览器自动生成正确的boundary
            Accept: "application/json, blob",
          },
        }
      );

      if (!response.ok) {
        // 新增：解析边缘函数返回的错误信息
        let errMsg = `请求失败：${response.status} ${response.statusText}`;
        try {
          const errData = await response.json();
          if (errData.error) errMsg = errData.error;
        } catch (e) {}
        throw new Error(errMsg);
      }

      // 处理响应：获取Blob并生成预览URL
      const blob = await response.blob();
      // 校验Blob有效性
      if (blob.size === 0) throw new Error("处理后的图片为空");

      const url = URL.createObjectURL(blob);
      processedImageUrl.value = url;

      return { success: true, url };
    } catch (e) {
      const errMsg = `处理失败：${(e as Error).message}`;
      error.value = errMsg;
      return { success: false, error: errMsg };
    } finally {
      loading.value = false;
    }
  };

  // 3. 下载处理后的图片
  const downloadImage = (fileName = "processed-image") => {
    if (!processedImageUrl.value) {
      alert("暂无处理后的图片可下载");
      return;
    }
    const a = document.createElement("a");
    a.href = processedImageUrl.value;
    // 从Blob URL解析文件格式
    const blobType =
      processedImageUrl.value.split(";")[0].split("/")[1] || "png";
    a.download = `${fileName}.${blobType}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 4. 重置状态（清理URL和文件）
  const reset = () => {
    // 释放上传文件的URL
    if (uploadedFile.value) {
      URL.revokeObjectURL(uploadedFile.value.url);
    }
    // 释放默认图片URL
    if (defaultImageBlobUrl.value) {
      URL.revokeObjectURL(defaultImageBlobUrl.value);
    }
    // 释放处理后的图片URL
    if (processedImageUrl.value) {
      URL.revokeObjectURL(processedImageUrl.value);
    }
    uploadedFile.value = null;
    processedImageUrl.value = "";
    error.value = "";
    loading.value = false;
    // 重置后重新加载默认图片
    initDefaultImage();
  };

  return {
    loading,
    error,
    uploadedFile,
    processedImageUrl,
    uploadImage,
    processImage,
    downloadImage,
    reset,
  };
};
