import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import ProcessView from "@/views/ProcessView.vue";
import ResultView from "@/views/ResultView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/process",
      name: "process",
      component: ProcessView,
      meta: { requiresFile: true }, // 需要先上传文件
    },
    {
      path: "/result",
      name: "result",
      component: ResultView,
      meta: { requiresProcess: true }, // 需要先处理图片
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

// 路由守卫：检查文件/处理状态
router.beforeEach((to, from, next) => {
  const imageProcessState = JSON.parse(
    localStorage.getItem("imageProcessState") || "{}"
  );
  if (to.meta.requiresFile && !imageProcessState.uploadedFileUrl) {
    next({ name: "home" });
  } else if (to.meta.requiresProcess && !imageProcessState.processedImageUrl) {
    next({ name: "process" });
  } else {
    next();
  }
});

export default router;
