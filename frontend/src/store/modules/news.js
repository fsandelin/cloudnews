import { cleanString } from '../helpers';

const state = {
  newsList: [],
  activeNewsItemId: null,
  previousActiveNewsItemId: null,
}

const getters = {
  newsList: state => {
    return state.newsList
  },
  filteredNewsList: (state, getters, rootState, rootGetters) => {
    return state.newsList.filter(news => {
      const county = rootGetters.countyByName(news.location.county)
      return county ? county.name === rootState.locations.selectedCounty : false
    })
  },
  selectedCountyNews: (state, getters, rootState) => {
    return state.newsList.filter(({ location }) => location.county === rootState.locations.selectedCounty)
  },
  newsByCounty: (state, getters, rootState) => {
    return rootState.locations.counties.map(county => {

      return {
        ...county,
        news: state.newsList.filter(({ location }) => {
          return location.county === county.name;
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
        const county = getters.countyByName(municipality.county);
        return {
          ...municipality,
          countyX: county.x,
          countyY: county.y
        }
      });
  },
  activeNewsItemId: state => {
    return state.activeNewsItemId
  },
  activeNewsItem: state => {
    const newsItem = state.newsList.find(item => item.id === state.activeNewsItemId)
    return newsItem !== undefined && 'id' in newsItem ? newsItem : null;
  },
}

const actions = {
  addNews: ({ state, commit, rootGetters }, news) => {
    if (state.newsList.find(x => x.id === news.id)) return

    let location = { ...news.location }
    for (const key of Object.keys(location)) {
      location[key] = cleanString(location[key])
    }
    
    const city = rootGetters.cityByName(location.city);
    if (city) {
      location = {
        ...location,
        municipality: city.municipality,
        county: city.county,
        country: 'sweden'
      }
    }

    const municipality = rootGetters.municipalityByName(location.municipality);
    if (municipality) {
      location = {
        ...location,
        county: municipality.county,
        country: 'sweden'
      }
    }

    const county =  rootGetters.countyByName(location.county);
    if (county) {
      location = {
        ...location,
        country: 'sweden'
      }
    }

    commit('addNews', { ...news, location });
  },
  addNewsList: ({ dispatch }, newsList) => {
    newsList.map(news => dispatch('addNews', news))
  },
  setActiveNewsItemId: ({ commit }, id) => commit('setActiveNewsItemId', id),
}

const mutations = {
  addNews(state, news) {
    state.newsList = [ ...state.newsList, news ]
  },
  setActiveNewsItemId(state, id) {
    state.activeNewsItemId = id
  },
  openDrawer(state) {
    state.activeNewsItemId = state.previousActiveNewsItemId
    state.previousActiveNewsItemId = null
  },
  closeDrawer(state) {
    state.previousActiveNewsItemId = state.activeNewsItemId
    state.activeNewsItemId = null
  },
  toggleActive(state) {
    state.activeNewsItemId = null
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
