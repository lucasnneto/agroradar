import { axiosCall } from "@/service/axios";
import router from "@/router";
interface StadeBase {
  token: string;
}
const getDefaultState = () => {
  return {
    token: "",
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
  async LOGIN({ commit }: any, payload: any): Promise<void> {
    const [error, data] = await axiosCall({
      method: "post",
      url: "/authenticate",
      data: payload,
    });
    if (error) {
      console.log(error);
    } else {
      commit("CHANGE", { token: data.token });
      router.push({ name: "dashboard" });
      console.log(data);
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
