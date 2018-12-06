import io from 'socket.io-client';

export const addWebSocket = dispatch => (events, url, service, from, to) => {
  const socket = io(url)

  events.map(({ event, action }) => {
    socket.on(event, (data) => {
      dispatch(action, data)
    });
  })

  createWebSocketTimeSpanRequest(socket, service, from, to)
  return socket
}

export const createWebSocketTimeSpanRequest = (socket, service, from, to) => {
  socket.emit('timespan_request', JSON.stringify([{
    "service": service,
    "from": from,
    "until": to,
  }]))
}
