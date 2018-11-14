import Vue from 'vue'
import Vuex from 'vuex'
import europeCountries from '../assets/europe-countries-meta-info.json';
import swedishCounties from '../assets/sweden-counties-meta-info.json';
import swedishMunicipalities from '../assets/sweden-municipalities-meta-info.json';
import { fakeNewsList } from '../assets/FakeData'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    countries: europeCountries.map(x => ({ ...x, active: true })),
    counties: swedishCounties.map(x => ({ ...x, active: true })),
    municipalities: swedishMunicipalities.map(x => ({ ...x, active: false })),
    cities: [],
    countyNews: [],
    municipalityNews: [],
    newsList: fakeNewsList,
    activeNewsItemId: null,
    selectedCounty: null
  },
  mutations: {
    closeDrawer(state) {
      state.activeNewsItemId = null
      state.selectedCounty = null
    },
    selectCounty(state, countyName) {
      state.selectedCounty = countyName

      state.counties = state.counties.map(x => ({
        ...x,
        active: !(x.name === countyName)
      }))

      state.municipalities = state.municipalities.map(municipality => ({
        ...municipality,
        active: municipality.county === countyName
      }));

      state.countyNews = state.countyNews.map(x => {
        const _metaData = x[0]
        const _newsList = x[1]
        return [ {
          ..._metaData,
          county: {
            ..._metaData.county,
            active: !(_metaData.county.name === countyName) }
        },
          _newsList ]
      })

      state.municipalityNews = state.municipalityNews.map(x => {
        const _metaData = x[0]
        const _newsList = x[1]
        return [ {
          ..._metaData,
          county: {
            ..._metaData.county,
            active: !(_metaData.county.name === countyName) },
          municipality: {
            ..._metaData.municipality,
            active: (_metaData.county.name === countyName) }
        },
          _newsList ]
      })

    },
    setActiveNewsItemId(state, id) {
      state.activeNewsItemId = id
    },
    addCountyNews(state, { news, newsMetaData }) {
      let found = false;
      let newsForCounty = [newsMetaData, []];
      for (let cNews of state.countyNews) {
        if (cNews[0].county.name === newsMetaData.county.name) {
          newsForCounty = cNews;
          found = true;
        }
      }
      newsForCounty[1] = [ ...newsForCounty[1], news]
      if (!found) {
        state.countyNews = [ ...state.countyNews, newsForCounty]
      }
    },
    addMunicipalityNews(state, { news, newsMetaData }) {
      let found = false;
      let newsForMunicipality = [newsMetaData, []];
      for (let mNews of state.municipalityNews) {
        if (mNews[0].municipality.name === newsMetaData.municipality.name) {
          newsForMunicipality = mNews;
          found = true;
        }
      }
      newsForMunicipality[1] = [ ...newsForMunicipality[1], news]
      if (!found) {
        state.municipalityNews = [ ...state.municipalityNews, newsForMunicipality]
      }
    },
  },
  actions: {
    closeDrawer: ({ commit }) => commit('closeDrawer'),
    selectCounty: ({ commit }, countyName) => commit('selectCounty', countyName),
    setActiveNewsItemId: ({ commit }, id) => commit('setActiveNewsItemId', id),
    addCountyNews: ({ commit }, { news, newsMetaData }) => commit('addCountyNews', { news, newsMetaData }),
    addMunicipalityNews: ({ commit }, { news, newsMetaData }) => commit('addMunicipalityNews', { news, newsMetaData }),
    countyClick: function({ dispatch }, county) {
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
    countyNews: state => {
      return state.countyNews
    },
    municipalityNews: state => {
      return state.municipalityNews
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
  strict: true
})
