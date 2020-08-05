import Vue from "vue";
import Router from "vue-router";
const Index = () => import("./App.vue");
// const fabric = () => import("./components/fabric.vue");
const fabric = () => import("./page/index.vue");

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/home",
      name: "home",
      component: Index
    },
    // {
    //   path: "/fabric",
    //   name: "fabric",
    //   component: fabric
    // },
    {
      path: "/",
      name: "fabric",
      component: fabric
    }
  ]
});

export default router;
