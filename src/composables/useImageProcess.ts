// src/composables/useImageProcess.ts
import { ref, onMounted } from "vue";
import type { ImageProcessConfig, ProcessResult, UploadFile } from "@/types";
import defaultImageUrl from "@/assets/test.png";
import finishImageUrl from "@/assets/finish.png";

export const useImageProcess = () => {
  const loading = ref(false);
  const error = ref("");
  const uploadedFile = ref<UploadFile | null>(null);
  const processedImageUrl = ref("");
  const defaultImageBlobUrl = ref("");
  // 新增：标记是否点击过开始处理并完成
  const isProcessed = ref(false);

  // 初始化默认图片逻辑（不变）
  const initDefaultImage = async () => {
    try {
      const response = await fetch(defaultImageUrl);
      const blob = await response.blob();
      const file = new File([blob], "test.png", { type: blob.type });
      const url = URL.createObjectURL(blob);
      defaultImageBlobUrl.value = url;
      uploadedFile.value = { file, url };
    } catch (e) {
      console.error("加载默认图片失败:", e);
      error.value = "默认图片加载失败，请上传图片后重试";
    }
  };

  onMounted(() => {
    initDefaultImage();
  });

  // 上传图片逻辑（不变）
  const uploadImage = (file: File): UploadFile => {
    if (defaultImageBlobUrl.value) {
      URL.revokeObjectURL(defaultImageBlobUrl.value);
      defaultImageBlobUrl.value = "";
    }
    const url = URL.createObjectURL(file);
    const uploadFileObj: UploadFile = { file, url };
    uploadedFile.value = uploadFileObj;
    return uploadFileObj;
  };

  // 处理图片逻辑：完成后标记isProcessed为true
  const processImage = async (
    config: ImageProcessConfig
  ): Promise<ProcessResult> => {
    loading.value = true;
    error.value = "";
    isProcessed.value = false; // 重置处理状态
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("处理配置:", config);
      processedImageUrl.value = finishImageUrl;
      isProcessed.value = true; // 标记：已处理完成
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

  // 下载图片逻辑（不变）
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

  // 重置状态：清空isProcessed
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
    isProcessed.value = false; // 重置处理标记
    initDefaultImage();
  };

  // 导出新增的isProcessed状态
  return {
    loading,
    error,
    uploadedFile,
    processedImageUrl,
    isProcessed, // 新增导出
    uploadImage,
    processImage,
    downloadImage,
    reset,
  };
};
