require('dotenv').config();
const { NEWS_SERVICE_HOST, NEWS_SERVICE_PORT } = process.env;
const newsServiceUrl = `http://${NEWS_SERVICE_HOST}:${NEWS_SERVICE_PORT}/api/live_news`;
const boundingBoxCoordinatesAroundSweden = '10.5922629,55.1365705,24.1773101,69.0600235';

module.exports = {
  newsServiceUrl,
  boundingBoxCoordinatesAroundSweden
};
