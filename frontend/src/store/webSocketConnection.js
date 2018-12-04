import io from 'socket.io-client';

export const addWebSocket = dispatch => (events, service, from, to) => {
  return events.map(({ url, event, action }) => {
    const socket = io(url)
    socket.on(event, (data) => {
      dispatch(action, data)
    });

    socket.emit('timespan_request', JSON.stringify([{
      "service": service,
      "from": from,
      "until": to,
    }]))

    return socket
  })
}

export const createWebSocketTimeSpanRequest = (socket, service, from, to) => {
  socket.emit('timespan_request', JSON.stringify([{
    "service": service,
    "from": from,
    "until": to,
  }]))
}
