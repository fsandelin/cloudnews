const requests = {};

function addRequest(requestId, clientId, requestedResource) {
  console.log('Adding request');
  requests[requestId] = {
    requestId,
    clientId,
    requestedResource,
  };
}

function removeRequest(requestId) {
  try {
    delete requests[requestId];
  } catch (e) {
    console.log('Could not remove request, probably doesnt exist');
  }
}

function getRequest(requestId) {
  return requests[requestId];
}

function removeClientsRequest(clientId) {
  const requestsToRemove = [];
  for (const requestId in requests) {
    if (requests.hasOwnProperty(requestId)) {
      if (requests[requestId].clientId === clientId) {
        requestsToRemove.push(requestId);
      }
    }
  }
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
