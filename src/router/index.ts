import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import store from "@/store";
import Home from "../views/Home.vue";
import Sign from "../components/Sign.vue";
import Dashboard from "../views/Dashboard.vue";
import Plague from "../views/Plague.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "home",
    component: Home,
    children: [
      {
        path: "/sign",
        name: "sign",
        component: Sign,
      },
    ],
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    meta: { auth: true },
  },
  {
    path: "/plague",
    name: "plague",
    component: Plague,
    meta: { auth: true },
  },
  {
    path: "*",
    redirect: { name: "home" },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, _, next) => {
  const isLoggedIn = store.getters["auth/token"];
  const requiredAuth = to.meta?.auth;

  if (!isLoggedIn && requiredAuth) return next({ name: "sign" });

  return next();
});

export default router;
