const state = {
  zoomValue: 1,
  showDatePicker: false,
}

const getters = {
  zoomValue: state => state.zoomValue,
  showDatePicker: state => state.showDatePicker,
}

const actions = {
  setZoomValue: ({ commit }, value) => commit('setZoomValue', value),
  toggleDatePicker: ({ commit }) => commit('toggleDatePicker'),
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
  toggleDatePicker(state) {
    state.showDatePicker = !state.showDatePicker
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
