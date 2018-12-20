const { APP_PORT, NEWS_SERVICE_HOST, NEWS_SERVICE_PORT } = require('./../../env');

const appPort = APP_PORT;
const newsServiceUrl = `http://${NEWS_SERVICE_HOST}:${NEWS_SERVICE_PORT}/api/fill_timespan`;
const apiUrl = 'https://polisen.se/api/events';

module.exports = {
  appPort,
  newsServiceUrl,
  apiUrl
};
