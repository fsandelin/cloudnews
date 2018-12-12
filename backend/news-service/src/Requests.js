const rq = require('request');
const db = require('./database/DatabaseInterface');
const scraperHandler = require('./scrapers/ScraperHandler');
const config = require('./config/config');

const requests = {};

// Add a request to the requests-object and check the request for completion.


// Should do some api calls to scrape missing timespans for a given service
function scrapeRequestedResources(neededTimespans, service = 'polisen') {
  try {
    scraperHandler[service].scrapeNeededTimespans(neededTimespans);
  } catch (e) {
    console.log(`Could not get service ${service}`);
    console.log(scraperHandler);
  }
}

// Send all requested resources that are complete to the middleware.
function notifyCompletedRequest(request) {
  const { requestId, requestedResource } = request;
  if (requestedResource.sent || !requestedResource.completed) {
    return;
  }
  const { service } = requestedResource;

  const body = { service, requestId };
  const options = {
    url: `http://${config.middlewareInfo.baseURL}${config.middlewareInfo.completeRequestRoute}`,
    body,
    json: true,
  };
  rq.post(options, (error, response) => {
    if (response.statusCode === 200) {
      removeRequest(request.requestId);
    }
    if (response.statusCode < 200 || response.statusCode > 299) {
      console.log('Got an error when trying to send requested resource');
      console.log(response.statusCode);
      console.log(error);
    }
  });
}

// Check all requested resources for completion and
// scrape if missing. Then send all unsent, completed resources.
function updateRequestCompletion(request) {
  const { requestedResource } = request;
  if (requestedResource.completed) {
    notifyCompletedRequest(request);
    return;
  }
  db.getMissingTimespans(requestedResource, (timespans) => {
    if (timespans.length === 0) {
      requestedResource.completed = true;
      request.completed = true;
      requestedResource.scraping = false;
    } else {
      requestedResource.scraping = true;
      scrapeRequestedResources(timespans, requestedResource.service);
    }
    notifyCompletedRequest(request);
  });
}


// Check all requests for completion.
function checkRequestsCompletion() {
  const keys = Object.keys(requests);
  for (let i = 0; i < keys.length; i += 1) {
    updateRequestCompletion(requests[keys[i]]);
  }
}

function addRequest(requestId, requestedResource) {
  requestedResource.completed = false;
  requestedResource.sent = false;
  requestedResource.scraping = false;
  requests[requestId] = {
    requestId,
    requestedResource,
  };
  updateRequestCompletion(getRequest(requestId));
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

function getRequestsCount() {
  return Object.keys(requests).length;
}


module.exports = {
  addRequest,
  updateRequestCompletion,
  checkRequestsCompletion,
  requests,
  removeRequest,
  getRequest,
  getRequestsCount,
};
