const rq = require('request');
const config = require('../config/config');
const logger = require('../logger');

function timespan(req, res) {
  logger.debug('Got a timespan request. Reading request.');
  let { from, until } = req.query;
  from = from.replace(' ', '+');
  until = until.replace(' ', '+');
  const from_ = new Date(from);
  const until_ = new Date(until);
  logger.debug('Has read the request and extracted needed data.');
  const queryParams = {
    from: from_.toISOString(),
    until: until_.toISOString(),
  };
  logger.debug('Sending request to news-service');
  rq.get({ url: `http://${config.newsServiceInfo.baseURL}${config.newsServiceInfo.timespanRoute}`, qs: queryParams }, (err, response, body) => {
    logger.debug('Sending response to user.');
    res.type('json');
    res.send(body);
  });
}

function availableServices(req, res) {
  logger.debug('Getting available services from news-service');
  rq.get({ url: `http://${config.newsServiceInfo.baseURL}${config.newsServiceInfo.availableServicesRoute}` }, (err, response, body) => {
    console.log('Got request to news-service');
    if (err) {
      logger.error('Got an error when getting available services from news-service');
      res.status(500).send('Could not get the services resources from the responsible node');
    } else {
      logger.debug('Successfully got available services. Responding with them.');
      res.json(body);
    }
  });
}

function getNews(req, res) {
  logger.debug('Got request to get news from database.');
  const {
    service, from, until, pageNumber,
  } = req.query;

  const from_ = new Date(from);
  const until_ = new Date(until);
  logger.debug('Extracted needed data from request and parsed it. ');
  const options = {
    qs: {
      service,
      from: from_.toISOString(),
      until: until_.toISOString(),
      pageNumber,
    },
    json: true,
    url: `http://${config.newsServiceInfo.baseURL}${config.newsServiceInfo.getNewsRoute}`,
  };
  logger.debug('Sending request for news to news-service');
  rq.get(options, (error, response) => {
    if (error) {
      logger.error(`Something went wrong when getting news from news-service: ${JSON.stringify(error)}`);
      return;
    }
    if (response.statusCode === 204) {
      logger.debug(`Page ${pageNumber} does not exist.`);
      res.sendStatus(204);
    } else {
      logger.debug('Returning articles to client.');
      res.json(response.body);
    }
  });
}

module.exports = {
  timespan,
  availableServices,
  getNews,
};
