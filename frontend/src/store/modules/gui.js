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
  toggleDrawer: ({ rootState, commit }) => {
    if (rootState.news.activeNewsItemId !== null || rootState.locations.selectedCounty !== null) {
      commit(m.OPEN_DRAWER)
    } else {
      commit(m.CLOSE_DRAWER)
    }
  },
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
