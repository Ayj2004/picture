<template>
  <Layout title="首页 | 在线图片处理系统">
    <div class="max-w-4xl mx-auto px-4">
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold mb-4">在线图片处理系统</h1>
        <p class="text-gray-600 max-w-2xl mx-auto">
          支持图片格式转换、缩放、旋转、添加水印等功能，基于边缘函数实时处理，无需下载软件
        </p>
      </div>
      <ImageUpload />
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from "@/components/Layout.vue";
import ImageUpload from "@/components/ImageUpload.vue";
</script>
