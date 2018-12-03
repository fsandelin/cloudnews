const R = require('request');
const db = require('./controllers/DatabaseInterface');
const SH = require('./ScraperHandler');
require('dotenv').config();

const {
  MIDDLEWARE_HOST, MIDDLEWARE_PORT, SVT_PORT, POLISEN_PORT,
} = process.env;
const MIDDLEWARE_ROUTE = '/complete_request';
const COMPLETE_REQUEST_URL = `http://${MIDDLEWARE_HOST}:${MIDDLEWARE_PORT}${MIDDLEWARE_ROUTE}`;
const SCRAPER_URL_SVT = `http://localhost:${SVT_PORT}/getnews/daterange`;
const SCRAPER_URL_POLISEN = `http://localhost:${POLISEN_PORT}/api/polisens_nyheter`;


const requests = {};


// Should do some api calls to scrape missing timespans for a given service
function scrapeRequestedResources(neededTimespans) {
  neededTimespans.forEach((neededTimespan) => {
    switch (neededTimespan.service) {
      case 'svt':
        SH.svt(neededTimespan);
        break;
      case 'polisen':
        SH.polisen(neededTimespan);
        break;
      default:
        console.log('Cannot find the desired scraper-service');
        break;
    }
  });
}


// Send all requested resources that are complete to the middleware.
function sendCompletedResources(request) {
  const { requestId } = request;
  request.requestedResources.forEach((requestedResource) => {
    if (requestedResource.sent || !requestedResource.completed) {
      return;
    }
    const { service, from, until } = requestedResource;
    db.getArticles(service, from, until, (articles) => {
      const body = { service, requestId, articles };
      const options = {
        url: COMPLETE_REQUEST_URL,
        body,
        json: true,
      };
      R.post(options, (error, response) => {
        if (response.statusCode === 200) {
          requestedResource.sent = true;
          request.incompleteResources -= 1;
          console.log(`Has successfully sent timespan for ${service}`);
        }
        if (request.incompleteResources === 0) {
          delete requests[request.requestId];
        }
        if (response.statusCode < 200 || response.statusCode > 299) {
          console.log('Got an error when trying to send requested resource');
          console.log(error);
        }
      });
    });
  });
}

// Check all requested resources for completion and scrape if missing. Then send all unsent, completed resources.
function updateRequestCompletion(request) {
  const { requestedResources } = request;
  let neededTimespans = [];
  let uncheckedResources = requestedResources.length;
  requestedResources.forEach((requestedResource) => {
    if (requestedResource.completed) {
      uncheckedResources -= 1;
      return;
    }
    db.getMissingTimespans(requestedResource, (timespans) => {
      if (timespans.length === 0) {
        requestedResource.completed = true;
      } else {
        neededTimespans = neededTimespans.concat(timespans);
      }
      uncheckedResources -= 1;
      if (uncheckedResources === 0) {
        if (neededTimespans.length === 0) {
          request.completed = true;
        } else {
          scrapeRequestedResources(neededTimespans);
        }
        sendCompletedResources(request);
      }
    });
  });
}

// Add a request to the requests-object and check the request for completion.
function addRequest(requestId, requestedResources) {
  setInterval(() => {
    console.log(requests);
  }, 5000);
  requestedResources.forEach((requestedResource) => {
    requestedResource.completed = false;
    requestedResource.sent = false;
  });
  requests[requestId] = {
    requestId,
    requestedResources,
    incompleteResources: requestedResources.length,
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
