const express = require('express');
const MicroserviceHandler = require('./MicroserviceHandler');
const logger = require('../logger');

const router = express.Router();

router.post('/complete_request', (request, response) => {
  logger.debug('Got a request to /complete_request');
  MicroserviceHandler.completeRequest(request, response);
});

router.post('/live_news', (request, response) => {
  logger.debug('Got a request to /live_news');
  MicroserviceHandler.liveNews(request, response);
});

module.exports = router;
