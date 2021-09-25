import { axiosCall } from "@/service/axios";
import router from "@/router";
import Vue from "vue";
interface StadeBase {
  token: string;
  status: string;
}
const getDefaultState = () => {
  return {
    token: "",
    status: "",
  };
};
const state = getDefaultState();
const getters = {
  token: (state: StadeBase): string => state.token,
};
const mutations = {
  resetState(state: StadeBase): void {
    Object.assign(state, getDefaultState());
  },
  CHANGE(state: StadeBase, payload: StadeBase): void {
    Object.assign(state, payload);
  },
};
const actions = {
  RESET({ commit }: any): void {
    commit("resetState");
  },
  CHANGE({ commit }: any, payload: StadeBase): void {
    commit("CHANGE", payload);
  },
  async LOGIN({ commit, state }: any, payload: any): Promise<void> {
    if (state.status === "loading") return;
    commit("CHANGE", { status: "loading" });
    const [error, data] = await axiosCall({
      method: "post",
      url: "/authenticate",
      data: payload,
    });
    if (error) {
      console.log("error", error);
      commit("CHANGE", { status: "error" });
      if (error?.message) {
        Vue.$toast.error(error.message);
      } else {
        Vue.$toast.error("Ocorreu um erro interno!");
      }
    } else {
      commit("CHANGE", { token: data.token, status: "" });
      router.push({ name: "dashboard" });
    }
  },
  async REGISTRAR({ commit, state }: any, payload: any): Promise<void> {
    if (state.status === "loading") return;
    commit("CHANGE", { status: "loading" });
    const [error, data] = await axiosCall({
      method: "post",
      url: "/users/register",
      data: payload,
    });
    if (error) {
      console.log("error", error);
      commit("CHANGE", { status: "error" });
      if (error?.message) {
        Vue.$toast.error(error.message);
      } else {
        Vue.$toast.error("Ocorreu um erro interno!");
      }
    } else {
      commit("CHANGE", { token: data.token, status: "" });
      router.push({ name: "dashboard" });
    }
  },
};
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
