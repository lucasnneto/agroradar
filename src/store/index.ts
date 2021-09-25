import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

import auth from "./auth";
Vue.use(Vuex);

const vuexLocal = new VuexPersistence<any>({
  storage: window.localStorage,
  key: "hackathon",
});

export default new Vuex.Store({
  modules: {
    auth,
  },
  plugins: [vuexLocal.plugin],
});
