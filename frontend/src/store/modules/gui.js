const state = {
  zoomValue: 1
}

const getters = {
  zoomValue: (state) => {
    return state.zoomValue;
  }
}

const actions = {
  setZoomValue: ({ commit }, value) => commit('setZoomValue', value),
  toggleDrawer: ({ rootState, commit }) => {
    if (rootState.news.activeNewsItemId !== null || rootState.locations.selectedCounty !== null) {
      commit('closeDrawer')
    } else {
      commit('openDrawer')
    }
  },
  toggleActive: ({ rootState, dispatch }, news) => {
    if (news.id === rootState.news.activeNewsItemId) dispatch('toggleDrawer')
    else dispatch('setActiveNewsItemId', news.id)
    dispatch('selectCounty', news.location.county)
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
