const rq = require('request');
const db = require('./database/DatabaseInterface');
const scraperHandler = require('./scrapers/ScraperHandler');
const config = require('./config/config');
const logger = require('./logger');

const requests = {};

// Add a request to the requests-object and check the request for completion.


// Should do some api calls to scrape missing timespans for a given service
function scrapeRequestedResources(neededTimespans, service = 'polisen') {
  try {
    scraperHandler[service].scrapeNeededTimespans(neededTimespans);
  } catch (e) {
    logger.error(`Could not send scraping-request to ${service}, probably because service doesn't exist in scraperHandler`);
    logger.error(e);
  }
}

// Send all requested resources that are complete to the middleware.
function notifyCompletedRequest(request) {
  const { requestId, requestedResource } = request;
  if (requestedResource.sent || !requestedResource.completed) {
    logger.debug('No need to send notification because the requested resource has been sent or is not yet completed.');
    return;
  }
  const { service } = requestedResource;

  const body = { service, requestId };
  const options = {
    url: `http://${config.middlewareInfo.baseURL}${config.middlewareInfo.completeRequestRoute}`,
    body,
    json: true,
  };
  logger.debug(`Notifying middleware that the request (${request.requestId}) has been fulfilled`);
  rq.post(options, (error, response) => {
    if (response.statusCode === 200) {
      logger.debug('Successfully sent data to middleware. Will now remove request.');
      removeRequest(request.requestId);
    }
    if (response.statusCode < 200 || response.statusCode > 299) {
      logger.error(`Got a non 200-status-code, something went wrong trying notify middelware of completed request: ${request.requestId}`);
      logger.error('Statuscode: response.statusCode');
      logger.error(`There might have been an error: ${error}`);
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
      logger.debug(`No timespans missing to complete request: ${request.requestId}`);
      requestedResource.completed = true;
      request.completed = true;
      requestedResource.scraping = false;
    } else {
      logger.debug(`Requesting scraping for request: ${request.requestId}`);
      requestedResource.scraping = true;
      scrapeRequestedResources(timespans, requestedResource.service);
    }
    notifyCompletedRequest(request);
  });
}


// Check all requests for completion.
function checkRequestsCompletion() {
  logger.debug('Triggering a check for completion for all requests.');
  const keys = Object.keys(requests);
  for (let i = 0; i < keys.length; i += 1) {
    updateRequestCompletion(requests[keys[i]]);
  }
}

function addRequest(requestId, requestedResource) {
  logger.debug(`Adding request ${requestId}`);
  requestedResource.completed = false;
  requestedResource.sent = false;
  requestedResource.scraping = false;
  requests[requestId] = {
    requestId,
    requestedResource,
  };
  logger.debug(`Should update completionStatus of ${requestId} `);
  updateRequestCompletion(getRequest(requestId));
}

function removeRequest(requestId) {
  try {
    logger.debug(`Removing request ${requestId}`);
    delete requests[requestId];
  } catch (e) {
    logger.error(`Could not remove request ${requestId}, probably already removed.`);
  }
}

function getRequest(requestId) {
  try {
    return requests[requestId];
  } catch (exception) {
    logger.error(`Got an error trying to get request: ${requestId} \n ${exception}`);
    return null;
  }
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
