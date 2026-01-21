import { ref } from "vue";
import type { ImageProcessConfig, ProcessResult, UploadFile } from "@/types";

// 边缘函数部署地址（替换为你的实际地址）
const EDGE_FUNCTION_URL = "https://usepicture.4fa2a2a9.er.aliyun-esa.net";

export const useImageProcess = () => {
  const loading = ref(false);
  const error = ref("");
  const uploadedFile = ref<UploadFile | null>(null);
  const processedImageUrl = ref("");

  // 1. 上传图片（生成本地预览URL）
  const uploadImage = (file: File): UploadFile => {
    const url = URL.createObjectURL(file);
    uploadedFile.value = { file, url };
    return uploadedFile.value;
  };

  // 2. 处理图片（修复：使用FormData传递文件+配置）
  const processImage = async (
    config: ImageProcessConfig
  ): Promise<ProcessResult> => {
    // 严格校验文件是否存在
    if (!uploadedFile.value || !uploadedFile.value.file) {
      const errMsg = "请先上传图片";
      error.value = errMsg;
      return { success: false, error: errMsg };
    }

    loading.value = true;
    error.value = "";
    try {
      // 步骤1：构建FormData，包含文件和配置
      const formData = new FormData();
      // 添加图片文件
      formData.append("file", uploadedFile.value.file);
      // 添加处理配置（转为JSON字符串）
      formData.append("config", JSON.stringify(config));

      // 步骤2：调用组合处理接口，传递FormData
      const response = await fetch(
        `${EDGE_FUNCTION_URL}/api/process/composite`,
        {
          method: "POST",
          body: formData, // 传递FormData而非JSON
          // 无需手动设置Content-Type，浏览器会自动添加multipart/form-data及boundary
        }
      );

      if (!response.ok) {
        throw new Error(`请求失败：${response.status} ${response.statusText}`);
      }

      // 处理后的图片转为Blob URL
      const blob = await response.blob();
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
    const ext = processedImageUrl.value.split(";")[0].split("/")[1] || "png";
    a.download = `${fileName}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 4. 重置状态
  const reset = () => {
    if (uploadedFile.value) {
      URL.revokeObjectURL(uploadedFile.value.url);
    }
    if (processedImageUrl.value) {
      URL.revokeObjectURL(processedImageUrl.value);
    }
    uploadedFile.value = null;
    processedImageUrl.value = "";
    error.value = "";
    loading.value = false;
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
