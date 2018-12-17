require('dotenv').config();
const express = require('express');
const request = require('request');
const cors = require('cors');
const { parseRequestedResource } = require('./utils');

const router = express.Router();
const { NEWS_SERVICE_HOST, NEWS_SERVICE_PORT } = process.env;

router.get('/timespan', (req, res) => {
  let { from, until } = req.query;
  from = from.replace(' ', '+');
  until = until.replace(' ', '+');

  const from_ = new Date(from);
  const until_ = new Date(until);

  const queryParams = {
    from: from_.toISOString(),
    until: until_.toISOString(),
  };
  request.get({ url: `http://${NEWS_SERVICE_HOST}:${NEWS_SERVICE_PORT}/api/timespan`, qs: queryParams }, (err, response, body) => {
    res.type('json');
    res.send(body);
  });
});

router.get('/available_services', cors(), (req, res) => {
  console.log('Should make request to news-service now!');
  request.get({ url: `http://${NEWS_SERVICE_HOST}:${NEWS_SERVICE_PORT}/api/available_services` }, (err, response, body) => {
    console.log('Got request to news-service');
    if (err) {
      res.status(500).send('Could not get the services resources from the responsible node');
    }
    res.json(body);
  });
});

module.exports = router;
