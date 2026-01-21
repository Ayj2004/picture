<!-- src/views/HomeView.vue -->
<template>
  <Layout>
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- 其他内容不变 -->

      <!-- 处理结果预览：仅当isProcessed为true时展示 -->
      <div v-if="isProcessed" class="card mb-6">
        <h3 class="text-lg font-medium mb-4">处理结果预览</h3>
        <img
          :src="processedImageUrl"
          alt="处理后图片"
          class="w-full max-h-96 object-contain rounded border mb-4"
        />
        <div class="flex gap-4">
          <button
            class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            @click="handleDownload"
          >
            下载图片
          </button>
          <button
            class="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            @click="handleReset"
          >
            重置所有
          </button>
        </div>
      </div>

      <!-- 移除默认图片展示：未处理时不显示任何图片 -->
      <!-- 注释/删除以下默认图片相关代码 -->
      <!-- <div v-if="!processedImageUrl && defaultImageUrl" class="text-center">
        <img
          :src="defaultImageUrl"
          alt="默认图片"
          class="mx-auto max-w-xs max-h-32 object-contain rounded"
        />
        <p class="text-gray-500 mt-2">未处理时展示默认图片</p>
      </div> -->
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Layout from "@/components/Layout.vue";
import ImageUpload from "@/components/ImageUpload.vue";
import ImageProcess from "@/components/ImageProcess.vue";
import { useImageProcess } from "@/composables/useImageProcess";
// 移除默认图片引入（如果不需要）
// import defaultImageUrl from "@/assets/test.png";

// 解构新增的isProcessed状态
const { processedImageUrl, loading, error, downloadImage, reset, isProcessed } =
  useImageProcess();

// 其他逻辑不变...
</script>
