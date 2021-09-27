import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import dotenv from "dotenv";
import "@/plugins/leaflet";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-default.css";
import VueMask from "v-mask";
import "leaflet-draw/dist/leaflet.draw.css";
import VueApexCharts from "vue-apexcharts";
Vue.use(VueApexCharts);

Vue.component("apexchart", VueApexCharts);
Vue.use(VueMask);
Vue.use(VueToast, {
  position: "top-right",
});
Vue.directive("uppercase", (el, _, vnode) => {
  const input = el.querySelectorAll("input")[0];
  if (input) {
    const processedValue = input.value.toUpperCase();
    input.value = processedValue;
    (vnode.componentInstance as any).$emit("input", processedValue);
  }
});

dotenv.config();

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
