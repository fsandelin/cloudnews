import {
  mutations as m,
  actions as a,
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
      commit(m.CLOSE_DRAWER)
    } else {
      commit(m.OPEN_DRAWER)
    }
  },
  toggleActive: ({ rootState, dispatch }, news) => {
    if (news.id === rootState.news.activeNewsItemId) dispatch(a.TOGGLE_DRAWER)
    else dispatch(a.SELECT_ACTIVE_NEWS_ITEM_ID, news.id)
    dispatch(a.SELECT_COUNTY, news.location.county)
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
