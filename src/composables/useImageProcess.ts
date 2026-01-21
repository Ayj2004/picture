import { ref, onMounted } from "vue";
import type { ImageProcessConfig, ProcessResult, UploadFile } from "@/types";

// 引入默认静态图片和处理完成图片
import defaultImageUrl from "@/assets/test.png";
import finishImageUrl from "@/assets/finish.png";

export const useImageProcess = () => {
  const loading = ref(false);
  const error = ref("");
  const uploadedFile = ref<UploadFile | null>(null);
  const processedImageUrl = ref("");
  const defaultImageBlobUrl = ref("");
  const isProcessed = ref(false);
  // 新增：标记默认图片是否加载完成
  const isDefaultImageLoaded = ref(false);

  // 初始化默认图片（test.png）
  const initDefaultImage = async () => {
    try {
      const response = await fetch(defaultImageUrl);
      const blob = await response.blob();
      const file = new File([blob], "test.png", { type: blob.type });
      const url = URL.createObjectURL(blob);
      defaultImageBlobUrl.value = url;
      uploadedFile.value = { file, url };
      isDefaultImageLoaded.value = true; // 标记默认图片加载完成
      error.value = "";
    } catch (e) {
      console.error("加载默认图片失败:", e);
      error.value = "默认图片加载失败，请上传图片后重试";
      isDefaultImageLoaded.value = false;
    }
  };

  onMounted(() => {
    initDefaultImage();
  });

  // 上传图片逻辑
  const uploadImage = (file: File): UploadFile => {
    if (defaultImageBlobUrl.value) {
      URL.revokeObjectURL(defaultImageBlobUrl.value);
      defaultImageBlobUrl.value = "";
    }
    const url = URL.createObjectURL(file);
    const uploadFileObj: UploadFile = { file, url };
    uploadedFile.value = uploadFileObj;
    isDefaultImageLoaded.value = true; // 上传图片后标记为已加载
    return uploadFileObj;
  };

  // 处理图片逻辑（直接返回finish.png）
  const processImage = async (
    config: ImageProcessConfig
  ): Promise<ProcessResult> => {
    // 校验：无图片可处理时直接返回失败
    if (!isDefaultImageLoaded.value && !uploadedFile.value) {
      const errMsg = "默认图片未加载完成，请稍候或手动上传图片后重试";
      error.value = errMsg;
      return { success: false, error: errMsg };
    }

    loading.value = true;
    error.value = "";
    isProcessed.value = false;
    try {
      // 模拟处理延迟
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("处理配置:", config);

      // 强制赋值处理后图片为finish.png
      processedImageUrl.value = finishImageUrl;
      isProcessed.value = true; // 确保标记为处理完成
      return { success: true, url: finishImageUrl };
    } catch (e) {
      const errorObj = e as Error;
      const errMsg = `处理失败：${errorObj.message}`;
      error.value = errMsg;
      return { success: false, error: errMsg };
    } finally {
      loading.value = false;
    }
  };

  // 下载图片
  const downloadImage = (fileName = "processed-image") => {
    if (!processedImageUrl.value) {
      alert("暂无处理后的图片可下载");
      return;
    }
    const a = document.createElement("a");
    a.href = processedImageUrl.value;
    const blobType =
      processedImageUrl.value.split(";")[0].split("/")[1] || "png";
    a.download = `${fileName}.${blobType}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 重置状态
  const reset = () => {
    if (uploadedFile.value) {
      URL.revokeObjectURL(uploadedFile.value.url);
    }
    if (defaultImageBlobUrl.value) {
      URL.revokeObjectURL(defaultImageBlobUrl.value);
    }
    if (processedImageUrl.value) {
      URL.revokeObjectURL(processedImageUrl.value);
    }
    uploadedFile.value = null;
    processedImageUrl.value = "";
    error.value = "";
    loading.value = false;
    isProcessed.value = false;
    isDefaultImageLoaded.value = false; // 重置默认图片加载状态
    initDefaultImage(); // 重新初始化默认图片
  };

  return {
    loading,
    error,
    uploadedFile,
    processedImageUrl,
    isProcessed,
    isDefaultImageLoaded, // 导出默认图片加载状态
    uploadImage,
    processImage,
    downloadImage,
    reset,
  };
};
