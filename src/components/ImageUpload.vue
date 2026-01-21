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
        <!-- 显示默认图片预览 -->
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
// 关键修复：补充导入 watchEffect
import { ref, watchEffect } from "vue";
import { useImageProcess } from "@/composables/useImageProcess";
// 引入默认图片
import defaultImageUrl from "@/assets/test.jpg";

// 新增 upload-status-change 事件定义
const emit = defineEmits(["upload-success", "upload-status-change"]);
const fileInput = ref<HTMLInputElement | null>(null);
// 确保使用同一个useImageProcess实例
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
    const uploadRes = uploadImage(file);
    emit("upload-success", uploadRes.url);
    // 触发上传状态变化事件
    emit("upload-status-change", true);
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
    const uploadRes = uploadImage(file);
    emit("upload-success", uploadRes.url);
    // 触发上传状态变化事件
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
  // 触发上传状态变化事件
  emit("upload-status-change", false);
};

// 监听uploadedFile的变化，确保状态同步
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
