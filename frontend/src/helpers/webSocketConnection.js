import io from 'socket.io-client'
import { socketEvents as se, socketServicePath } from './constants'

export const createWebSocket = (url, qParams) => {
	const socket = io(url, {
		'path': `${socketServicePath}/socket.io`,
		query: qParams,
		'reconnectionDelay': 1000,
		'reconnectionDelayMax': 5000,
		'reconnectionAttempts': 5,
	});
	return socket;
}

export const subscribeToLiveNews = dispatch => socket => {
	const liveEvents = [
		{ event: se.NEWS, action: 'addNews' },
		{ event: se.NEWS_LIST, action: 'addNewsList' }
	];
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

  socket.on(se.COMPLETE_REQUEST, _ => {
    dispatch('makeNewsRequest', { service, from, until })
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
