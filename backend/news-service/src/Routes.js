const express = require('express');
const db = require('./controllers/DatabaseInterface');

const router = express.Router();
const requests = {};

function handleRequest(request) {
  console.log('Is now in handlerequest');
  const requestedResource = request.requestedResources[0];
  const { service, from, until } = requestedResource;
  db.checkCompletion(service, from, until);
}

router.post('/new_articles', (req, res) => {
  const { services, startDate, endDate } = req.params;
  // const servicesString = Buffer.from(req.params.services, 'base64').toString();
  // const { servicesArray } = JSON.parse(servicesString.trim());
  db.pushArticles(req.body.articles, (error) => {
    if (error) {
      res.status(500).send(`500 internal server error: ${error}`);
    } else {
      res.send('Successfully added things!');
    }
  });
});

router.get('/timespan', (req, res) => {
  const { from, until } = req.query;
  db.getTimeSpan(from, until, (error, documents) => {
    if (error) {
      res.status(500).send(`500 internal server error: ${error}`);
    } else {
      res.json(documents);
    }
  });
});

router.post('/request/timespan', (req, res) => {
  const { requestId, clientId, requestedResources } = req.body;
  console.log('Should handle timespan');
  if (requestedResources.length === 0) {
    res.sendStatus(400);
  } else {
    res.sendStatus(200);
    requests[requestId] = {
      requestId,
      requestedResources,
    };
    handleRequest(requests[requestId]);
  }
});

module.exports = router;
