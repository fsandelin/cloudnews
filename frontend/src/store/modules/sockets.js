import { addWebSocket, createWebSocketTimeSpanRequest } from '../webSocketConnection';
import {
  socketEvents as se,
  newsSources as ns,
  socketServiceUrl
} from '../constants';
import { prettifyDateObject } from '../helpers'

let socketConnections = []

const state = {
  newsSources: ns.map(source => ({ name: source, active: false }))
}

const getters = {
  newsSources: state => {
    return state.newsSources
  }
}

const actions = {
  toggleNewsSource: ({ dispatch, state }, source) => {
    if (state.newsSources.find(s => s.name === source.name && s.active)) {
      dispatch('deactivateNewsSource', source)
    } else {
      dispatch('activateNewsSource', source)
    }
  },
  activateNewsSource: ({ rootState, dispatch, commit }, source) => {
    const events = [
      { event: se.NEWS, action: 'addNews' },
      { event: se.NEWS_LIST, action: 'addNewsList' },
    ]

    const url = `${socketServiceUrl}${source.name}`

    const from = prettifyDateObject(rootState.time.newsStartDate)
    const to = prettifyDateObject(rootState.time.newsEndDate)

    socketConnections = [ ...socketConnections, { source: source.name, socket: addWebSocket(dispatch)(events, url, source.name, from, to) } ]

    commit('activateNewsSource', source)
  },
  deactivateNewsSource: ({ commit }, source) => {
    const socketConnection = socketConnections.find(connection => connection.source === source.name)
    socketConnection.socket.disconnect()
    socketConnections = socketConnections.filter(connection => connection.source !== source.name)

    commit('deactivateNewsSource', source)
  },
  makeSocketTimeSpanRequest: ({ }, { from, to }) => {
    socketConnections.map(sc => {
      createWebSocketTimeSpanRequest(sc.socket, sc.source, from, to)
    })
  }
}

const mutations = {
  activateNewsSource(state, source) {
    state.newsSources = state.newsSources.map(s => ({
      ...s,
      active: s.name === source.name ? true : s.active
    }))
  },
  deactivateNewsSource(state, source) {
    state.newsSources = state.newsSources.map(s => ({
      ...s,
      active: s.name === source.name ? false : s.active
    }))
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
