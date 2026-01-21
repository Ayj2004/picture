# 在线图片处理系统

## 项目简介

在线图片处理系统是一款基于 Vue 3 + TypeScript 开发的前端应用，支持图片上传、格式转换、尺寸缩放、质量调整、旋转、添加水印等一站式图片处理功能，默认提供示例图片快速体验，处理结果可直接下载，界面简洁易用，适配多种设备尺寸。

## 技术栈

- **前端框架**：Vue 3 (Composition API + `<script setup>`)
- **类型校验**：TypeScript
- **样式方案**：Tailwind CSS + 自定义 CSS 变量
- **路由管理**：Vue Router
- **核心能力**：图片本地处理（URL.createObjectURL、Blob 操作）、拖拽上传、异步处理模拟

## 功能特性

### 1. 图片上传

- 支持点击上传/拖拽上传两种方式
- 支持 JPG/PNG/WEBP 等主流图片格式
- 默认加载示例图片（test.png），无需上传即可体验处理功能
- 上传后可预览、移除已上传图片

### 2. 图片处理配置

- **格式转换**：支持 PNG/JPEG/WEBP 格式切换
- **尺寸缩放**：自定义宽度/高度（留空按比例缩放）
- **质量调整**：0-100 可调的图片质量参数
- **旋转角度**：0-360° 自由旋转
- **水印添加**：自定义水印文字（预留扩展能力）

### 3. 处理结果

- 模拟处理延迟（800ms），展示加载状态
- 处理完成后预览结果图片（finish.png）
- 支持下载处理后的图片，自动命名
- 完整的错误提示和状态反馈

### 4. 界面体验

- 响应式布局，适配桌面/移动端
- 卡片式设计，hover 动效增强交互
- 加载动画、状态提示提升用户体验
- 全局样式统一，主题色可灵活配置

## 快速开始

### 环境要求

- Node.js ≥ 16.x
- npm/yarn/pnpm

### 安装依赖

```bash
# 使用npm
npm install

# 使用yarn
yarn install

# 使用pnpm
pnpm install
```

### 本地运行

```bash
# 启动开发服务器
npm run dev

# 构建生产包
npm run build

# 预览构建结果
npm run preview
```

## 项目结构

```
src/
├── assets/            # 静态资源（示例图片）
├── components/        # 通用组件
│   ├── Footer.vue     # 页脚组件
│   ├── ImageProcess.vue # 图片处理配置组件
│   ├── ImageUpload.vue  # 图片上传组件
│   ├── Layout.vue     # 布局组件（包含导航栏/页脚）
│   ├── Navbar.vue     # 导航栏组件
│   └── ImagePreview.vue # 图片预览组件
├── composables/       # 组合式函数
│   └── useImageProcess.ts # 图片处理核心逻辑
├── router/            # 路由配置
│   └── index.ts       # 路由定义
├── styles/            # 全局样式
│   ├── index.css      # Tailwind 基础样式
│   └── style.css      # 自定义全局样式
├── types/             # 类型定义
│   └── index.ts       # 接口/类型声明
├── views/             # 页面视图
│   ├── HomeView.vue   # 首页（核心功能页）
│   └── ResultView.vue # 结果预览页
├── App.vue            # 根组件
├── main.ts            # 入口文件
└── vite-env.d.ts      # Vite 类型声明
```

## 核心逻辑说明

### 图片处理核心（useImageProcess.ts）

- 封装图片上传、处理、下载、重置等核心方法
- 管理全局状态（加载中、错误、已上传文件、处理后图片 URL 等）
- 初始化默认示例图片，支持 URL 释放避免内存泄漏

### 组件通信

- 子组件通过 `emit` 触发事件（如上传成功、处理开始/成功/失败）
- 父组件（HomeView）监听事件并更新状态
- 组合式函数统一管理全局状态，组件间共享状态

## 声明

本项目由阿里云 ESA 提供加速、计算和保护
![阿里云ESA](https://github.com/Ayj2004/picture/blob/main/src/assets/aliyun.png)

## 许可证

© {{ new Date().getFullYear() }} 保留所有权利。
