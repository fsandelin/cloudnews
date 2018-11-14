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
    selectCounty(state, county) {
      state.selectedCounty = county
    },
    setActiveNewsItemId(state, id) {
      state.activeNewsItemId = id
    },
  },
  actions: {
    closeDrawer: ({ commit }) => commit('closeDrawer'),
    selectCounty: ({ commit }, county) => commit('selectCounty', county),
    setActiveNewsItemId: ({ commit }, id) => commit('setActiveNewsItemId', id),
  },
  getters: {
    activeNewsItemId: state => {
      return state.activeNewsItemId
    },
    selectedCounty: state => {
      return state.selectedCounty
    },
  },
  strict: true
})