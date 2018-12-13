const rq = require('request');
const config = require('./config/config');
const db = require('./database/DatabaseInterface');
const { addRequest, checkRequestsCompletion } = require('./Requests');

const AVAILABLE_SERVICES = ['svt', 'tt', 'polisen'];

// /api/fill_timespan
function fillTimeSpan(request, response) {
  const {
    service,
    news,
    timespan,
  } = request.body;
  if (service === undefined || news === undefined || timespan === undefined) response.status(400).send('Please send a valid request');
  db.fillTimeSpan(service, news, timespan, (error) => {
    if (error) {
      response.status(500).send('Something went wrong, sorry about that.');
    } else {
      response.send('Seems to have done what you asked');
      checkRequestsCompletion();
    }
  });
}

// /api/request/timespan
function requestTimespan(request, response) {
  console.log('Should try to add request');

  const { requestId, requestedResource } = request.body;
  console.log(requestId);
  console.log(requestedResource);
  if (requestedResource) {
    response.sendStatus(200);
    addRequest(requestId, requestedResource);
  } else {
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
  rq.post(options, (error_, response_) => {
    if (error_) {
      console.log('Failed to send live news to middleware.');
      console.log(error_);
      response.sendStatus(500);
    } else {
      console.log('Succeeded in sending live-news to middleware');
      response.send('Successful');
    }
  });
}

function getNews(req, res) {
  const {
    service, from, until, pageNumber,
  } = req.query;
  db.getEntriesPaged(service, from, until, pageNumber, (entries) => {
    if (entries) {
      if (entries.length === 0) {
        res.sendStatus(204);
      } else {
        res.json(entries);
      }
    } else res.sendStatus(500);
  });
}

module.exports = {
  fillTimeSpan,
  requestTimespan,
  availableServices,
  liveNews,
  getNews,
};
