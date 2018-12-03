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
    dispatch('setActiveNewsItemId', news.id);
    if(news.location.county !== "") dispatch('selectCounty', news.location.county);
    if(news.location.municipality !== "") dispatch('selectMunicipality', news.location.municipality);
    if(news.location.city !== "") dispatch('selectCity', news.location.city);
  }
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
