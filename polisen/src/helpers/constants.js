require('dotenv').config();
const { NEWS_SERVICE_HOST, NEWS_SERVICE_PORT } = process.env;

const newsServiceUrl = `http://${NEWS_SERVICE_HOST}:${NEWS_SERVICE_PORT}/api/fill_timespan`;
const apiUrl = 'https://polisen.se/api/events';

module.exports = {
  newsServiceUrl,
  apiUrl
};
