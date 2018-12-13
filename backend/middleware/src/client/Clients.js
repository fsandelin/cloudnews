const clients = {};
let externalIo = null;

function initSocket(io) {
  externalIo = io;
}

function addClient(clientId, socket, service) {
  clients[clientId] = {
    socket,
    service,
  };
}

function removeClient(clientId) {
  try {
    delete clients[clientId];
  } catch (e) {
    console.log('Could not remove client, probably doesnt exist');
  }
}

function getClient(clientId) {
  return clients[clientId];
}

function getSocket(clientId) {
  return clients[clientId].socket;
}

function emitLiveNews(service, data) {
  externalIo.to(service).emit('news', data);
}

module.exports = {
  initSocket,
  addClient,
  removeClient,
  getClient,
  getSocket,
  emitLiveNews,
};
