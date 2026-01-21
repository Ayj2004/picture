<script setup lang="ts">
import { ref } from "vue";
import Layout from "@/components/Layout.vue";
import ImageUpload from "@/components/ImageUpload.vue";
import ImageProcess from "@/components/ImageProcess.vue";
import { useImageProcess } from "@/composables/useImageProcess";
// 替换默认图片为 test.png
import defaultImageUrl from "@/assets/test.png";

const { processedImageUrl, loading, error, downloadImage, reset } =
  useImageProcess();

// 其余逻辑保持不变
const uploaded = ref(false);
const processed = ref(false);
const uploadedFileUrl = ref("");

const handleUploadSuccess = (url: string) => {
  uploadedFileUrl.value = url;
  processed.value = false;
  error.value = "";
};

const handleUploadStatusChange = (status: boolean) => {
  uploaded.value = status;
};

const handleProcessStart = () => {
  processed.value = false;
  error.value = "";
};

const handleProcessSuccess = () => {
  processed.value = true;
};

const handleProcessError = (err: string) => {
  error.value = err;
};

const handleDownload = () => {
  downloadImage("processed-image");
};

const handleReset = () => {
  reset();
  uploaded.value = false;
  processed.value = false;
  uploadedFileUrl.value = "";
  error.value = "";
};
</script>
