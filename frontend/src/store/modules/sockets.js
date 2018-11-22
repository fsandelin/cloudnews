import addWebSocket from '../webSocketConnection';
import {
  actions as a,
  mutations as m,
  socketEvents as se,
  newsSources as ns,
  socketServiceUrl
} from '../constants';

let socketConnections = []

const state = {
  newsSources: [
    { name: ns.SVT, active: false },
    { name: ns.TT, active: false },
  ]
}

const getters = {
  newsSources: state => {
    return state.newsSources
  }
}

const actions = {
  toggleNewsSource: ({ dispatch, state }, source) => {
    if (state.newsSources.find(s => s.name === source.name && s.active)) {
      dispatch(a.DEACTIVATE_NEWS_SOURCE, source)
    } else {
      dispatch(a.ACTIVATE_NEWS_SOURCE, source)
    }
  },
  activateNewsSource: ({ dispatch, commit }, source) => {
    const events = [
      { url: `${socketServiceUrl}${source.name}`, event: se.NEWS, action: a.ADD_NEWS },
      { url: `${socketServiceUrl}${source.name}`, event: se.NEWS_LIST, action: a.ADD_NEWS_LIST },
    ]
    socketConnections = [ ...socketConnections, { source: source.name, sockets: addWebSocket(dispatch)(events) } ]

    commit(m.ACTIVATE_NEWS_SOURCE, source)
  },
  deactivateNewsSource: ({ commit }, source) => {
    const socketConnection = socketConnections.find(connection => connection.source === source.name)
    socketConnection.sockets.map(socket => socket.disconnect())
    socketConnections = socketConnections.filter(connection => connection.source !== source.name)

    commit(m.DEACTIVATE_NEWS_SOURCE, source)
  },
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
