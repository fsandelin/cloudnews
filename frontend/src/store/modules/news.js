import {
  cleanString,
  dateIsBefore,
  convertDateStringToDateObj
} from '../helpers'

const state = {
  newsList: [],
  activeNewsItemId: null,
  previousActiveNewsItemId: null
}

const getters = {
  newsList: state => {
    return state.newsList
  },
  filteredNewsList: (state, getters, rootState, rootGetters) => {
    if (rootState.locations.selectedCity !== null) return getters.filterNewsSelectedCity
    if (rootState.locations.selectedMunicipality !== null) return getters.filterNewsSelectedMunicipality
    if (rootState.locations.selectedCounty !== null) return getters.filterNewsSelectedCounty
    return []
  },
  filterNewsSelectedCounty: (state, getters, rootState, rootGetters) => {
    return state.newsList.filter(news => (news.location.county === rootState.locations.selectedCounty))
  },
  filterNewsSelectedMunicipality: (state, getters, rootState, rootGetters) => {
    return state.newsList.filter(news => (news.location.municipality === rootState.locations.selectedMunicipality))
  },
  filterNewsSelectedCity: (state, getters, rootState, rootGetters) => {
    return state.newsList.filter(news => (news.location.city === rootState.locations.selectedCity))
  },
  selectedCountyNews: (state, getters, rootState) => {
    return state.newsList.filter(({ location }) => (location.county === rootState.locations.selectedCounty))
  },
  newsByCounty: (state, getters, rootState) => {
    return rootState.locations.counties.map(county => {
      return {
        ...county,
        news: state.newsList.filter(({ location }) => {
          return location.county === county.name
        })
      }
    }).filter(({ news }) => news.length > 0)
  },
  newsByMunicipality: (state, getters, rootState) => {
    return rootState.locations.municipalities.map(municipality => {
      return {
        ...municipality,
        news: state.newsList.filter(({ location }) => location.municipality === municipality.name)
      }
    }).filter(({ news }) => news.length > 0)
      .map(municipality => {
        const county = getters.countyByName(municipality.county)
        return {
          ...municipality,
          countyX: county.x,
          countyY: county.y
        }
      })
  },
  newsByCity: (state, getters, rootState) => {
    return rootState.locations.cities.map(city => {
      return {
        ...city,
        news: state.newsList.filter(({ location }) => location.city === city.name)
      }
    }).filter(({ news }) => news.length > 0)
      .map(city => {
        const municipality = getters.municipalityByName(city.municipality)
        return {
          ...city,
          municipalityX: municipality.x,
          municipalityY: municipality.y
        }
      })
  },
  activeNewsItemId: state => {
    return state.activeNewsItemId
  },
  activeNewsItem: state => {
    const newsItem = state.newsList.find(item => item.id === state.activeNewsItemId)
    return newsItem !== undefined && 'id' in newsItem ? newsItem : null
  }
}

const actions = {
  addNews: ({ state, commit, rootGetters, rootState }, news) => {
    if (state.newsList.find(x => x.id === news.id)) return

    news = {
      ...news,
      datetime: convertDateStringToDateObj(news.datetime)
    }

    if (dateIsBefore(news.datetime, rootState.time.newsStartDate)) return
    if (rootState.time.newsEndDate !== null &&
        dateIsBefore(rootState.time.newsEndDate, news.datetime)) return

    let location = { ...news.location }
    for (const key of Object.keys(location)) {
      location[key] = cleanString(location[key])
    }

    const city = rootGetters.cityByName(location.city)
    if (city) {
      location = {
        ...location,
        city: city.name,
        municipality: city.municipality,
        county: city.county,
        country: 'sweden'
      }
    }

    const municipality = rootGetters.municipalityByName(location.municipality)
    if (municipality) {
      location = {
        ...location,
        municipality: municipality.name,
        county: municipality.county,
        country: 'sweden'
      }
    }

    const county = rootGetters.countyByName(location.county)
    if (county) {
      location = {
        ...location,
        county: county.name,
        country: 'sweden'
      }
    }

    commit('addNews', { ...news, location })
  },
  addNewsList: ({ dispatch }, newsList) => {
    newsList.map(news => dispatch('addNews', news))
  },
  setActiveNewsItemId: ({ commit }, id) => commit('setActiveNewsItemId', id)
}

const mutations = {
  addNews (state, news) {
    state.newsList = [ ...state.newsList, news ]
  },
  setActiveNewsItemId (state, id) {
    state.activeNewsItemId = id
  },
  openDrawer (state) {
    state.activeNewsItemId = state.previousActiveNewsItemId
    state.previousActiveNewsItemId = null
  },
  closeDrawer (state) {
    state.previousActiveNewsItemId = state.activeNewsItemId
    state.activeNewsItemId = null
  },
  toggleActive (state) {
    state.activeNewsItemId = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
