import io from 'socket.io-client';

const addWebSocket = store => (event, url, action) => {
  const socket = io(url)
  socket.on(event, (news) => {
    store.dispatch(action, news)
  });
}

export default addWebSocket
