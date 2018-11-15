require('dotenv').config();
const express = require('express');
const request = require('request');

const router = express.Router();

router.get('/timespan', (req, res) => {
  let { from, until } = req.query;
  const { NEWS_SERVICE_HOST, NEWS_SERVICE_PORT } = process.env;
  from = from.replace(' ', '+');
  until = until.replace(' ', '+');
  const queryParams = {
    from,
    until,
  };
  request.get({ url: `http://${NEWS_SERVICE_HOST}:${NEWS_SERVICE_PORT}/api/timespan`, qs: queryParams }, (err, response, body) => {
    res.type('json');
    res.send(body);
  });
});

module.exports = router;
