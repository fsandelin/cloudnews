const rq = require('request');
const config = require('./config/config');
const db = require('./database/DatabaseInterface');
const { addRequest, checkRequestsCompletion } = require('./Requests');
const logger = require('./logger');

const AVAILABLE_SERVICES = ['svt', 'tt', 'polisen'];

// /api/fill_timespan
function fillTimeSpan(request, response) {
  const {
    service,
    news,
    timespan,
  } = request.body;
  if (service === undefined || news === undefined || timespan === undefined) {
    logger.error('Someone sent an invalid request.');
    response.status(400).send('Please send a valid request');
  }
  db.fillTimeSpan(service, news, timespan, (error) => {
    if (error) {
      response.status(500).send('Something went wrong, sorry about that.');
    } else {
      logger.debug(`Inserted news for ${service} in the database`);
      response.send('Seems to have done what you asked');
      checkRequestsCompletion();
    }
  });
}

// /api/request/timespan
function requestTimespan(request, response) {
  const { requestId, requestedResource } = request.body;
  logger.debug(`Got a request for: ${requestedResource}`);
  if (requestedResource) {
    response.sendStatus(200);
    addRequest(requestId, requestedResource);
  } else {
    logger.error('Got a request without a requestedResource');
    response.sendStatus(400);
  }
}
// /api/available_services
function availableServices(request, response) {
  response.json(AVAILABLE_SERVICES);
}

// /api/live_news
function liveNews(request, response) {
  const options = {
    url: `http://${config.middlewareInfo.baseURL}${config.middlewareInfo.liveNewsRoute}`,
    body: request.body,
    json: true,
  };
  logger.debug(`Sending livenews to middleware from ${request.body.service}`);
  rq.post(options, (error_, response_) => {
    if (error_) {
      logger.error('Failed to send live news to middleware.');
      logger.error(error_);
      response.sendStatus(500);
    } else {
      logger.debug('Succeeded in sending live-news to middleware');
      response.send('Successful');
    }
  });
}

function getNews(req, res) {
  const {
    service, from, until, pageNumber,
  } = req.query;
  logger.debug(`Getting news page #${pageNumber} for ${service} in the timespan from ${from} until ${until}`);
  db.getEntriesPaged(service, from, until, pageNumber, (entries) => {
    if (entries) {
      if (entries.length === 0) {
        logger.debug('No content found for the service, dates or pageNumber.');
        res.sendStatus(204);
      } else {
        logger.debug(`Sending entries for ${service} to middleware`);
        res.json(entries);
      }
    } else {
      logger.error('Something went wrong trying to get paginated articles from Database.');
      res.sendStatus(500);
    }
  });
}

module.exports = {
  fillTimeSpan,
  requestTimespan,
  availableServices,
  liveNews,
  getNews,
};
