require('dotenv').config();
const { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET, TWITTER_ACCESS_TOKEN_KEY, TWITTER_ACCESS_TOKEN_SECRET } = process.env;
const { NEWS_SERVICE_HOST, NEWS_SERVICE_PORT } = process.env;
const newsServiceUrl = `http://${NEWS_SERVICE_HOST}:${NEWS_SERVICE_PORT}/api/live_news`;
const twitterConsumerKey = TWITTER_CONSUMER_KEY;
const twitterConsumerSecret = TWITTER_CONSUMER_SECRET;
const twitterAccessTokenKey = TWITTER_ACCESS_TOKEN_KEY;
const twitterAccessTokenSecret = TWITTER_ACCESS_TOKEN_SECRET;

module.exports = {
  newsServiceUrl,
  twitterAccessTokenKey,
  twitterAccessTokenSecret,
  twitterConsumerKey,
  twitterConsumerSecret
};
