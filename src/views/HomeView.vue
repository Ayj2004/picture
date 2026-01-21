<template>
  <Layout title="首页 | 在线图片处理系统">
    <div class="max-w-4xl mx-auto px-4">
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold mb-4">在线图片处理系统</h1>
        <p class="text-gray-600 max-w-2xl mx-auto">
          支持图片格式转换、缩放、旋转、添加水印等功能，基于边缘函数实时处理，无需下载软件
        </p>
      </div>

      <!-- 1. 图片上传区域 -->
      <ImageUpload @upload-success="handleUploadSuccess" />

      <!-- 2. 处理配置区域（仅上传图片后显示） -->
      <div v-if="uploaded" class="mt-8 card">
        <ImageProcess
          @process-start="handleProcessStart"
          @process-success="handleProcessSuccess"
          @process-error="handleProcessError"
        />
      </div>

      <!-- 3. 结果预览区域（仅处理完成后显示） -->
      <div v-if="processed" class="mt-8 card">
        <h3 class="text-lg font-medium mb-4">处理结果预览</h3>
        <div class="flex flex-col md:flex-row gap-6">
          <div class="flex-1">
            <h4 class="text-sm text-gray-500 mb-2">原图</h4>
            <img
              :src="uploadedFileUrl"
              alt="原图"
              class="w-full max-h-64 object-contain rounded border"
            />
          </div>
          <div class="flex-1">
            <h4 class="text-sm text-gray-500 mb-2">处理后</h4>
            <img
              :src="processedImageUrl"
              alt="处理后图片"
              class="w-full max-h-64 object-contain rounded border"
            />
          </div>
        </div>
        <button
          class="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          @click="handleDownload"
        >
          下载处理后图片
        </button>
        <!-- 新增重置按钮，使用 reset 方法 -->
        <button
          class="mt-4 ml-4 px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          @click="handleReset"
        >
          重置所有状态
        </button>
      </div>

      <!-- 加载/错误提示 -->
      <div v-if="loading" class="text-center mt-8 py-4">
        <span class="inline-block animate-spin mr-2">🔄</span>
        处理中，请稍候...
      </div>
      <div v-if="error" class="text-center mt-8 py-4 text-red-500">
        {{ error }}
        <button
          class="mt-2 px-4 py-1 bg-primary text-white rounded-md text-sm"
          @click="error = ''"
        >
          关闭提示
        </button>
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

// 引入图片处理逻辑（移除未使用的 uploadedFile，保留并使用 reset）
const { processedImageUrl, loading, error, downloadImage, reset } =
  useImageProcess();

// 状态管理
const uploaded = ref(false);
const processed = ref(false);
const uploadedFileUrl = ref("");

// 上传成功回调
const handleUploadSuccess = (url: string) => {
  uploaded.value = true;
  uploadedFileUrl.value = url;
  processed.value = false; // 重置处理状态
  error.value = ""; // 清空错误
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

// 新增：使用 reset 方法的回调函数
const handleReset = () => {
  reset();
  uploaded.value = false;
  processed.value = false;
  uploadedFileUrl.value = "";
  error.value = "";
};
</script>
