import io from 'socket.io-client';

const addWebSocket = store => events => {
  events.map(({ url, event, action }) => {
    const socket = io(url)
    socket.on(event, (data) => {
      store.dispatch(action, data)
    });
  })
}

export default addWebSocket
