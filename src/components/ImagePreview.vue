<template>
  <div class="max-w-3xl mx-auto">
    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-10">
      <span class="inline-block animate-spin mr-2">🔄</span>
      处理中...
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="text-center py-10 text-red-500">
      {{ error }}
      <button
        class="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        @click="handleBack"
      >
        返回重新配置
      </button>
    </div>

    <!-- 预览区域 -->
    <div v-else-if="processedImageUrl" class="space-y-6">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- 原图 -->
        <div class="flex-1">
          <h4 class="text-sm text-gray-500 mb-2">原图</h4>
          <img
            :src="uploadedFile?.url"
            alt="原图"
            class="w-full max-h-80 object-contain rounded border"
          />
        </div>
        <!-- 处理后图片 -->
        <div class="flex-1">
          <h4 class="text-sm text-gray-500 mb-2">处理后</h4>
          <img
            :src="processedImageUrl"
            alt="处理后图片"
            class="w-full max-h-80 object-contain rounded border"
          />
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-4 justify-center">
        <button
          class="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          @click="handleBack"
        >
          返回重新配置
        </button>
        <button
          class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          @click="handleDownload"
        >
          下载处理后图片
        </button>
        <button
          class="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          @click="handleResetAll"
        >
          重置所有
        </button>
      </div>
    </div>

    <!-- 无结果状态 -->
    <div v-else class="text-center py-10">
      <p class="text-gray-500">暂无处理结果，请先上传并处理图片</p>
      <router-link
        to="/"
        class="text-primary mt-4 inline-block hover:underline"
      >
        返回首页
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useImageProcess } from "@/composables/useImageProcess";

const router = useRouter();
const {
  loading,
  error,
  uploadedFile,
  processedImageUrl,
  downloadImage,
  reset,
} = useImageProcess();

// 返回处理配置页
const handleBack = () => {
  router.push({ name: "process" });
};

// 下载图片
const handleDownload = () => {
  downloadImage("processed-image");
};

// 重置所有状态
const handleResetAll = () => {
  reset();
  localStorage.removeItem("imageProcessState");
  router.push({ name: "home" });
};
</script>
