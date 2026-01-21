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
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p class="text-gray-500">点击上传或拖拽图片到此处</p>
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
import { ref, watch } from "vue";
import { useImageProcess } from "@/composables/useImageProcess";

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
    // 直接上传文件，确保同步到useImageProcess的uploadedFile
    uploadImage(file);
    // 主动通知上传状态变化
    emit("upload-status-change", !!uploadedFile.value);
  }
  // 重置input，允许重复选择同一文件
  target.value = "";
};

// 处理拖拽上传
const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  const file = e.dataTransfer?.files?.[0];
  if (file && file.type.startsWith("image/")) {
    uploadImage(file);
    // 主动通知上传状态变化
    emit("upload-status-change", !!uploadedFile.value);
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

// 监听uploadedFile变化，同步通知父组件
watch(
  uploadedFile,
  (newVal) => {
    if (newVal) {
      emit("upload-success", newVal.url);
      emit("upload-status-change", true);
    } else {
      emit("upload-success", "");
      emit("upload-status-change", false);
    }
  },
  { immediate: true }
);
</script>
