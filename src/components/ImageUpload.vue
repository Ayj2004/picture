<template>
  <div class="mb-8 card">
    <h3 class="text-lg font-medium mb-4">上传图片</h3>
    <div
      class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
      @click="triggerFileInput"
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
          @click="handleRemove"
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

const emit = defineEmits(["upload-success"]); // 定义上传成功事件
const fileInput = ref<HTMLInputElement | null>(null);
const { uploadImage, uploadedFile, error, reset } = useImageProcess();

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click();
};

// 处理文件选择
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const uploadRes = uploadImage(file);
    emit("upload-success", uploadRes.url); // 触发上传成功事件
  }
  target.value = ""; // 重置input
};

// 移除已上传文件
const handleRemove = () => {
  reset();
  emit("upload-success", ""); // 清空上传状态
};

// 监听上传状态，同步触发事件
watch(uploadedFile, (newVal) => {
  if (newVal) {
    emit("upload-success", newVal.url);
  }
});
</script>
