<template>
  <div class="card">
    <h3 class="text-lg font-medium mb-4">图片预览</h3>
    <div v-if="processedImageUrl" class="mb-4">
      <img
        :src="processedImageUrl"
        alt="处理后图片"
        class="w-full max-h-96 object-contain rounded border"
      />
    </div>
    <div v-else class="text-gray-500 text-center py-8">
      暂无处理后的图片可预览
    </div>
    <button
      class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
      @click="handleDownload"
      :disabled="!processedImageUrl"
    >
      下载图片
    </button>
  </div>
</template>

<script setup lang="ts">
import { useImageProcess } from "@/composables/useImageProcess";

const { processedImageUrl, downloadImage } = useImageProcess();

const handleDownload = () => {
  downloadImage("processed-image");
};
</script>
