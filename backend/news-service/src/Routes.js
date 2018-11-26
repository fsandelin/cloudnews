const express = require('express');
const db = require('./controllers/DatabaseInterface');
const { addRequest, checkRequestsCompletion } = require('./Requests');

const router = express.Router();

router.post('/new_articles', (req, res) => {
  const { service } = req.query;
  db.pushArticles(service, req.body.articles, (error) => {
    if (error) {
      res.status(500).send(`500 internal server error: ${error}`);
    } else {
      res.send('Successfully added things!');
    }
  });
});

router.get('/timespan', (req, res) => {
  const { service, from, until } = req.query;
  db.getTimeSpan(service, from, until, (error, documents) => {
    if (error) {
      res.status(500).send(`500 internal server error: ${error}`);
    } else {
      res.json(documents);
    }
  });
});

router.get('/run_check', (req, res) => {
  res.send('ok');
  checkRequestsCompletion();
});

router.post('/request/timespan', (req, res) => {
  const { requestId, clientId, requestedResources } = req.body;
  const reqResources = requestedResources;
  console.log(`Should get a requestedResource: ${reqResources}`);
  if (requestedResources.length === 0) {
    res.sendStatus(400);
  } else {
    res.sendStatus(200);
    addRequest(requestId, reqResources);
  }
});

module.exports = router;
