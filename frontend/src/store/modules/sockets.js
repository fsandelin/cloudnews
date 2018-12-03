import addWebSocket from '../webSocketConnection';
import {
  socketEvents as se,
  newsSources as ns,
  socketServiceUrl
} from '../constants';

let socketConnections = []

const state = {
  newsSources: ns.map(source => ({ name: source, active: false}))
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
  activateNewsSource: ({ dispatch, commit }, source) => {
    const events = [
      { url: `${socketServiceUrl}${source.name}`, event: se.NEWS, action: 'addNews' },
      { url: `${socketServiceUrl}${source.name}`, event: se.NEWS_LIST, action: 'addNewsList' },
    ]
    socketConnections = [ ...socketConnections, { source: source.name, sockets: addWebSocket(dispatch)(events) } ]

    commit('activateNewsSource', source)
  },
  deactivateNewsSource: ({ commit }, source) => {
    const socketConnection = socketConnections.find(connection => connection.source === source.name)
    socketConnection.sockets.map(socket => socket.disconnect())
    socketConnections = socketConnections.filter(connection => connection.source !== source.name)

    commit('deactivateNewsSource', source)
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
