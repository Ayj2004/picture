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

  // 初始化默认图片（test.png）
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

  // 上传图片逻辑
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

  // 处理图片逻辑（直接返回finish.png，添加config使用示例 + 注释抑制未使用警告）
  const processImage = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    config: ImageProcessConfig
  ): Promise<ProcessResult> => {
    loading.value = true;
    error.value = "";
    try {
      // 模拟处理延迟（可选）
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 示例：使用config参数（即使暂时无实际逻辑，也能消除TS6133）
      console.log("处理配置:", config);

      // 设置处理后图片为finish.png
      processedImageUrl.value = finishImageUrl;
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
