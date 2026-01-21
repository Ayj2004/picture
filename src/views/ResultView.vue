<template>
  <Layout title="处理结果 | 在线图片处理系统">
    <div class="max-w-4xl mx-auto px-4">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold mb-2">图片处理结果</h1>
        <p class="text-gray-600">预览并下载处理后的图片</p>
      </div>
      <ImagePreview />
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from "@/components/Layout.vue";
import ImagePreview from "@/components/ImagePreview.vue";
</script>
