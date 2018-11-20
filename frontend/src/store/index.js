import Vue from 'vue'
import Vuex from 'vuex'
import addWebSocket from './webSocketConnection';
import {
  mutations as m,
  actions as a,
  socketEvents as se,
  socketServiceUrl
} from './constants';
import locations from './modules/locations';
import news from './modules/news';

Vue.use(Vuex)

let socketConnections = []

const store = new Vuex.Store({
  state: {
    zoomValue: 1
  },
  mutations: {
    toggleActive(state) {
      state.news.activeNewsItemId = null
      state.locations.selectedCounty = null
    },
    toggleDrawer(state) {
      if (state.news.activeNewsItemId !== null || state.locations.selectedCounty !== null) {
        // Activate the county and deactivate the municipalities
        for (const county of state.locations.counties) {
          if (!county.active) county.active = true
        }
        state.locations.municipalities.map(municipality => municipality.active = false)

        state.news.previousActiveNewsItemId = state.news.activeNewsItemId
        state.locations.previousSelectedCounty = state.locations.selectedCounty
        state.news.activeNewsItemId = null
        state.locations.selectedCounty = null
      } else {
        state.news.activeNewsItemId = state.news.previousActiveNewsItemId
        state.locations.selectedCounty = state.locations.previousSelectedCounty
        state.news.previousActiveNewsItemId = null
        state.locations.previousSelectedCounty = null

        // Deactivate the county and activate the municipalities
        state.locations.counties.map(county => county.active = !(county.name === state.locations.selectedCounty));
        state.locations.municipalities.map(municipality => municipality.active = municipality.county === state.locations.selectedCounty)
      }
    },
    setZoomValue(state, value) {
      state.zoomValue = value;
    },
  },
  actions: {
    addNewsSource: ({ dispatch }, source) => {
      const events = [
        { url: `${socketServiceUrl}${source}`, event: se.NEWS, action: a.ADD_NEWS },
        { url: `${socketServiceUrl}${source}`, event: se.NEWS_LIST, action: a.ADD_NEWS_LIST },
      ]
      socketConnections = [ ...socketConnections, { source, sockets: addWebSocket(dispatch)(events) } ]
    },
    removeNewsSource: ({}, source) => {
      const socketConnection = socketConnections.find(connection => connection.source === source)
      socketConnection.sockets.map(socket => socket.disconnect())
      socketConnections = socketConnections.filter(connection => connection.source !== source)
    },
    toggleActive: ({ state, dispatch }, news) => {
      if (news.id === state.news.activeNewsItemId) dispatch(a.TOGGLE_DRAWER)
      else dispatch(a.SELECT_ACTIVE_NEWS_ITEM_ID, news.id)
      dispatch(a.SELECT_COUNTY, news.location.county)
    },
    toggleDrawer: ({ commit }) => commit(a.TOGGLE_DRAWER),
    setZoomValue: ({ commit }, value) => commit(m.SET_ZOOM_VALUE, value),
  },
  getters: {
    zoomValue: (state) => {
      return state.zoomValue;
    }
  },
  modules: {
    locations,
    news
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store;
