<template>
  <Layout title="处理配置 | 在线图片处理系统">
    <div class="max-w-4xl mx-auto px-4">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold mb-2">图片处理配置</h1>
        <p class="text-gray-600">根据需求调整图片处理参数</p>
      </div>
      <ImageProcess />
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from "@/components/Layout.vue";
import ImageProcess from "@/components/ImageProcess.vue";
</script>
