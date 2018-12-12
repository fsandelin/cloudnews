const rq = require('request');
const db = require('./database/DatabaseInterface');
const scraperHandler = require('./scrapers/ScraperHandler');
const config = require('./config/config');

const requests = {};


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
function sendCompletedResources(request) {
  const { requestId, requestedResource } = request;
  if (requestedResource.sent || !requestedResource.completed) {
    return;
  }
  const { service, from, until } = requestedResource;
  db.getArticles(service, from, until, (error, articles) => {
    if (error) {
      console.log(error);
    }
    const body = { service, requestId, articles };
    const options = {
      url: `http://${config.middlewareInfo.baseURL}${config.middlewareInfo.completeRequestRoute}`,
      body,
      json: true,
    };
    rq.post(options, (error_, response_) => {
      if (response_.statusCode === 200) {
        delete requests[request.requestId];
      }
      if (response_.statusCode < 200 || response_.statusCode > 299) {
        console.log('Got an error when trying to send requested resource');
        console.log(response_.statusCode);
        console.log(error);
      }
    });
  });
}

// Check all requested resources for completion and
// scrape if missing. Then send all unsent, completed resources.
function updateRequestCompletion(request) {
  const { requestedResource } = request;
  if (requestedResource.completed) {
    sendCompletedResources(request);
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
    sendCompletedResources(request);
  });
}

// Add a request to the requests-object and check the request for completion.
function addRequest(requestId, requestedResource) {
  // setInterval(() => {
  //  console.log(requests);
  // }, 5000);
  requestedResource.completed = false;
  requestedResource.sent = false;
  requestedResource.scraping = false;
  requests[requestId] = {
    requestId,
    requestedResource,
  };
  updateRequestCompletion(requests[requestId]);
}

// Check all requests for completion.
function checkRequestsCompletion() {
  const keys = Object.keys(requests);
  for (let i = 0; i < keys.length; i += 1) {
    updateRequestCompletion(requests[keys[i]]);
  }
}

module.exports = {
  addRequest,
  updateRequestCompletion,
  checkRequestsCompletion,
  requests,
};
