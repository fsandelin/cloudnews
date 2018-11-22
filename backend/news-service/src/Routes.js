const express = require('express');
const db = require('./controllers/DatabaseInterface');
const { addRequest, requests } = require('./Requests');

const router = express.Router();

router.post('/new_articles', (req, res) => {
  const { services, startDate, endDate } = req.params;
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
  setInterval(() => {
    console.log(requests);
  }, 5000);
  const { requestId, clientId, requestedResources } = req.body;
  const reqResources = JSON.parse(requestedResources);
  console.log(`Should get a requestedResource: ${reqResources}`);
  if (requestedResources.length === 0) {
    res.sendStatus(400);
  } else {
    res.sendStatus(200);
    addRequest(requestId, reqResources);
  }
});

module.exports = router;
