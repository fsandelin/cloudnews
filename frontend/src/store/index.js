import Vue from 'vue'
import Vuex from 'vuex'
import addWebSocket from './webSocketConnection';
import {
  actions as a,
  socketEvents as se,
  socketServiceUrl
} from './constants';
import locations from './modules/locations';
import news from './modules/news';
import gui from './modules/gui';

Vue.use(Vuex)

let socketConnections = []

const store = new Vuex.Store({
  actions: {
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
  },
  modules: {
    locations,
    news,
    gui
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store;
