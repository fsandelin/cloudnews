import io from 'socket.io-client'

export const addWebSocket = dispatch => (events, url, service, from, to) => {
  const socket = io(url)

  events.map(({ event, action }) => {
    socket.on(event, (data) => {

      console.log('event', event, data)
      dispatch(action, data)
    })
  })

  createWebSocketTimeSpanRequest(socket, service, from, to)
  return socket
}

export const createWebSocketTimeSpanRequest = (socket, service, from, to) => {
  console.log('trying to create a timespan request')
  socket.emit('timespan_request', JSON.stringify({
    'service': service,
    'from': from,
    'until': to
  }))
  console.log('created a timespan request', socket, service, from, to)
}
