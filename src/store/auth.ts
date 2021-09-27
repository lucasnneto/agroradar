import { axiosCall } from "@/service/axios";
import router from "@/router";
import Vue from "vue";
interface StadeBase {
  token: string;
  status: string;
  timeLogin: number;
  name: string;
  userId: string;
  local: Array<any>;
  screen: string;
}
const getDefaultState = () => {
  return {
    token: "",
    status: "",
    timeLogin: 0,
    name: "",
    userId: "",
    local: [],
    screen: "in",
  };
};
const state = getDefaultState();
const getters = {
  token: (state: StadeBase): string => state.token,
  userId: (state: StadeBase): string => state.userId,
  name: (state: StadeBase): string => state.name,
  screen: (state: StadeBase): string => state.screen,
  timeLogin: (state: StadeBase): number => state.timeLogin,
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
  LOGOUT({ commit, dispatch }: any): void {
    dispatch("clearAll", null, { root: true });
    router.push({ name: "home" });
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
      commit("CHANGE", { status: "error" });
      if (error?.response?.data?.message) {
        Vue.$toast.error(error.response.data.message);
      } else {
        Vue.$toast.error("Ocorreu um erro interno!");
      }
    } else {
      commit("CHANGE", {
        token: data.token,
        timeLogin: Date.now(),
        name: data.name,
        userId: data.userId,
        status: "",
      });
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
      if (error?.response?.data?.message) {
        Vue.$toast.error(error.response.data.message);
      } else {
        Vue.$toast.error("Ocorreu um erro interno!");
      }
    } else {
      commit("CHANGE", {
        token: data.token,
        timeLogin: Date.now(),
        name: data.name,
        userId: data.userId,
        status: "",
        screen: "in",
      });
      router.push({ name: "dashboard" });
    }
  },
  async RECUPERAR({ commit, state }: any, payload: any): Promise<void> {
    if (state.status === "loading") return;
    commit("CHANGE", { status: "loading" });
    const [error, data] = await axiosCall({
      method: "post",
      url: "/authenticate/resetPassword",
      data: payload,
    });
    if (error) {
      console.log("error", error);
      commit("CHANGE", { status: "error" });
      if (error?.response?.data?.message) {
        Vue.$toast.error(error.response.data.message);
      } else {
        Vue.$toast.error("Ocorreu um erro interno!");
      }
    } else {
      Vue.$toast.success("Email de recuperação de senha enviado com sucesso");
      commit("CHANGE", {
        status: "",
        screen: "in",
      });
    }
  },
  async NEW_PAS({ commit, state }: any, payload: any): Promise<void> {
    if (state.status === "loading") return;
    commit("CHANGE", { status: "loading" });
    const [error, data] = await axiosCall({
      method: "post",
      url: `/authenticate/registerPassword/${payload.token}`,
      data: payload.payload,
    });
    if (error) {
      console.log("error", error);
      commit("CHANGE", { status: "error" });
      if (error?.response?.data?.message) {
        Vue.$toast.error(error.response.data.message);
      } else {
        Vue.$toast.error("Ocorreu um erro interno!");
      }
    } else {
      Vue.$toast.success("Senha alterada com sucesso");
      commit("CHANGE", {
        status: "",
      });
      router.push({ name: "home" });
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
