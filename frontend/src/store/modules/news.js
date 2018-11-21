import { cleanString } from '../helpers';
import {
  mutations as m,
  actions as a,
  socketEvents as se,
} from '../constants';

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
      const municipality = rootGetters.municipalityByName(news.location.municipality)
      const countyName = municipality ? municipality.county : null
      return countyName === rootState.locations.selectedCounty
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
  addNews: ({ rootState, state, commit }, news) => {

    if (state.newsList.find(x => x.id === news.id)) return

    let location = { ...news.location }
    for (const key of Object.keys(location)) {
      location[key] = cleanString(location[key])
    }
    if (rootState.locations.cities.find(city => city.name === location.city)) {

      const municipalityName = rootState.locations.counties.find(municipality =>
        municipality.municipalities.find(city =>
          city === location.city
      )).name

      location = {
        ...location,
        municipality: municipalityName
      }
    }

    if (rootState.locations.municipalities.find(municipality => municipality.name === location.municipality)) {

      const countyName = rootState.locations.counties.find(county =>
        county.municipalities.find(municipality =>
          municipality === location.municipality
      )).name

      location = {
        ...location,
        county: countyName
      }
    }

    if (rootState.locations.counties.find(county => county.name === location.county)) {
      location = {
        ...location,
        country: 'sweden'
      }
    }

    commit(m.ADD_NEWS, { ...news, location });
  },
  addNewsList: ({ dispatch }, newsList) => {
    newsList.map(news => dispatch(a.ADD_NEWS, news))
  },
  setActiveNewsItemId: ({ commit }, id) => commit(a.SELECT_ACTIVE_NEWS_ITEM_ID, id),
}

const mutations = {
  addNews(state, news) {
    state.newsList = [ ...state.newsList, news ]
  },
  setActiveNewsItemId(state, id) {
    state.activeNewsItemId = id
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
