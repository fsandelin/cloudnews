import {
  createWebSocket,
  subscribeToLiveNews,
  subscribeToHistoricalNews,
  unsubscribeToLiveNews,
  unsubscribeToHistoricalNews
} from '../../helpers/webSocketConnection'
import { socketServiceUrl } from '../../helpers/constants'
import {
  dateObjToISO,
  dateIsBefore
} from '../../helpers/misc'
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
  },
  activeNewsSources: state => {
    return state.newsSources
      .filter(source => source.active)
  }
}

const actions = {
  fetchAvailableNewsSources: ({ dispatch }) => {
    getAvailableServices(dispatch, 'saveAvailableNewsSources')
  },
  saveAvailableNewsSources: ({ commit }, fetchedNewsSources) => {
    if (fetchedNewsSources.length > 0) {
      const newsSources = fetchedNewsSources
        .slice(1, fetchedNewsSources.length - 1)
        .toLowerCase().trim().split(',')
        .map(source => source.slice(1, source.length - 1))
        .map(source => ({ name: source, active: false }))
      commit('saveAvailableNewsSources', newsSources)
    }
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

    const from = dateObjToISO(rootState.time.newsStartDate, true)
    const until = dateObjToISO(rootState.time.newsEndDate, false)
    const today = dateObjToISO(rootState.time.today, false)

    const socket = createWebSocket(url)

    if (until.includes('?')) {
      subscribeToLiveNews(dispatch)(socket)
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
      const untilDate = new Date(until)
      const today = rootState.time.today
      const objUntil = {
        year: untilDate.getFullYear(),
        month: untilDate.getMonth() + 1,
        day: untilDate.getDate()
      }
      const objToday = {
        year: today.slice(0, 4),
        month: today.slice(5, 7),
        day: today.slice(8, 10)
      }
      if (!until.includes('?')) {
        if (dateIsBefore(objUntil, objToday)) {
          unsubscribeToLiveNews(sc.socket)
        } else {
          unsubscribeToLiveNews(sc.socket)
          subscribeToLiveNews(dispatch)(sc.socket)
        }
        subscribeToHistoricalNews(dispatch)(sc.socket, sc.source, from, until)
      } else {
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
