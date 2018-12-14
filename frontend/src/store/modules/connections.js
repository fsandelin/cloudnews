import {
  createWebSocket,
  subscribeToLiveNews,
  subscribeToHistoricalNews,
  unsubscribeToLiveNews,
  unsubscribeToHistoricalNews
} from '../../helpers/webSocketConnection'
import { socketServiceUrl } from '../../helpers/constants'
import { prettifyDateObject } from '../../helpers/misc'
import {
  getAvailableServices,
  requestData
} from '../../helpers/httpRequests'

let socketConnections = []

const state = {
  newsSources: []
}

const getters = {
  newsSources: state => {
    return state.newsSources
  }
}

const actions = {
  fetchAvailableNewsSources: ({ dispatch }) => {
    getAvailableServices(dispatch, 'saveAvailableNewsSources')
  },
  saveAvailableNewsSources: ({ commit }, fetchedNewsSources) => {
    const newsSources = fetchedNewsSources
      .slice(1, fetchedNewsSources.length - 1)
      .toLowerCase().trim().split(',')
      .map(source => source.slice(1, source.length - 1))
      .map(source => ({ name: source, active: false }))
    commit('saveAvailableNewsSources', newsSources)
  },
  toggleNewsSource: ({ dispatch, state }, source) => {
    if (state.newsSources.find(s => s.name === source.name && s.active)) {
      dispatch('deactivateNewsSource', source)
    } else {
      dispatch('activateNewsSource', source)
    }
  },
  activateNewsSource: ({ rootState, dispatch, commit }, source) => {
    const url = `${socketServiceUrl}${source.name}`

    const from = prettifyDateObject(rootState.time.newsStartDate)
    const until = prettifyDateObject(rootState.time.newsEndDate)

    const socket = createWebSocket(url)

    if (until.includes('?')) {
      subscribeToLiveNews(dispatch)(socket)
      const today = rootState.time.today
      subscribeToHistoricalNews(dispatch)(socket, source.name, from, today)
    } else {
      subscribeToHistoricalNews(dispatch)(socket, source.name, from, until)
    }

    socketConnections = [
      ...socketConnections,
      { source: source.name, socket }
    ]

    commit('activateNewsSource', source)
  },
  deactivateNewsSource: ({ commit }, source) => {
    const socketConnection = socketConnections.find(connection => connection.source === source.name)
    socketConnection.socket.disconnect()
    socketConnections = socketConnections.filter(connection => connection.source !== source.name)

    commit('deactivateNewsSource', source)
  },
  makeSocketTimeSpanRequest: ({ dispatch, rootState }, { from, until }) => {
    socketConnections.map(sc => {
      unsubscribeToHistoricalNews(sc.socket)
      if (!until.includes('?')) {
        unsubscribeToLiveNews(sc.socket)
        subscribeToHistoricalNews(dispatch)(sc.socket, sc.source, from, until)
      } else {
        const today = rootState.time.today
        subscribeToHistoricalNews(dispatch)(sc.socket, sc.source, from, today)
      }
    })
  },
  makeNewsRequest: ({ dispatch }, { service, from, until, pageNumber = 0 }) => {
    requestData(dispatch, 'addNewsList', 'makeNewsRequest')({ service, from, until, pageNumber })
  }
}

const mutations = {
  saveAvailableNewsSources (state, sources) {
    state.newsSources = sources
  },
  activateNewsSource (state, source) {
    state.newsSources = state.newsSources.map(s => ({
      ...s,
      active: s.name === source.name ? true : s.active
    }))
  },
  deactivateNewsSource (state, source) {
    state.newsSources = state.newsSources.map(s => ({
      ...s,
      active: s.name === source.name ? false : s.active
    }))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
