<template>
  <div class="mb-8 card">
    <h3 class="text-lg font-medium mb-4">上传图片</h3>
    <div
      class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
      @click="triggerFileInput"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileChange"
      />
      <div v-if="!uploadedFile" class="space-y-2">
        <!-- 显示默认图片test.png -->
        <img
          :src="defaultImageUrl"
          alt="默认图片"
          class="mx-auto max-w-xs max-h-32 object-contain mb-2 rounded"
        />
        <p class="text-gray-500">
          点击上传或拖拽图片到此处（默认使用示例图片）
        </p>
        <p class="text-xs text-gray-400">支持JPG、PNG、WEBP等格式</p>
      </div>
      <div v-else class="relative">
        <img
          :src="uploadedFile.url"
          alt="已上传图片"
          class="max-w-full max-h-64 mx-auto rounded"
        />
        <button
          class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          @click.stop="handleRemove"
        >
          ✕
        </button>
      </div>
    </div>
    <div v-if="error" class="text-red-500 mt-2 text-sm">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useImageProcess } from "@/composables/useImageProcess";
// 引入默认图片test.png
import defaultImageUrl from "@/assets/test.png";

const emit = defineEmits(["upload-success", "upload-status-change"]);
const fileInput = ref<HTMLInputElement | null>(null);
const { uploadImage, uploadedFile, error, reset } = useImageProcess();

// 触发文件选择
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// 处理文件选择
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

// 处理拖拽上传
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

// 移除已上传文件
const handleRemove = () => {
  reset();
  emit("upload-success", "");
  emit("upload-status-change", false);
};

// 监听uploadedFile的变化
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
