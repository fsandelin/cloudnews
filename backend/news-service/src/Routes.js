const express = require('express');
const RouteHandler = require('./RouteHandler');
const logger = require('./logger');

const router = express.Router();

router.post('/fill_timespan', (req, res) => {
  logger.debug('Got a request to endpoint /fill_timespan');
  RouteHandler.fillTimeSpan(req, res);
});

router.post('/request/timespan', (req, res) => {
  logger.debug('Got a request to endpoint /request/timespan');
  RouteHandler.requestTimespan(req, res);
});

router.get('/available_services', (req, res) => {
  logger.debug('Got a request to endpoint /available_services');
  RouteHandler.availableServices(req, res);
});

router.post('/live_news', (req, res) => {
  logger.debug('Got a request to endpoint /live_news');
  RouteHandler.liveNews(req, res);
});

router.get('/news', (req, res) => {
  logger.debug('Got a request to endpoint /news');
  RouteHandler.getNews(req, res);
});

module.exports = router;
