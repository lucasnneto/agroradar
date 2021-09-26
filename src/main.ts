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

Vue.use(VueMask);
Vue.use(VueToast, {
  position: "top-right",
});
dotenv.config();

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
