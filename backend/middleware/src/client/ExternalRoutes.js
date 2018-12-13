const express = require('express');
const cors = require('cors');

const router = express.Router();
const ClientHandler = require('./ExternalHandler');

router.get('/timespan', (request, response) => {
  ClientHandler.timespan(request, response);
});

router.get('/available_services', cors(), (request, response) => {
  ClientHandler.availableServices(request, response);
});

router.get('/news', cors(), (request, response) => {
  ClientHandler.getNews(request, response);
});

module.exports = router;
