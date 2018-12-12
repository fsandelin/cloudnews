const rq = require('request');
const config = require('../config/config');

function timespan(req, res) {
  let { from, until } = req.query;
  from = from.replace(' ', '+');
  until = until.replace(' ', '+');
  const queryParams = {
    from,
    until,
  };
  rq.get({ url: `http://${config.newsServiceInfo.baseURL}${config.newsServiceInfo.timespanRoute}`, qs: queryParams }, (err, response, body) => {
    res.type('json');
    res.send(body);
  });
}

function availableServices(req, res) {
  console.log('Should make request to news-service now!');
  rq.get({ url: `http://${config.newsServiceInfo.baseURL}${config.newsServiceInfo.availableServicesRoute}` }, (err, response, body) => {
    console.log('Got request to news-service');
    if (err) {
      res.status(500).send('Could not get the services resources from the responsible node');
    }
    res.json(body);
  });
}

module.exports = {
  timespan,
  availableServices,
};
