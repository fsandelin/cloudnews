const express = require('express');
const RouteHandler = require('./RouteHandler');

const router = express.Router();

router.post('/fill_timespan', (req, res) => {
  console.log('Should fill timespan============================================================================================================================================');
  RouteHandler.fillTimeSpan(req, res);
});

router.post('/request/timespan', (req, res) => {
  RouteHandler.requestTimespan(req, res);
});

router.get('/available_services', (req, res) => {
  RouteHandler.availableServices(req, res);
});

router.post('/live_news', (req, res) => {
  RouteHandler.liveNews(req, res);
});

module.exports = router;
