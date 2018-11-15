import Vue from 'vue'
import Vuex from 'vuex'
import europeCountries from '../assets/europe-countries-meta-info.json';
import swedishCounties from '../assets/sweden-counties-meta-info.json';
import swedishMunicipalities from '../assets/sweden-municipalities-meta-info.json';
import addWebSocket from './plugins/webSocketConnection.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    countries: europeCountries.map(x => ({ ...x, active: true })),
    counties: swedishCounties.map(x => ({ ...x, active: true })),
    municipalities: swedishMunicipalities.map(x => ({ ...x, active: false })),
    cities: [],
    newsList: [],
    activeNewsItemId: null,
    selectedCounty: null
  },
  mutations: {
    addNews(state, news) {
      state.newsList = [ ...state.newsList, news ]
    },
    toggleActive(state, news) {
      state.activeNewsItemId = null
      state.selectedCounty = null
    },
    closeDrawer(state) {
      state.activeNewsItemId = null
      state.selectedCounty = null
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
    addNews: ({ state, commit }, news) => {
      if (state.newsList.find(x => x.id === news.id)) return

      let location = { ...news.location }

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

      commit('addNews', { ...news, location })
    },
    toggleActive: ({ state, dispatch }, news) => {
      if (news.id === state.activeNewsItemId) dispatch('closeDrawer')
      else dispatch('setActiveNewsItemId', news.id)
    },
    closeDrawer: ({ commit }) => commit('closeDrawer'),
    selectCounty: ({ commit }, countyName) => commit('selectCounty', countyName),
    setActiveNewsItemId: ({ commit }, id) => commit('setActiveNewsItemId', id),
    countyClick: ({ dispatch }, county) => {
      dispatch("selectCounty", county.name);
      dispatch("setActiveNewsItemId", null);
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
      return state.counties.find(county => county.name.toLowerCase().trim() === name.toLowerCase().trim());
    },
    getMunicipalityByName: (state) => (name) => {
      if (name === undefined) return null;
      return state.municipalities.find(municipality => municipality.name.toLowerCase().trim() === name.toLowerCase().trim());
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})

const SERVER = true
if (SERVER) {
  const event = 'news'
  const url = 'http://localhost:3020/?services=eyJzZXJ2aWNlcyI6IFsidHQiXX0='
  const action = 'addNews'
  addWebSocket(store)(event, url, action)
}

export default store;
