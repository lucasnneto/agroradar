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
  token: (state: StadeBase) => state.token,
};
const mutations = {
  resetState(state: StadeBase) {
    Object.assign(state, getDefaultState());
  },
  CHANGE(state: StadeBase, payload: StadeBase) {
    Object.assign(state, payload);
  },
};
const actions = {
  RESET({ commit }: any) {
    commit("resetState");
  },
  CHANGE({ commit }: any, payload: StadeBase) {
    commit("CHANGE", payload);
  },
};
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
