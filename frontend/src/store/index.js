import Vue from 'vue'
import Vuex from 'vuex'
import europeCountries from '../assets/europe-countries-meta-info.json';
import swedishCounties from '../assets/sweden-counties-meta-info.json';
import swedishMunicipalities from '../assets/sweden-municipalities-meta-info.json';
import { isNull } from 'util';

Vue.use(Vuex)

const cleanString = s => s.trim().toLowerCase() 

export default new Vuex.Store({
  state: {
    countries: europeCountries.map(x => ({ ...x, name: cleanString(x.name), active: true })),
    counties: swedishCounties.map(x => ({ ...x, name: cleanString(x.name), active: true })),
    municipalities: swedishMunicipalities.map(x => ({ ...x, name: cleanString(x.name), active: false })),
    cities: [],
    newsList: [],
    activeNewsItemId: null,
    selectedCounty: null,
    previousActiveNewsItemId: null,
    previousSelectedCounty: null
  },
  mutations: {
    addNews(state, news) {
      state.newsList = [ ...state.newsList, news ]
    },
    toggleActive(state, news) {
      state.activeNewsItemId = null
      state.selectedCounty = null
    },
    toggleDrawer(state) {
      if (state.activeNewsItemId !== null || state.selectedCounty !== null) {
        state.previousActiveNewsItemId = state.activeNewsItemId
        state.previousSelectedCounty = state.selectedCounty
        state.activeNewsItemId = null
        state.selectedCounty = null
      } else {
        state.activeNewsItemId = state.previousActiveNewsItemId
        state.selectedCounty = state.previousSelectedCounty
        state.previousActiveNewsItemId = null
        state.previousSelectedCounty = null
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

      commit('addNews', { ...news, location })
    },
    toggleActive: ({ state, dispatch }, news) => {
      if (news.id === state.activeNewsItemId) dispatch('toggleDrawer')
      else dispatch('setActiveNewsItemId', news.id)
      dispatch('selectCounty', news.location.county)
    },
    toggleDrawer: ({ commit }) => commit('toggleDrawer'),
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
