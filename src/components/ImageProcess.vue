<script setup lang="ts">
import { ref } from "vue";
import { useImageProcess } from "@/composables/useImageProcess";
import type { ImageProcessConfig } from "@/types";

const emit = defineEmits(["process-start", "process-success", "process-error"]);
const imageProcess = useImageProcess();
const { loading, error, processImage } = imageProcess;

// 修改默认配置
const config = ref<ImageProcessConfig>({
  format: "png", // 目标格式PNG
  quality: 90,
  angle: 90, // 旋转90度
  watermarkText: "test", // 水印文字test
  width: 1024, // 宽度1024px
  height: 1024, // 高度1024px
});

const handleReset = () => {
  // 重置后仍保留默认配置
  config.value = {
    format: "png",
    quality: 90,
    angle: 90,
    watermarkText: "test",
    width: 1024,
    height: 1024,
  };
};

const handleProcess = async () => {
  emit("process-start");
  const result = await processImage(config.value);
  if (result.success) {
    emit("process-success");
  } else {
    emit("process-error", result.error || "处理失败，请重试");
  }
};
</script>
