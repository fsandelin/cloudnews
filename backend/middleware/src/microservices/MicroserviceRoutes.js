const express = require('express');
const MicroserviceHandler = require('./MicroserviceHandler');

const router = express.Router();

router.post('/complete_request', (request, response) => {
  MicroserviceHandler.completeRequest(request, response);
});

router.post('/live_news', (request, response) => {
  MicroserviceHandler.liveNews(request, response);
});

module.exports = router;
