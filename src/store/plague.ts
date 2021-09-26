import { axiosCall } from "@/service/axios";
import Vue from "vue";
interface StadeBase {
  items: Array<any>;
  item: any;
  status: string;
  modal: string;
}
const getDefaultState = () => {
  return {
    items: [],
    item: {},
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
  async GET_LIST({ commit, state }: any): Promise<void> {
    if (state.status === "loading") return;
    commit("CHANGE", { status: "loading" });
    const [error, data] = await axiosCall({
      method: "get",
      url: "/plague/list",
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
      commit("CHANGE", { items: data.items, status: "" });
    }
  },
  async NEW_PLAGUE({ commit, state }: any, payload: any): Promise<void> {
    if (state.status === "loading") return;
    commit("CHANGE", { status: "loading" });
    const [error, data] = await axiosCall({
      method: "post",
      url: "/plague/register",
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
      Vue.$toast.success("Registrado com sucesso");
      commit("CHANGE", { status: "", modal: "" });
    }
  },
  async GET_PLAGUE_FILTER({ commit, state }: any, payload: any): Promise<void> {
    if (state.status === "loading") return;
    const uf = payload.state === "BRASIL" ? "" : payload.state;
    commit("CHANGE", { status: "loading" });
    const [error, data] = await axiosCall({
      method: "post",
      url: `/plague/list/${uf}`,
      data: payload.payload,
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
        status: "",
        items: data.items,
        modal: "FILTER",
        item: { state: payload.state },
      });
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
