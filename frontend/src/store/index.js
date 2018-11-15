import Vue from 'vue'
import Vuex from 'vuex'
import europeCountries from '../assets/europe-countries-meta-info.json';
import swedishCounties from '../assets/sweden-counties-meta-info.json';
import swedishMunicipalities from '../assets/sweden-municipalities-meta-info.json';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    countries: europeCountries.map(x => ({ ...x, active: true })),
    counties: swedishCounties.map(x => ({ ...x, active: true })),
    municipalities: swedishMunicipalities.map(x => ({ ...x, active: false })),
    cities: [],
    countyNews: [],
    municipalityNews: [],
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

      state.countyNews.map(newsData => newsData.county.active = !(newsData.county.name === countyName));

      state.municipalityNews.map(newsData => {
        newsData.county.active = !(newsData.county.name === countyName);
        newsData.municipality.active = (newsData.county.name === countyName);
      });
    },
    setActiveNewsItemId(state, id) {
      state.activeNewsItemId = id
    },
    addCountyNews(state, {news, newsData}) {
      let newsForCounty = state.countyNews.find(nd => nd.county.name === newsData.county.name);

      let found = newsForCounty === undefined ? false : true;

      if (found) {
        newsForCounty.news = [ ...newsForCounty.news, news];
      } else {
        newsForCounty = {
          ...newsData,
          news: [news]
        };
        state.countyNews = [ ...state.countyNews, newsForCounty];
      }

    },
    addMunicipalityNews(state, { news, newsData }) {
      let newsForMunicipality = state.municipalityNews.find(nd => nd.municipality.name === newsData.municipality.name);

      let found = newsForMunicipality === undefined ? false : true;

      if (found) {
        newsForMunicipality.news = [ ...newsForMunicipality.news, news];
      } else {
        newsForMunicipality = {
          ...newsData,
          news: [news]
        };
        state.municipalityNews = [ ...state.municipalityNews, newsForMunicipality];
      }

    },
  },
  actions: {
    addNews: ({ state, commit }, news) => {
      let location = { ...news.location }

      if (state.cities.find(city => city.name === location.city)) {
        location = {
          ...location,
          municipality: 'city\'s municipality'
        }
      }

      if (state.municipalities.find(municipality => municipality.name === location.municipality)) {
        location = {
          ...location,
          county: 'municipality\'s county'
        }
      }

      if (state.counties.find(county => county.name === location.county)) {
        location = {
          ...location,
          country: 'sweden'
        }
      }

      commit('addNews', news)
    },
    toggleActive: ({ state, dispatch }, news) => {
      if (news.id === state.activeNewsItemId) dispatch('closeDrawer')
      else dispatch('setActiveNewsItemId', news.id)
    },
    closeDrawer: ({ commit }) => commit('closeDrawer'),
    selectCounty: ({ commit }, countyName) => commit('selectCounty', countyName),
    setActiveNewsItemId: ({ commit }, id) => commit('setActiveNewsItemId', id),
    addCountyNews: ({ commit }, { news, newsData }) => commit('addCountyNews', { news, newsData }),
    addMunicipalityNews: ({ commit }, { news, newsData }) => commit('addMunicipalityNews', { news, newsData }),
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
  strict: process.env.NODE_ENV !== 'production'
})
