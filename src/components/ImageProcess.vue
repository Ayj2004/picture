<template>
  <div class="mb-4">
    <h3 class="text-lg font-medium mb-4">图片处理配置</h3>

    <!-- 格式转换 -->
    <div class="mb-4">
      <label class="block text-gray-700 mb-2">目标格式</label>
      <select v-model="config.format" class="w-full px-3 py-2 border rounded">
        <option value="png">PNG</option>
        <option value="jpeg">JPEG</option>
        <option value="webp">WEBP</option>
      </select>
    </div>

    <!-- 缩放配置 -->
    <div class="mb-4">
      <label class="block text-gray-700 mb-2">缩放尺寸</label>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm text-gray-500 mb-1">宽度（px）</label>
          <input
            v-model.number="config.width"
            type="number"
            min="1"
            class="w-full px-3 py-2 border rounded"
            placeholder="留空则按比例"
          />
        </div>
        <div>
          <label class="text-sm text-gray-500 mb-1">高度（px）</label>
          <input
            v-model.number="config.height"
            type="number"
            min="1"
            class="w-full px-3 py-2 border rounded"
            placeholder="留空则按比例"
          />
        </div>
      </div>
      <div class="mt-2">
        <label class="block text-gray-700 mb-2">图片质量（0-100）</label>
        <input
          v-model.number="config.quality"
          type="range"
          min="0"
          max="100"
          step="1"
          class="w-full"
        />
        <span class="text-sm text-gray-500">{{ config.quality }}%</span>
      </div>
    </div>

    <!-- 旋转配置 -->
    <div class="mb-4">
      <label class="block text-gray-700 mb-2">旋转角度</label>
      <input
        v-model.number="config.angle"
        type="range"
        min="0"
        max="360"
        step="1"
        class="w-full"
      />
      <span class="text-sm text-gray-500">{{ config.angle }}°</span>
    </div>

    <!-- 水印配置 -->
    <div class="mb-4">
      <label class="block text-gray-700 mb-2">水印文字</label>
      <input
        v-model="config.watermarkText"
        type="text"
        class="w-full px-3 py-2 border rounded"
        placeholder="留空则不加水印"
      />
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="text-red-500 mb-4 text-sm">{{ error }}</div>
    <!-- 额外提示：未上传文件时禁用按钮并提示 -->
    <div v-if="!hasUploadedFile" class="text-orange-500 mb-4 text-sm">
      ⚠️ 请先上传图片再进行处理
    </div>

    <!-- 操作按钮 -->
    <div class="flex gap-4">
      <button
        class="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        @click="handleReset"
      >
        重置配置
      </button>
      <button
        class="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        @click="handleProcess"
        :disabled="loading || !hasUploadedFile"
      >
        <span v-if="loading" class="inline-block animate-spin mr-2">🔄</span>
        开始处理
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useImageProcess } from "@/composables/useImageProcess";
import type { ImageProcessConfig } from "@/types";

// 定义事件
const emit = defineEmits(["process-start", "process-success", "process-error"]);
const { loading, error, uploadedFile, processImage } = useImageProcess();

// 计算属性：判断是否已上传文件
const hasUploadedFile = computed(() => !!uploadedFile.value?.file);

// 默认配置
const config = ref<ImageProcessConfig>({
  format: "png",
  quality: 90,
  angle: 0,
  watermarkText: "",
  width: undefined,
  height: undefined,
});

// 重置配置
const handleReset = () => {
  config.value = {
    format: "png",
    quality: 90,
    angle: 0,
    watermarkText: "",
    width: undefined,
    height: undefined,
  };
};

// 处理图片
const handleProcess = async () => {
  emit("process-start"); // 通知开始处理
  const result = await processImage(config.value);
  if (result.success) {
    emit("process-success"); // 通知处理成功
  } else {
    emit("process-error", result.error || "处理失败，请重试"); // 通知处理失败
  }
};
</script>
