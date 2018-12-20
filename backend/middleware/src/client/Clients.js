const logger = require('../logger');

const clients = {};
let externalIo = null;

function initSocket(io) {
  logger.debug('Saving socketIO object to client-handler.');
  externalIo = io;
}

function addClient(clientId, socket, service) {
  logger.debug(`Adding client: ${clientId}`);
  clients[clientId] = {
    socket,
    service,
  };
}

function removeClient(clientId) {
  logger.debug(`Removing client ${clientId}`);
  try {
    delete clients[clientId];
  } catch (e) {
    logger.error(`Could not remove client ${clientId}, probably doesnt exist (already removed).`);
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
