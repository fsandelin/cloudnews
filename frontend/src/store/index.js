import Vue from 'vue'
import Vuex from 'vuex'
import locations from './modules/locations';
import news from './modules/news';
import gui from './modules/gui';
import sockets from './modules/sockets';
import time from './modules/time';

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    locations,
    news,
    gui,
    sockets,
    time,
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store;
