import Vue from 'vue'
import Vuex from 'vuex'
import europeCountries from '../assets/europe-countries-meta-info.json';
import swedishCounties from '../assets/sweden-counties-meta-info.json';
import swedishMunicipalities from '../assets/sweden-municipalities-meta-info.json';
import addWebSocket from './webSocketConnection';
import {
  mutations as m,
  actions as a,
  socketEvents as se,
  socketServiceUrl
} from './constants';
import { cleanString } from './helpers';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    countries: europeCountries.map(x => ({ ...x, name: cleanString(x.name), active: true })),
    counties: swedishCounties.map(x => ({ ...x, name: cleanString(x.name), active: true })),
    municipalities: swedishMunicipalities.map(x => ({ ...x, name: cleanString(x.name), active: false })),
    cities: [],
    newsList: [],
    activeNewsItemId: null,
    selectedCounty: null,
    previousActiveNewsItemId: null,
    previousSelectedCounty: null,
    socketConnections: []
  },
  mutations: {
    addSocketSource(state, source) {
      state.socketConnections = [ ...state.socketConnections, { source, ids: [] }]
    },
    addSocketId(state, { source, id }) {
      state.socketConnections= state.socketConnections.map(connection => {
        return connection.source === source ?
          { ...connection, ids: [ ...connection.ids, id ] } :
          connection
      })
    },
    addNews(state, news) {
      state.newsList = [ ...state.newsList, news ]
    },
    toggleActive(state) {
      state.activeNewsItemId = null
      state.selectedCounty = null
    },
    toggleDrawer(state) {
      if (state.activeNewsItemId !== null || state.selectedCounty !== null) {
        // Activate the county and deactivate the municipalities
        for (const county of state.counties) {
          if (!county.active) county.active = true
        }
        state.municipalities.map(municipality => municipality.active = false)

        state.previousActiveNewsItemId = state.activeNewsItemId
        state.previousSelectedCounty = state.selectedCounty
        state.activeNewsItemId = null
        state.selectedCounty = null
      } else {
        state.activeNewsItemId = state.previousActiveNewsItemId
        state.selectedCounty = state.previousSelectedCounty
        state.previousActiveNewsItemId = null
        state.previousSelectedCounty = null

        // Deactivate the county and activate the municipalities
        state.counties.map(county => county.active = !(county.name === state.selectedCounty));
        state.municipalities.map(municipality => municipality.active = municipality.county === state.selectedCounty)
      }
    },
    selectCounty(state, countyName) {
      state.selectedCounty = countyName

      state.counties.map(county => county.active = !(county.name === countyName));
      state.municipalities.map(municipality => municipality.active = municipality.county === countyName)
    },
    setActiveNewsItemId(state, id) {
      state.activeNewsItemId = id
    },
  },
  actions: {
    addNewsSources: ({ state, dispatch, commit }, newsSources) => {

      newsSources.map(source => {
        const events = [
          { url: `${socketServiceUrl}${source}`, event: se.NEWS, action: a.ADD_NEWS },
          { url: `${socketServiceUrl}${source}`, event: se.NEWS_LIST, action: a.ADD_NEWS_LIST },
        ]

        if (!state.socketConnections.find(connection => connection.source === source)) {
          commit(m.ADD_SOCKET_SOURCE, source)
        }

        addWebSocket(dispatch, commit)(source, events)
      })
    },
    addNews: ({ state, commit }, news) => {
      if (state.newsList.find(x => x.id === news.id)) return

      let location = { ...news.location }
      for (const key of Object.keys(location)) {
        location[key] = cleanString(location[key])
      }

      if (state.cities.find(city => city.name === location.city)) {

        const municipalityName = state.counties.find(municipality =>
          municipality.municipalities.find(city =>
            city === location.city
        )).name

        location = {
          ...location,
          municipality: municipalityName
        }
      }

      if (state.municipalities.find(municipality => municipality.name === location.municipality)) {

        const countyName = state.counties.find(county =>
          county.municipalities.find(municipality =>
            municipality === location.municipality
        )).name

        location = {
          ...location,
          county: countyName
        }
      }

      if (state.counties.find(county => county.name === location.county)) {
        location = {
          ...location,
          country: 'sweden'
        }
      }

      commit(m.ADD_NEWS, { ...news, location })
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
    selectCounty: ({ commit }, countyName) => commit(m.SELECT_COUNTY, countyName),
    setActiveNewsItemId: ({ commit }, id) => commit(a.SELECT_ACTIVE_NEWS_ITEM_ID, id),
    countyClick: ({ dispatch }, county) => {
      dispatch(a.SELECT_COUNTY, county.name);
      dispatch(a.SELECT_ACTIVE_NEWS_ITEM_ID, null);
    }
  },
  getters: {
    countries: state => {
      return state.countries
    },
    counties: state => {
      return state.counties
    },
    municipalities: state => {
      return state.municipalities
    },
    newsList: state => {
      return state.newsList
    },
    filteredNewsList: (state, getters) => {
      return state.newsList.filter(news => {
        const municipality = getters.getMunicipalityByName(news.location.municipality)
        const countyName = municipality !== null ? municipality.county : null
        return countyName === state.selectedCounty
      })
    },
    selectedCountyNews: state => {
      return state.newsList.filter(({ location }) => location.county === state.selectedCounty)
    },
    newsByCounty: state => {
      return state.counties.map(county => {

        return {
          ...county,
          news: state.newsList.filter(({ location }) => location.county === county.name)
        }

      }).filter(({ news }) => news.length > 0)
    },
    newsByMunicipality: state => {
      return state.municipalities.map(municipality => {

        return {
          ...municipality,
          news: state.newsList.filter(({ location }) => location.municipality === municipality.name)
        }

      }).filter(({ news }) => news.length > 0)
    },
    activeNewsItemId: state => {
      return state.activeNewsItemId
    },
    activeNewsItem: state => {
      const newsItem = state.newsList.find(item => item.id === state.activeNewsItemId)
      return newsItem !== undefined && 'id' in newsItem ? newsItem : null;
    },
    selectedCounty: state => {
      return state.selectedCounty
    },
    getCountyByName: (state) => (name) => {
      if (name === undefined) return null;
      return state.counties.find(county => cleanString(county.name) === cleanString(name));
    },
    getMunicipalityByName: (state) => (name) => {
      if (name === undefined) return null;
      return state.municipalities.find(municipality => cleanString(municipality.name) === cleanString(name));
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store;
