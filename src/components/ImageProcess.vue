<template>
  <div class="mb-8 max-w-2xl mx-auto">
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
        :disabled="loading"
      >
        <span v-if="loading" class="inline-block animate-spin mr-2">🔄</span>
        开始处理
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useImageProcess } from "@/composables/useImageProcess";
import type { ImageProcessConfig } from "@/types";

const router = useRouter();
const { loading, error, processImage, processedImageUrl } = useImageProcess();

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

// 处理图片并跳转结果页
const handleProcess = async () => {
  const result = await processImage(config.value);
  if (result.success) {
    // 保存处理结果状态
    localStorage.setItem(
      "imageProcessState",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("imageProcessState") || "{}"),
        processedImageUrl: processedImageUrl.value,
      })
    );
    router.push({ name: "result" });
  }
};
</script>
