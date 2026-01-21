<template>
  <Layout>
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-primary">在线图片处理系统</h1>
        <p class="text-gray-600">上传图片并自定义处理配置</p>
      </div>

      <!-- 图片上传组件 -->
      <ImageUpload
        @upload-success="handleUploadSuccess"
        @upload-status-change="handleUploadStatusChange"
        class="mb-6"
      />

      <!-- 图片处理配置组件 -->
      <ImageProcess
        @process-start="handleProcessStart"
        @process-success="handleProcessSuccess"
        @process-error="handleProcessError"
        class="mb-6"
      />

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-4 text-primary">
        <span class="inline-block animate-spin mr-2">🔄</span>
        图片处理中...
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="text-red-500 text-center py-2">{{ error }}</div>

      <!-- 处理结果预览：确保processedImageUrl有值且isProcessed为true -->
      <div v-if="isProcessed && processedImageUrl" class="card mb-6">
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
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Layout from "@/components/Layout.vue";
import ImageUpload from "@/components/ImageUpload.vue";
import ImageProcess from "@/components/ImageProcess.vue";
import { useImageProcess } from "@/composables/useImageProcess";

// 解构所有需要的状态（包括新增的isDefaultImageLoaded）
const {
  processedImageUrl,
  loading,
  error,
  downloadImage,
  reset,
  isProcessed,
  isDefaultImageLoaded,
} = useImageProcess();

// 状态管理
const uploaded = ref(false);
const processed = ref(false);
const uploadedFileUrl = ref("");

// 上传成功回调
const handleUploadSuccess = (url: string) => {
  uploadedFileUrl.value = url;
  processed.value = false;
  error.value = "";
};

// 上传状态变更回调
const handleUploadStatusChange = (status: boolean) => {
  uploaded.value = status;
};

// 处理开始回调
const handleProcessStart = () => {
  processed.value = false;
  error.value = "";
};

// 处理成功回调
const handleProcessSuccess = () => {
  processed.value = true;
};

// 处理失败回调
const handleProcessError = (err: string) => {
  error.value = err;
};

// 下载图片
const handleDownload = () => {
  downloadImage("processed-image");
};

// 重置所有
const handleReset = () => {
  reset();
  uploaded.value = false;
  processed.value = false;
  uploadedFileUrl.value = "";
  error.value = "";
};
</script>
