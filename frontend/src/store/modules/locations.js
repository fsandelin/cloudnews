import europeCountries from '../../assets/meta-info-europe-countries.json';
import swedishCounties from '../../assets/meta-info-sweden-counties.json';
import swedishMunicipalities from '../../assets/meta-info-sweden-municipalities.json';
import swedishCities from '../../assets/meta-info-sweden-cities.json';
import { cleanString } from '../helpers';

const state = {
  countries: europeCountries.map(x => ({ ...x, name: cleanString(x.name), active: true })).filter(({ name }) => name !== "sweden"),
  counties: swedishCounties.map(x => ({ ...x, name: cleanString(x.name), active: true })),
  municipalities: swedishMunicipalities.map(x => ({ ...x, name: cleanString(x.name), active: false })),
  cities: swedishCities.map(x => ({ ...x, name: cleanString(x.name), active: false })),
  mapCities: [],
  selectedCounty: null,
  previousSelectedCounty: null,
  selectedMunicipality: null,
  previousSelectedCountyMunicipality: null
}

const getters = {
  countries: state => {
    return state.countries;
  },
  counties: state => {
    return state.counties;
  },
  municipalities: state => {
    return state.municipalities;
  },
  cities: state => {
    return state.cities;
  },
  mapCities: state => {
    return state.mapCities;
  },
  selectedCounty: state => {
    return state.selectedCounty;
  },
  countyByName: state => (name = "") => {
    return state.counties.find(county => cleanString(county.name) === cleanString(name));
  },
  municipalityByName: (state) => (name = "") => {
    return state.municipalities.find(municipality => cleanString(municipality.name) === cleanString(name));
  },
  cityByName: (state) => (name = "") => {
    return state.cities.find(city => cleanString(city.name) === cleanString(name));
  },
}

const actions = {
  selectCounty: ({ commit }, countyName) => commit('selectCounty', countyName),
  selectMunicipality: ({ commit }, municipalityName) => commit('selectMunicipality', municipalityName),
  setActiveMapCitiesBasedOnPopulation: ({ commit }, population) => commit('setActiveMapCitiesBasedOnPopulation', population),
  countyClick: ({ dispatch }, county) => {
    dispatch('selectCounty', county.name);
    dispatch('selectMunicipality', null);
    dispatch('setActiveNewsItemId', null);
  },
  municipalityClick: ({ dispatch }, municipality) => {
    dispatch('selectMunicipality', municipality.name);
    dispatch('setActiveNewsItemId', null);
  },
}

const mutations = {
  selectMunicipality(state, municipalityName) {
    state.selectMunicipality = municipalityName;

    state.cities.map(city => city.active = city.municipality === municipalityName)
  },
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
  setActiveMapCitiesBasedOnPopulation(state, population) {
    state.mapCities = state.cities.filter(city => city.population > population)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
