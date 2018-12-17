const rq = require('request');
const config = require('../config/config');

function timespan(req, res) {
  let { from, until } = req.query;
  from = from.replace(' ', '+');
  until = until.replace(' ', '+');
  const from_ = new Date(from);
  const until_ = new Date(until);
  const queryParams = {
    from: from_.toISOString(),
    until: until_.toISOString(),
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
    } else {
      res.json(body);
    }
  });
}

function getNews(req, res) {
  const {
    service, from, until, pageNumber,
  } = req.query;

  const from_ = new Date(from);
  const until_ = new Date(until);
  const options = {
    qs: {
      service,
      from: from_.toISOString(),
      until: until.toISOString(),
      pageNumber,
    },
    json: true,
    url: `http://${config.newsServiceInfo.baseURL}${config.newsServiceInfo.getNewsRoute}`,
  };
  rq.get(options, (error, response) => {
    if (error) {
      console.log(error);
      return;
    }
    if (response.statusCode === 204) {
      res.sendStatus(204);
    } else {
      res.json(response.body);
    }
  });
}

module.exports = {
  timespan,
  availableServices,
  getNews,
};
