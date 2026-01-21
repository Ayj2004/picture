<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useImageProcess } from "@/composables/useImageProcess";
// 替换默认图片为 test.png
import defaultImageUrl from "@/assets/test.png";

const emit = defineEmits(["upload-success", "upload-status-change"]);
const fileInput = ref<HTMLInputElement | null>(null);
const { uploadImage, uploadedFile, error, reset } = useImageProcess();

// 其余逻辑保持不变
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const uploadRes = uploadImage(file);
    emit("upload-success", uploadRes.url);
    emit("upload-status-change", true);
  }
  target.value = "";
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  const file = e.dataTransfer?.files?.[0];
  if (file && file.type.startsWith("image/")) {
    const uploadRes = uploadImage(file);
    emit("upload-success", uploadRes.url);
    emit("upload-status-change", true);
  }
};

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

const handleRemove = () => {
  reset();
  emit("upload-success", "");
  emit("upload-status-change", false);
};

watchEffect(() => {
  if (uploadedFile.value) {
    emit("upload-success", uploadedFile.value.url);
    emit("upload-status-change", true);
  } else {
    emit("upload-success", "");
    emit("upload-status-change", false);
  }
});
</script>
