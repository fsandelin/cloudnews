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
    activeNewsItemId: "a",
    selectedCounty: "a"
  },
  mutations: {
    closeDrawer2(state) {
      state.activeNewsItemId = null
      state.selectedCounty = null
    }
  },
  actions: {
    closeDrawer2: ({ commit }) => commit('closeDrawer2'),
  },
  getter: {

  },
  strict: true
})