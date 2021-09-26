import router from "@/router";
import { axiosCall } from "@/service/axios";
import Vue from "vue";
interface StadeBase {
  items: Array<any>;
  status: string;
  modal: string;
}
const getDefaultState = () => {
  return {
    items: [],
    status: "",
    modal: "",
  };
};
const state = getDefaultState();
const getters = {};
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
  async GET_LIST({ commit, state }: any, payload: any): Promise<void> {
    if (state.status === "loading") return;
    commit("CHANGE", { status: "loading" });
    const [error, data] = await axiosCall({
      method: "get",
      url: `/farm/list/${payload}`,
    });
    if (error) {
      commit("CHANGE", { status: "error" });
      if (error?.response?.data?.message) {
        Vue.$toast.error(error.response.data.message);
      } else {
        Vue.$toast.error("Ocorreu um erro interno!");
      }
    } else {
      commit("CHANGE", { items: data.items, status: "" });
    }
  },
  async NEW_FARM({ commit, state }: any, payload: any): Promise<void> {
    if (state.status === "loading") return;
    commit("CHANGE", { status: "loading" });
    const [error, data] = await axiosCall({
      method: "post",
      url: `/farm/register`,
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
      Vue.$toast.success("Fazenda criada com sucesso");
      commit("CHANGE", { status: "" });
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
