import io from 'socket.io-client';

const addWebSocket = dispatch => events => {
  return events.map(({ url, event, action }) => {
    const socket = io(url)
    socket.on(event, (data) => {
      dispatch(action, data)
    });

    return socket
  })
}

export default addWebSocket
