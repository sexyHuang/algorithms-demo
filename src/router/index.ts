import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import SortAni from "../views/sortAni";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "sortAni",
    component: SortAni,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
