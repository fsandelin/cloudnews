import {
  cleanString,
  convertDateStringToDateObj,
  dateIsBeforeOrEqual,
  dateIsAfterOrEqual
} from '../../helpers/misc'

const state = {
  newsList: [],
  activeNewsItemId: null,
  previousActiveNewsItemId: null
}

const getters = {
  newsList: (state, _getters, _rootState, rootGetters) => {
    return state.newsList.filter(news => {
      const currentStartDate = rootGetters.newsStartDate
      const currentEndDate = rootGetters.newsEndDate

      if (!currentEndDate) return dateIsAfterOrEqual(news.datetime, currentStartDate)
      return dateIsAfterOrEqual(news.datetime, currentStartDate) && dateIsBeforeOrEqual(news.datetime, currentEndDate)
    })
  },
  filteredNewsList: (_state, getters, rootState, _rootGetters) => {
    if (rootState.locations.selectedCity !== null) return getters.filterNewsSelectedCity
    if (rootState.locations.selectedMunicipality !== null) return getters.filterNewsSelectedMunicipality
    if (rootState.locations.selectedCounty !== null) return getters.filterNewsSelectedCounty
    return []
  },
  filterNewsSelectedCounty: (_state, getters, rootState, _rootGetters) => {
    return getters.newsList.filter(news => (news.location.county === rootState.locations.selectedCounty))
  },
  filterNewsSelectedMunicipality: (_state, getters, rootState, _rootGetters) => {
    return getters.newsList.filter(news => (news.location.municipality === rootState.locations.selectedMunicipality))
  },
  filterNewsSelectedCity: (_state, getters, rootState, _rootGetters) => {
    return getters.newsList.filter(news => (news.location.city === rootState.locations.selectedCity))
  },
  newsByCounty: (_state, getters, _rootState) => {
    const countyWithNews = getters.newsList.reduce((newsById, news) => {
      const id = news.locationIds.countyId
      if (id === '' || id === undefined) return { ...newsById }
      const newsObject = newsById[id]

      return {
        ...newsById,
        [id]: newsObject === undefined ? [news] : [ ...newsObject, news ]
      }
    }, {})

    return Object.keys(countyWithNews).map(id => {
      const county = getters.countyById(id)

      return {
        ...county,
        news: countyWithNews[id]
      }
    })
  },
  newsByMunicipality: (_state, getters, _rootState) => {
    const municipalityWithNews = getters.newsList.reduce((newsById, news) => {
      const id = news.locationIds.municipalityId
      if (id === '' || id === undefined) return { ...newsById }
      const newsObject = newsById[id]

      return {
        ...newsById,
        [id]: newsObject === undefined ? [news] : [ ...newsObject, news ]
      }
    }, {})

    return Object.keys(municipalityWithNews).map(id => {
      const municipality = getters.municipalityById(id)
      const county = getters.countyByName(municipality.county)

      return {
        ...municipality,
        countyX: county.x,
        countyY: county.y,
        news: municipalityWithNews[id]
      }
    })
  },
  newsByCity: (_state, getters, _rootState) => {
    const citiesWithNews = getters.newsList.reduce((newsById, news) => {
      const id = news.locationIds.cityId
      if (id === '' || id === undefined) return { ...newsById }
      const newsObject = newsById[id]

      return {
        ...newsById,
        [id]: newsObject === undefined ? [news] : [ ...newsObject, news ]
      }
    }, {})
    return Object.keys(citiesWithNews).map(id => {
      const city = getters.cityById(id)
      const municipality = getters.municipalityByName(city.municipality)
      return {
        ...city,
        municipalityX: municipality.x,
        municipalityY: municipality.y,
        news: citiesWithNews[id]
      }
    })
  },
  activeNewsItemId: state => {
    return state.activeNewsItemId
  },
  activeNewsItem: (state, getters) => {
    const newsItem = getters.newsList.find(item => item.id === state.activeNewsItemId)
    return newsItem !== undefined && 'id' in newsItem ? newsItem : null
  }
}

let numberRetries = 0

const actions = {
  setActiveNewsItemId: ({ commit }, id) => commit('setActiveNewsItemId', id),
  addNews: ({ dispatch }, news) => dispatch('addNewsList', [ news ]),
  addNewsList: ({ commit, rootGetters, dispatch }, newsList) => {
    if (!rootGetters.mapLoaded) {
      numberRetries += 1
      if (numberRetries > 1000) return
      return setTimeout(() => dispatch('addNewsList', newsList), numberRetries * 100)
    }

    numberRetries = 0
    newsList = newsList.filter((news) => !rootGetters.newsList.find(x => x.id === news.id))
    newsList = newsList.map(news => {
      const datetime = convertDateStringToDateObj(news.datetime)
      const location = { ...news.location }
      Object.keys(location).forEach(function (key) {
        location[key] = cleanString(location[key])
      })

      const city = rootGetters.cityByName(location.city)
      if (city) {
        return {
          ...news,
          datetime,
          location: {
            city: city.name,
            municipality: city.municipality,
            county: city.county,
            country: 'sweden'
          },
          locationIds: {
            cityId: city.id,
            municipalityId: city.municipalityId,
            countyId: city.countyId
          }
        }
      }

      const municipality = rootGetters.municipalityByName(location.municipality)
      if (municipality) {
        return {
          ...news,
          datetime,
          location: {
            municipality: municipality.name,
            county: municipality.county,
            country: 'sweden'
          },
          locationIds: {
            municipalityId: municipality.id,
            countyId: municipality.countyId
          }
        }
      }

      const county = rootGetters.countyByName(location.county)
      if (county) {
        return {
          ...news,
          datetime,
          location: {
            county: county.name,
            country: 'sweden'
          },
          locationIds: {
            countyId: county.id
          }
        }
      }

      return {
        ...news,
        datetime,
        location: { country: 'sweden' },
        locationIds: { }
      }
    })
    commit('addNews', newsList)
  }
}

const mutations = {
  addNews (state, news) {
    state.newsList = [ ...news, ...state.newsList ]
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
