import {
  mutations as m,
} from '../constants';

const state = {
  zoomValue: 1
}

const getters = {
  zoomValue: (state) => {
    return state.zoomValue;
  }
}

const actions = {
  setZoomValue: ({ commit }, value) => commit(m.SET_ZOOM_VALUE, value),
}

const mutations = {
  setZoomValue(state, value) {
    state.zoomValue = value;
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
