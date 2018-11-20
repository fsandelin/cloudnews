import Vue from 'vue'
import Vuex from 'vuex'
import addWebSocket from './webSocketConnection';
import {
  mutations as m,
  actions as a,
  socketEvents as se,
  socketServiceUrl
} from './constants';
import { cleanString } from './helpers';
import locations from './modules/locations';

Vue.use(Vuex)

let socketConnections = []

const store = new Vuex.Store({
  state: {
    newsList: [],
    activeNewsItemId: null,
    previousActiveNewsItemId: null,
    previousSelectedCounty: null,
    zoomValue: 1
  },
  mutations: {
    addNews(state, news) {
      state.newsList = [ ...state.newsList, news ]
    },
    toggleActive(state) {
      state.activeNewsItemId = null
      state.locations.selectedCounty = null
    },
    toggleDrawer(state) {
      if (state.activeNewsItemId !== null || state.locations.selectedCounty !== null) {
        // Activate the county and deactivate the municipalities
        for (const county of state.locations.counties) {
          if (!county.active) county.active = true
        }
        state.locations.municipalities.map(municipality => municipality.active = false)

        state.previousActiveNewsItemId = state.activeNewsItemId
        state.previousSelectedCounty = state.locations.selectedCounty
        state.activeNewsItemId = null
        state.locations.selectedCounty = null
      } else {
        state.activeNewsItemId = state.previousActiveNewsItemId
        state.locations.selectedCounty = state.previousSelectedCounty
        state.previousActiveNewsItemId = null
        state.previousSelectedCounty = null

        // Deactivate the county and activate the municipalities
        state.locations.counties.map(county => county.active = !(county.name === state.locations.selectedCounty));
        state.locations.municipalities.map(municipality => municipality.active = municipality.county === state.locations.selectedCounty)
      }
    },
    setActiveNewsItemId(state, id) {
      state.activeNewsItemId = id
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
    addNews: ({ state, commit }, news) => {
      if (state.newsList.find(x => x.id === news.id)) return

      let location = { ...news.location }
      for (const key of Object.keys(location)) {
        location[key] = cleanString(location[key])
      }
      if (state.locations.cities.find(city => city.name === location.city)) {

        const municipalityName = state.locations.counties.find(municipality =>
          municipality.municipalities.find(city =>
            city === location.city
        )).name

        location = {
          ...location,
          municipality: municipalityName
        }
      }

      if (state.locations.municipalities.find(municipality => municipality.name === location.municipality)) {

        const countyName = state.locations.counties.find(county =>
          county.municipalities.find(municipality =>
            municipality === location.municipality
        )).name

        location = {
          ...location,
          county: countyName
        }
      }

      if (state.locations.counties.find(county => county.name === location.county)) {
        location = {
          ...location,
          country: 'sweden'
        }
      }

      commit(m.ADD_NEWS, { ...news, location });
    },
    addNewsList: ({ dispatch }, newsList) => {
      newsList.map(news => dispatch(a.ADD_NEWS, news))
    },
    toggleActive: ({ state, dispatch }, news) => {
      if (news.id === state.activeNewsItemId) dispatch(a.TOGGLE_DRAWER)
      else dispatch(a.SELECT_ACTIVE_NEWS_ITEM_ID, news.id)
      dispatch(a.SELECT_COUNTY, news.location.county)
    },
    toggleDrawer: ({ commit }) => commit(a.TOGGLE_DRAWER),
    setActiveNewsItemId: ({ commit }, id) => commit(a.SELECT_ACTIVE_NEWS_ITEM_ID, id),
    setZoomValue: ({ commit }, value) => commit(m.SET_ZOOM_VALUE, value),
  },
  getters: {
    newsList: state => {
      return state.newsList
    },
    filteredNewsList: (state, getters) => {
      return state.newsList.filter(news => {
        const municipality = getters.municipalityByName(news.location.municipality)
        const countyName = municipality ? municipality.county : null
        return countyName === state.locations.selectedCounty
      })
    },
    selectedCountyNews: state => {
      return state.newsList.filter(({ location }) => location.county === state.locations.selectedCounty)
    },
    newsByCounty: state => {
      return state.locations.counties.map(county => {

        return {
          ...county,
          news: state.newsList.filter(({ location }) => location.county === county.name)
        }

      }).filter(({ news }) => news.length > 0)
    },
    newsByMunicipality: (state, getters) => {

      return state.locations.municipalities.map(municipality => {
        return {
          ...municipality,
          news: state.newsList.filter(({ location }) => location.municipality === municipality.name)
        }

      }).filter(({ news }) => news.length > 0)
        .map(municipality => {
          const county = getters.countyByName(municipality.county);
          return {
            ...municipality,
            countyX: county.x,
            countyY: county.y
          }
        });
    },
    activeNewsItemId: state => {
      return state.activeNewsItemId
    },
    activeNewsItem: state => {
      const newsItem = state.newsList.find(item => item.id === state.activeNewsItemId)
      return newsItem !== undefined && 'id' in newsItem ? newsItem : null;
    },
    zoomValue: (state) => {
      return state.zoomValue;
    }
  },
  modules: {
    locations
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store;
