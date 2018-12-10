import io from 'socket.io-client'
import { socketEvents as se } from './constants'

export const createWebSocket = url => {
  return io(url)
}

export const subscribeToLiveNews = dispatch => socket => {
  const liveEvents = [
    { event: se.NEWS, action: 'addNews' },
    { event: se.NEWS_LIST, action: 'addNewsList' }
  ]
  liveEvents.map(({ event, action }) => {
    socket.on(event, (data) => {
      dispatch(action, data)
    })
  })
}

export const subscribeToHistoricalNews = dispatch => (socket, service, from, until) => {
  socket.emit(se.TIMESPAN_REQUEST, JSON.stringify({
    'service': service,
    'from': from,
    'until': until
  }))

  socket.on(se.COMPLETE_REQUEST, (data) => {
    dispatch('addNewsList', data)
  })
}

export const unsubscribeToLiveNews = socket => {
  unsubscribe(socket, se.NEWS)
  unsubscribe(socket, se.NEWS_LIST)
}

export const unsubscribeToHistoricalNews = socket => {
  unsubscribe(socket, se.COMPLETE_REQUEST)
}

const unsubscribe = (socket, event) => {
  socket.removeAllListeners(event)
}
