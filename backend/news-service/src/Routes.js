const express = require('express');
const R = require('request');
const db = require('./controllers/DatabaseInterface');
const { addRequest, checkRequestsCompletion } = require('./Requests');

const router = express.Router();

const {
  MIDDLEWARE_HOST, MIDDLEWARE_PORT,
} = process.env;

const MIDDLEARE_LIVE_URL = `http://${MIDDLEWARE_HOST}:${MIDDLEWARE_PORT}/live_news`;

router.post('/fill_timespan', (req, res) => {
  const {
    service,
    news,
    timespan,
  } = req.body;
  if (service === undefined || news === undefined || timespan === undefined) res.status(400).send('Please send a valid request');
  db.fillTimeSpan(service, news, timespan, (error) => {
    if (error) {
      res.status(500).send('Something went wrong, sorry about that.');
    } else {
      res.send('Seems to have done what you asked');
      checkRequestsCompletion();
    }
  });
});

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

router.get('/run_check', (req, res) => {
  res.send('ok');
  checkRequestsCompletion();
});

router.post('/request/timespan', (req, res) => {
  const { requestId, requestedResource } = req.body;
  if (requestedResource) {
    res.sendStatus(200);
    addRequest(requestId, requestedResource);
  } else {
    res.sendStatus(400);
  }
});

router.get('/available_services', (req, res) => {
  const availableServices = ['svt', 'tt', 'polisen'];
  res.json(availableServices);
});

router.post('/live_news', (req, res) => {
  const options = {
    url: MIDDLEARE_LIVE_URL,
    body: req.body,
    json: true,
  };
  R.post(options, (error, response) => {
    if (error) {
      console.log('Failed to send live news to middleware.');
      res.sendStatus(500);
    } else {
      res.send('Successful');
    }
  });
});


module.exports = router;
