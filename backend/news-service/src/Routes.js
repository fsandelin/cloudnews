const express = require('express');
const db = require('./controllers/DatabaseInterface');

const router = express.Router();
const requests = {};

function handleRequest(request) {
  console.log('Is now in handlerequest');
  const requestedResource = request.requestedResources[0];
  const { service, from, until } = requestedResource;
  console.log(`In handleRequest, the service requested is: ${service}`);
  db.checkCompletion(service, from, until, (timespan) => {
    if (timespan.length === 0) {
      console.log('Already have all we need.');
      console.log('Should now do db-stuffs to get all related articles');
    } else {
      console.log('Should now tell scraper that we need some shit');
    }
  });
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
  const reqResources = JSON.parse(requestedResources);
  console.log(`Should get a requestedResource: ${reqResources}`);
  if (requestedResources.length === 0) {
    res.sendStatus(400);
  } else {
    res.sendStatus(200);
    requests[requestId] = {
      requestId,
      requestedResources: reqResources,
    };
    handleRequest(requests[requestId]);
  }
});

module.exports = router;
