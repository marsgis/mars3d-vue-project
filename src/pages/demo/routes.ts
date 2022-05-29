import type { RouteRecordRaw } from "vue-router"
import { createRouter, createWebHashHistory } from "vue-router"

const routes: RouteRecordRaw[] = [
  { name: "mars-home", path: "/", component: () => import("./views/mars-home.vue") },
  { name: "mars-map", path: "/mars-map", component: () => import("./views/mars-map.vue") },
  { name: "mars-widget", path: "/mars-widget", component: () => import("./views/mars-widget.vue") }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
