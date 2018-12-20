import {
  cleanString,
  variableIsAPositiveInteger
} from '../../helpers/misc'

const state = {
  countriesLoaded: false,
  countiesLoaded: false,
  municipalitiesLoaded: false,
  citiesLoaded: false,
  countries: [],
  counties: [],
  municipalities: [],
  cities: [],
  mapCountyNameId: {},
  mapMunicipalityNameId: {},
  mapCityNameId: {},
  mapCities: [],
  selectedCounty: null,
  selectedCountyId: null,
  selectedMunicipality: null,
  selectedMunicipalityId: null,
  selectedCity: null,
  selectedCityId: null,
  previousSelectedCounty: null,
  previousSelectedCountyId: null,
  previousSelectedMunicipality: null,
  previousSelectedMunicipalityId: null,
  previousSelectedCity: null,
  previousSelectedCityId: null
}

const getters = {
  mapLoaded: state => {
    return state.countriesLoaded &&
           state.countiesLoaded &&
           state.municipalitiesLoaded &&
           state.citiesLoaded
  },
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
  selectedCountyId: state => {
    return state.selectedCountyId
  },
  selectedMunicipality: state => {
    return state.selectedMunicipality
  },
  selectedMunicipalityId: state => {
    return state.selectedMunicipalityId
  },
  selectedCity: state => {
    return state.selectedCity
  },
  selectedCityId: state => {
    return state.selectedCityId
  },
  activeCounties: state => {
    return state.counties.filter(county => county.id === state.selectedCountyId)
  },
  activeMunicipalities: state => {
    return state.municipalities.filter(municipality => municipality.county === state.selectedCounty)
  },
  countyById: state => (id = -1) => {
    return variableIsAPositiveInteger(id)
      ? state.counties[id]
      : null
  },
  activeCities: state => {
    return state.cities.filter(city => city.municipality === state.selectedMunicipality)
  },
  countyByName: (state, getters) => (name = '') => {
    const countyId = state.mapCountyNameId[cleanString(name)]
    return countyId === null ? null : getters.countyById(countyId)
  },
  municipalityByName: (state, getters) => (name = '') => {
    const municipalityId = state.mapMunicipalityNameId[cleanString(name)]
    return municipalityId === null ? null : getters.municipalityById(municipalityId)
  },
  municipalityById: (state) => (id = -1) => {
    return variableIsAPositiveInteger(id)
      ? state.municipalities[id]
      : null
  },
  cityByName: (state, getters) => (name = '') => {
    const cityId = state.mapCityNameId[cleanString(name)]
    return cityId === null ? null : getters.cityById(cityId)
  },
  cityById: (state) => (id = -1) => {
    return variableIsAPositiveInteger(id)
      ? state.cities[id]
      : null
  }
}

const actions = {
  setCountries: ({ commit }, countries) => commit('setCountries', countries),
  setCounties: ({ commit }, counties) => commit('setCounties', counties),
  setMunicipalities: ({ commit }, municipalities) => commit('setMunicipalities', municipalities),
  setCities: ({ commit }, cities) => commit('setCities', cities),
  selectCounty: ({ commit }, countyName) => commit('selectCounty', countyName),
  selectMunicipality: ({ commit }, municipalityName) => commit('selectMunicipality', municipalityName),
  selectCity: ({ commit }, cityName) => commit('selectCity', cityName),
  setActiveMapCitiesBasedOnPopulation: ({ commit }, population) => commit('setActiveMapCitiesBasedOnPopulation', population),
  countyClick: ({ dispatch }, county) => {
    dispatch('selectCounty', county)
    dispatch('selectMunicipality', null)
    dispatch('selectCity', null)
    dispatch('setActiveNewsItemId', null)
  },
  municipalityClick: ({ dispatch }, municipality) => {
    dispatch('selectMunicipality', municipality)
    dispatch('selectCity', null)
    dispatch('setActiveNewsItemId', null)
  },
  cityClick: ({ dispatch }, city) => {
    dispatch('selectCity', city)
    dispatch('setActiveNewsItemId', null)
  }
}

const mutations = {
  setCountries (state, countries) {
    state.countries = countries.filter(({ name }) => name !== 'sweden')
    state.countriesLoaded = true
  },
  setCounties (state, counties) {
    state.counties = counties
    state.mapCountyNameId = counties.reduce((accumulator, county) => {
      accumulator[county.name] = county.id
      return accumulator
    }, {})
    state.countiesLoaded = true
  },
  setMunicipalities (state, municipalities) {
    state.municipalities = municipalities
    state.mapMunicipalityNameId = municipalities.reduce((accumulator, municipality) => {
      accumulator[municipality.name] = municipality.id
      return accumulator
    }, {})
    state.municipalitiesLoaded = true
  },
  setCities (state, cities) {
    state.cities = cities
    state.mapCityNameId = cities.reduce((accumulator, city) => {
      accumulator[city.name] = city.id
      return accumulator
    }, {})
    state.citiesLoaded = true
  },
  selectCounty (state, county) {
    state.selectedCounty = county !== null ? county.name : null
    state.selectedCountyId = county !== null ? county.id : null
  },
  selectMunicipality (state, municipality) {
    state.selectedMunicipality = municipality !== null ? municipality.name : null
    state.selectedMunicipalityId = municipality !== null ? municipality.id : null
  },
  selectCity (state, city) {
    state.selectedCity = city !== null ? city.name : null
    state.selectedCityId = city !== null ? city.id : null
  },
  openDrawer (state) {
    state.selectedCounty = state.previousSelectedCounty
    state.selectedCountyId = state.previousSelectedCountyId
    state.previousSelectedCounty = null
    state.previousSelectedCountyId = null

    state.selectedMunicipality = state.previousSelectedMunicipality
    state.selectedMunicipalityId = state.previousSelectedMunicipalityId
    state.previousSelectedMunicipality = null
    state.previousSelectedMunicipalityId = null

    state.selectedCity = state.previousSelectedCity
    state.selectedCityId = state.previousSelectedCityId
    state.previousSelectedCity = null
    state.previousSelectedCityId = null
  },
  closeDrawer (state) {
    state.previousSelectedCounty = state.selectedCounty
    state.previousSelectedCountyId = state.selectedCountyId
    state.selectedCounty = null
    state.selectedCountyId = null

    state.previousSelectedMunicipality = state.selectedMunicipality
    state.previousSelectedMunicipalityId = state.selectedMunicipalityId
    state.selectedMunicipality = null
    state.selectedMunicipalityId = null

    state.previousSelectedCity = state.selectedCity
    state.previousSelectedCityId = state.selectedCityId
    state.selectedCity = null
    state.selectedCityId = null
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
