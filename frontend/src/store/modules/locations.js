import europeCountries from '../../assets/europe-countries-meta-info.json';
import swedishCounties from '../../assets/sweden-counties-meta-info.json';
import swedishMunicipalities from '../../assets/sweden-municipalities-meta-info.json';
import { cleanString } from '../helpers';

const state = {
  countries: europeCountries.map(x => ({ ...x, name: cleanString(x.name), active: true })).filter(({ name }) => name !== "sweden"),
  counties: swedishCounties.map(x => ({ ...x, name: cleanString(x.name), active: true })),
  municipalities: swedishMunicipalities.map(x => ({ ...x, name: cleanString(x.name), active: false })),
  cities: [],
  selectedCounty: null,
  previousSelectedCounty: null,
}

const getters = {
  countries: state => {
    return state.countries
  },
  counties: state => {
    return state.counties
  },
  municipalities: state => {
    return state.municipalities
  },
  selectedCounty: state => {
    return state.selectedCounty
  },
  countyByName: state => (name = "") => {
    return state.counties.find(county => cleanString(county.name) === cleanString(name));
  },
  municipalityByName: (state) => (name = "") => {
    return state.municipalities.find(municipality => cleanString(municipality.name) === cleanString(name));
  },
}

const actions = {
  selectCounty: ({ commit }, countyName) => commit('selectCounty', countyName),
  countyClick: ({ dispatch }, county) => {
    dispatch('selectCounty', county.name);
    dispatch('setActiveNewsItemId', null);
  },
}

const mutations = {
  selectCounty(state, countyName) {
    state.selectedCounty = countyName

    state.counties.map(county => county.active = !(county.name === countyName));
    state.municipalities.map(municipality => municipality.active = municipality.county === countyName)
  },
  openDrawer(state) {
    state.selectedCounty = state.previousSelectedCounty
    state.previousSelectedCounty = null
    state.counties.map(county => county.active = !(county.name === state.selectedCounty));
    state.municipalities.map(municipality => municipality.active = municipality.county === state.selectedCounty)
  },
  closeDrawer(state) {
    state.counties.map(county => county.active = true)
    state.municipalities.map(municipality => municipality.active = false)

    state.previousSelectedCounty = state.selectedCounty
    state.selectedCounty = null
  },
  toggleActive(state) {
    state.selectedCounty = null
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
