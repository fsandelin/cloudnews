import addWebSocket from '../webSocketConnection';
import {
  actions as a,
  socketEvents as se,
  socketServiceUrl
} from '../constants';

let socketConnections = []

const state = {
}

const getters = {
}

const actions = {
  addNewsSource: ({ dispatch }, source) => {
    const events = [
      { url: `${socketServiceUrl}${source}`, event: se.NEWS, action: a.ADD_NEWS },
      { url: `${socketServiceUrl}${source}`, event: se.NEWS_LIST, action: a.ADD_NEWS_LIST },
    ]
    socketConnections = [ ...socketConnections, { source, sockets: addWebSocket(dispatch)(events) } ]
  },
  removeNewsSource: ({}, source) => {
    const socketConnection = socketConnections.find(connection => connection.source === source)
    socketConnection.sockets.map(socket => socket.disconnect())
    socketConnections = socketConnections.filter(connection => connection.source !== source)
  },
}

const mutations = {
}

export default {
  state,
  getters,
  actions,
  mutations
}
