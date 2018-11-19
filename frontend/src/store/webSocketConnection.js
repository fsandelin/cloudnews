import io from 'socket.io-client';
import { actions as a } from './constants'

const addWebSocket = (dispatch, commit) => (source, events) => {
  return events.map(({ url, event, action }) => {
    const socket = io(url)
    socket.on(event, (data) => {
      dispatch(action, data)
    });

    socket.on('connect', () => {
      commit(a.ADD_SOCKET_ID, { source, id: socket.id })
    })
  })
}

export default addWebSocket
