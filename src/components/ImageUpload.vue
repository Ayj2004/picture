<template>
  <div class="mb-8">
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
    <button
      v-if="uploadedFile"
      class="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      @click="handleNext"
    >
      下一步：处理配置
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useImageProcess } from "@/composables/useImageProcess";

const router = useRouter();
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
    uploadImage(file);
    // 保存状态到本地存储
    localStorage.setItem(
      "imageProcessState",
      JSON.stringify({
        uploadedFileUrl: uploadedFile.value?.url,
      })
    );
  }
  target.value = ""; // 重置input
};

// 移除已上传文件
const handleRemove = () => {
  reset();
  localStorage.removeItem("imageProcessState");
};

// 跳转到处理配置页
const handleNext = () => {
  router.push({ name: "process" });
};

// 监听上传状态，同步到本地存储
watch(uploadedFile, (newVal) => {
  const state = JSON.parse(localStorage.getItem("imageProcessState") || "{}");
  state.uploadedFileUrl = newVal?.url;
  localStorage.setItem("imageProcessState", JSON.stringify(state));
});
</script>
