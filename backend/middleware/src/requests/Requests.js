const logger = require('../logger');

const requests = {};

function addRequest(requestId, clientId, requestedResource) {
  logger.debug(`Adding request ${requestId}`);
  requests[requestId] = {
    requestId,
    clientId,
    requestedResource,
  };
}

function removeRequest(requestId) {
  logger.debug(`Trying to remove request ${requestId}`);
  try {
    delete requests[requestId];
  } catch (e) {
    logger.error(`Could not remove request ${requestId}, probably doesnt exist (already removed)`);
  }
}

function getRequest(requestId) {
  return requests[requestId];
}

function removeClientsRequest(clientId) {
  logger.debug(`Removing all requests for client ${clientId}`);
  const requestsToRemove = [];
  for (const requestId in requests) {
    if (requests.hasOwnProperty(requestId)) {
      if (requests[requestId].clientId === clientId) {
        requestsToRemove.push(requestId);
      }
    }
  }
  logger.debug(`Removing the following requests because client disconnected: ${JSON.stringify(requestsToRemove)}`);
  for (const requestId in requestsToRemove) {
    removeRequest(requestId);
  }
}

function getRequestsCount() {
  return Object.keys(requests).length;
}

module.exports = {
  addRequest,
  removeRequest,
  getRequest,
  removeClientsRequest,
  getRequestsCount,
};
