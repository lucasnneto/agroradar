import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

import auth from "./auth";
import plague from "./plague";
import farm from "./farm";
Vue.use(Vuex);

const vuexLocal = new VuexPersistence<any>({
  storage: window.sessionStorage,
  key: "hackathon",
});

export default new Vuex.Store({
  actions: {
    clearAll(context: any) {
      Object.keys(context.state).forEach((item) => {
        context.commit(`${item}/resetState`);
      });
      sessionStorage.removeItem("hackathon");
    },
  },
  modules: {
    auth,
    plague,
    farm,
  },
  plugins: [vuexLocal.plugin],
});
