require('dotenv').config();

const config = {
  env: process.env.NODE_ENV,
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    enabled: process.env.LOG_ENABLED,
  },
  host: process.env.HOST,
  port: process.env.PORT,
  articles_collection_prefix: 'articles_',
  middlewareInfo: {
    baseURL: `${process.env.MIDDLEWARE_HOST}:${process.env.MIDDLEWARE_PORT}`,
    completeRequestRoute: '/internal/complete_request',
    liveNewsRoute: '/internal/live_news',
  },
  scrapers: {
    polisen: {
      serviceName: 'polisen',
      baseUrl: `${process.env.POLISEN_HOST}:${process.env.POLISEN_PORT}`,
    },
    svt: {
      serviceName: 'svt',
      baseUrl: `${process.env.SVT_HOST}:${process.env.SVT_PORT}`,
    },
    twitter: {
      serviceName: 'twitter',
      baseUrl: `${process.env.TWITTER_HOST}:${process.env.TWITTER_PORT}`,
    },
  },
  databaseName: 'cloudnews',
  scraperMetaCollectionName: 'prefetched',
  pageSize: 31,
};

module.exports = config;
