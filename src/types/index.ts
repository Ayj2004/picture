/** 图片处理配置类型 */
export interface ImageProcessConfig {
  format?: "png" | "jpeg" | "webp"; // 目标格式
  width?: number; // 缩放宽度
  height?: number; // 缩放高度
  quality?: number; // 图片质量 0-100
  angle?: number; // 旋转角度 0-360
  watermarkText?: string; // 水印文字
}

/** 处理结果类型 */
export interface ProcessResult {
  success: boolean;
  url?: string; // 处理后的图片URL
  error?: string;
}

/** 上传文件信息 */
export interface UploadFile {
  file: File;
  url: string; // 临时预览URL
}
