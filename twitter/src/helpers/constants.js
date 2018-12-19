require('dotenv').config();
const { newsServiceHost, newsServicePort } = process.env;
const { twitterConsumerKey, twitterConsumerSecret, twitterAccessTokenKey, twitterAccessTokenSecret } = process.env;
const newsServiceUrl = `http://${newsServiceHost}:${newsServicePort}/api/live_news`;
const boundingBoxCoordinatesAroundSweden = '10.5922629,55.1365705,24.1773101,69.0600235';

module.exports = {
  newsServiceUrl,
  boundingBoxCoordinatesAroundSweden,
  twitterAccessTokenKey,
  twitterAccessTokenSecret,
  twitterConsumerKey,
  twitterConsumerSecret
};
