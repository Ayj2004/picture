├── 边缘函数代码：image-process-edge.js（部署到边缘函数平台）
├── 前端 Vue 项目
│ ├── src/
│ │ ├── components/ # 核心组件
│ │ │ ├── Layout.vue # 布局组件（导航+页脚）
│ │ │ ├── Navbar.vue # 导航栏（图片处理系统标题）
│ │ │ ├── Footer.vue # 页脚（版权信息）
│ │ │ ├── ImageUpload.vue # 图片上传组件
│ │ │ ├── ImageProcess.vue # 处理参数配置组件
│ │ │ └── ImagePreview.vue # 结果预览/下载组件
│ │ ├── views/ # 页面
│ │ │ ├── HomeView.vue # 首页（上传入口）
│ │ │ ├── ProcessView.vue # 处理配置页
│ │ │ └── ResultView.vue # 处理结果页
│ │ ├── router/index.ts # 路由配置（图片处理相关）
│ │ ├── composables/
│ │ │ └── useImageProcess.ts # 图片处理请求逻辑
│ │ ├── types/index.ts # 类型定义（图片处理相关）
│ │ ├── main.ts # 入口（不变）
│ │ ├── App.vue # 根组件（不变）
│ │ ├── index.css # 样式（微调主题）
│ │ └── vite-env.d.ts # 类型声明（不变）
│ ├── package.json # 依赖（不变，需确保安装 vue-router/tailwind）
│ └── vite.config.ts # 构建配置（不变）
