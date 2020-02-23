const express = require('express');
const logger = require('../logger');

const router = express.Router();
const ClientHandler = require('./ExternalHandler');

router.get('/timespan', (request, response) => {
  logger.debug('Got request for /timespan');
  ClientHandler.timespan(request, response);
});

router.get('/available_services', (request, response) => {
  logger.debug('Got request for /available_services');
  ClientHandler.availableServices(request, response);
});

router.get('/news', (request, response) => {
  logger.debug('Got request for /news');
  ClientHandler.getNews(request, response);
});

module.exports = router;
