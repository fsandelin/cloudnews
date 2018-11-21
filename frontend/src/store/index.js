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
import gui from './modules/gui';

Vue.use(Vuex)

let socketConnections = []

const store = new Vuex.Store({
  mutations: {
    toggleActive(state) {
      state.news.activeNewsItemId = null
      state.locations.selectedCounty = null
    },
    openDrawer(state) {
      state.locations.selectedCounty = state.locations.previousSelectedCounty
      state.locations.previousSelectedCounty = null
      state.locations.counties.map(county => county.active = !(county.name === state.locations.selectedCounty));
      state.locations.municipalities.map(municipality => municipality.active = municipality.county === state.locations.selectedCounty)

      state.news.activeNewsItemId = state.news.previousActiveNewsItemId
      state.news.previousActiveNewsItemId = null
    },
    closeDrawer(state) {
      state.locations.counties.map(county => county.active = true)
      state.locations.municipalities.map(municipality => municipality.active = false)

      state.locations.previousSelectedCounty = state.locations.selectedCounty
      state.locations.selectedCounty = null

      state.news.previousActiveNewsItemId = state.news.activeNewsItemId
      state.news.activeNewsItemId = null
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
  },
  modules: {
    locations,
    news,
    gui
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store;
