import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Upload from "../views/Upload.vue";
import NotFound from "../views/NotFound.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Upload",
    component: () => import("../views/Upload.vue"),
  },
  {
    path: "/files",
    name: "Files",
    component: () => import("../views/Files.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
