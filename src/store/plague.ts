import { axiosCall } from "@/service/axios";
import Vue from "vue";
interface StadeBase {
  items: Array<any>;
  lista: Array<any>;
  item: any;
  notification: any;
  status: string;
  modal: string;
}
const getDefaultState = () => {
  return {
    items: [],
    lista: [],
    item: {},
    notification: {},
    status: "",
    modal: "",
    data: {},
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
  REMOVE(state: StadeBase, payload: string): void {
    const id = state.notification.findIndex((el: any) => el._id === payload);
    if (id !== -1) {
      state.notification.splice(id, 1);
    }
  },
  LOAD(state: StadeBase, payload: any): void {
    const id = state.notification.findIndex((el: any) => el._id === payload.id);
    if (id !== -1) {
      state.notification[id].load = payload.status;
    }
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
      headers: {
        "Content-Type": "multipart/form-data",
      },
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
    commit("CHANGE", { status: "loadingMap" });
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
  async GET_NOTIFICATION({ commit, state }: any, payload: any): Promise<void> {
    if (state.status === "loading") return;
    commit("CHANGE", { status: "loading" });
    const [error, data] = await axiosCall({
      method: "get",
      url: `/plague/notification/${payload}`,
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
        notification: data.items.map((el: any) => ({ ...el, load: false })),
        modal: "ALERT",
      });
    }
  },
  async GET_DATA({ commit, state }: any): Promise<void> {
    if (state.status === "loading") return;
    commit("CHANGE", { status: "loadingData" });
    const [error, data] = await axiosCall({
      method: "get",
      url: `/plague/frontList`,
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
        data: data.items,
      });
    }
  },
  async GET_LISTA({ commit, state }: any): Promise<void> {
    if (state.status === "loading") return;
    commit("CHANGE", { status: "loadingData" });
    const [error, data] = await axiosCall({
      method: "get",
      url: `/plague/listPlagues`,
    });
    if (error) {
      commit("CHANGE", { status: "error" });
      if (error?.response?.data?.message) {
        Vue.$toast.error(error.response.data.message);
      } else {
        Vue.$toast.error("Ocorreu um erro interno!");
      }
    } else {
      const l = data;
      l.push("OUTRO");
      commit("CHANGE", {
        status: "",
        lista: l,
      });
    }
  },
  async GET_DATA_STATE({ commit, state }: any, payload: any): Promise<void> {
    if (state.status === "loading") return;
    commit("CHANGE", { status: "loadingData" });
    const [error, data] = await axiosCall({
      method: "get",
      url: `/plague/frontList/${payload}`,
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
        data: data.items,
      });
    }
  },
  async REMOVENOT({ commit, state }: any, payload: any): Promise<void> {
    if (state.status === "loading") return;
    commit("LOAD", { id: payload, status: true });
    const [error, data] = await axiosCall({
      method: "delete",
      url: `/plague/notification/${payload}`,
    });
    if (error) {
      commit("LOAD", { id: payload, status: false });

      if (error?.response?.data?.message) {
        Vue.$toast.error(error.response.data.message);
      } else {
        Vue.$toast.error("Ocorreu um erro interno!");
      }
    } else {
      commit("REMOVE", payload);
      commit("LOAD", { id: payload, status: false });
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
