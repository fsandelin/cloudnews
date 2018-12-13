import europeCountries from '../../assets/meta-info-europe-countries.min.json'
import swedishCounties from '../../assets/meta-info-sweden-counties.min.json'
import swedishMunicipalities from '../../assets/meta-info-sweden-municipalities.min.json'
import swedishCities from '../../assets/meta-info-sweden-cities.min.json'
import { cleanString } from '../helpers'

const state = {
  countries: europeCountries.map(x => ({ ...x, name: cleanString(x.name), active: true })).filter(({ name }) => name !== 'sweden'),
  counties: swedishCounties.map(x => ({ ...x, name: cleanString(x.name), active: true })),
  municipalities: swedishMunicipalities.map(x => ({ ...x, name: cleanString(x.name), active: false })),
  cities: swedishCities.map(x => ({ ...x, name: cleanString(x.name), active: false })),
  mapCities: [],
  selectedCounty: null,
  selectedMunicipality: null,
  selectedCity: null,
  previousSelectedCounty: null,
  previousSelectedMunicipality: null,
  previousSelectedCity: null
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
  cities: state => {
    return state.cities
  },
  mapCities: state => {
    return state.mapCities
  },
  selectedCounty: state => {
    return state.selectedCounty
  },
  selectedMunicipality: state => {
    return state.selectedMunicipality
  },
  selectedCity: state => {
    return state.selectedCity
  },
  countyByName: state => (name = '') => {
    return state.counties.find(county => cleanString(county.name) === cleanString(name))
  },
  countyByid: state => (id) => {
    return state.counties[id]
  },
  municipalityByName: (state) => (name = '') => {
    return state.municipalities.find(municipality => cleanString(municipality.name) === cleanString(name))
  },
  municipalityById: (state) => (id) => {
    return state.municipalities[id]
  },
  cityByName: (state) => (name = '') => {
    return state.cities.find(city => cleanString(city.name) === cleanString(name))
  },
  cityById: (state) => (id) => {
    return state.cities[id]
  }
}

const actions = {
  selectCounty: ({ commit }, countyName) => commit('selectCounty', countyName),
  selectMunicipality: ({ commit }, municipalityName) => commit('selectMunicipality', municipalityName),
  selectCity: ({ commit }, cityName) => commit('selectCity', cityName),
  setActiveMapCitiesBasedOnPopulation: ({ commit }, population) => commit('setActiveMapCitiesBasedOnPopulation', population),
  countyClick: ({ dispatch }, county) => {
    dispatch('selectCounty', county.name)
    dispatch('selectMunicipality', null)
    dispatch('selectCity', null)
    dispatch('setActiveNewsItemId', null)
  },
  municipalityClick: ({ dispatch }, municipality) => {
    dispatch('selectMunicipality', municipality.name)
    dispatch('selectCity', null)
    dispatch('setActiveNewsItemId', null)
  },
  cityClick: ({ dispatch }, city) => {
    dispatch('selectCity', city.name)
    dispatch('setActiveNewsItemId', null)
  }
}

const mutations = {
  selectCounty (state, countyName) {
    state.selectedCounty = countyName

    state.counties = state.counties.map(county => ({ ...county, active: !(county.name === countyName) }))
    state.municipalities = state.municipalities.map(municipality => ({ ...municipality, active: municipality.county === countyName }))
  },
  selectMunicipality (state, municipalityName) {
    state.selectedMunicipality = municipalityName

    state.cities = state.cities.map(city => ({ ...city, active: city.municipality === municipalityName }))
  },
  selectCity (state, cityName) {
    state.selectedCity = cityName
  },
  openDrawer (state) {
    state.selectedCounty = state.previousSelectedCounty
    state.previousSelectedCounty = null
    state.selectedMunicipality = state.previousSelectedMunicipality
    state.previousSelectedMunicipality = null
    state.selectedCity = state.previousSelectedCity
    state.previousSelectedCity = null

    state.counties = state.counties.map(county => ({ ...county, active: !(county.name === state.selectedCounty) }))
    state.municipalities = state.municipalities.map(municipality => ({ ...municipality, active: municipality.county === state.selectedCounty }))
    state.cities = state.cities.map(city => ({ ...city, active: city.municipality === state.selectedMunicipality }))
  },
  closeDrawer (state) {
    state.counties = state.counties.map(county => ({ ...county, active: true }))
    state.municipalities = state.municipalities.map(municipality => ({ ...municipality, active: false }))
    state.cities = state.cities.map(city => ({ ...city, active: false }))

    state.previousSelectedCounty = state.selectedCounty
    state.selectedCounty = null
    state.previousSelectedMunicipality = state.selectedMunicipality
    state.selectedMunicipality = null
    state.previousSelectedCity = state.selectedCity
    state.selectedCity = null
  },
  toggleActive (state) {
    state.selectedCounty = null
    state.selectedMunicipality = null
    state.selectedCity = null
  },
  setActiveMapCitiesBasedOnPopulation (state, population) {
    state.mapCities = state.cities.filter(city => city.population > population)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
