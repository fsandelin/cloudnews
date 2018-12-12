const express = require('express');

const router = express.Router();
const ClientHandler = require('./ExternalHandler');

router.get('/timespan', (request, response) => {
  ClientHandler.timespan(request, response);
});

router.get('/available_services', (request, response) => {
  ClientHandler.availableServices(request, response);
});

module.exports = router;
