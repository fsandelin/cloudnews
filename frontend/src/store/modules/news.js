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
  newsList: (state, getters, rootState, rootGetters) => {
    return state.newsList.filter(news => {
      const currentStartDate = rootGetters.newsStartDate
      const currentEndDate = rootGetters.newsEndDate

      if (!currentEndDate) return dateIsAfterOrEqual(news.datetime, currentStartDate)
      return dateIsAfterOrEqual(news.datetime, currentStartDate) && dateIsBeforeOrEqual(news.datetime, currentEndDate)
    })
  },
  filteredNewsList: (state, getters, rootState, rootGetters) => {
    if (rootState.locations.selectedCity !== null) return getters.filterNewsSelectedCity
    if (rootState.locations.selectedMunicipality !== null) return getters.filterNewsSelectedMunicipality
    if (rootState.locations.selectedCounty !== null) return getters.filterNewsSelectedCounty
    return []
  },
  filterNewsSelectedCounty: (state, getters, rootState, rootGetters) => {
    return getters.newsList.filter(news => (news.location.county === rootState.locations.selectedCounty))
  },
  filterNewsSelectedMunicipality: (state, getters, rootState, rootGetters) => {
    return getters.newsList.filter(news => (news.location.municipality === rootState.locations.selectedMunicipality))
  },
  filterNewsSelectedCity: (state, getters, rootState, rootGetters) => {
    return getters.newsList.filter(news => (news.location.city === rootState.locations.selectedCity))
  },
  newsByCounty: (state, getters, rootState) => {
    return rootState.locations.counties.map(county => {
      return {
        ...county,
        news: getters.newsList.filter(({ location }) => {
          return location.county === county.name
        })
      }
    }).filter(({ news }) => news.length > 0)
  },
  newsByMunicipality: (state, getters, rootState) => {
    return rootState.locations.municipalities.map(municipality => {
      return {
        ...municipality,
        news: getters.newsList.filter(({ location }) => location.municipality === municipality.name)
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

const actions = {
  addNews: ({ state, commit, rootGetters, rootState }, news) => {
    if (rootGetters.newsList.find(x => x.id === news.id)) return

    news = {
      ...news,
      datetime: convertDateStringToDateObj(news.datetime)
    }

    let locationIds = {}
    let location = { ...news.location }

    Object.keys(location).forEach(key => {
      location[key] = cleanString(location[key])
    })

    const city = rootGetters.cityByName(location.city)
    if (city) {
      location = {
        ...location,
        city: city.name,
        municipality: city.municipality,
        county: city.county,
        country: 'sweden'
      }
      locationIds = {
        ...locationIds,
        cityId: city.id
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
      locationIds = {
        ...locationIds,
        municipalityId: municipality.id
      }
    }

    const county = rootGetters.countyByName(location.county)
    if (county) {
      location = {
        ...location,
        county: county.name,
        country: 'sweden'
      }
      locationIds = {
        ...locationIds,
        countyId: county.id
      }
    }

    commit('addNews', { ...news, location, locationIds })
  },
  addNewsList: ({ dispatch }, newsList) => {
    newsList.map(news => dispatch('addNews', news))
  },
  setActiveNewsItemId: ({ commit }, id) => commit('setActiveNewsItemId', id)
}

const mutations = {
  addNews (state, news) {
    state.newsList = [ news, ...state.newsList ]
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