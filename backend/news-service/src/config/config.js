require('dotenv').config();

const config = {
  env: process.env.NODE_ENV,
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    enabled: process.env.LOG_ENABLED,
  },
  host: process.env.HOST,
  port: process.env.PORT,
  middlewareInfo: {
    baseURL: `${process.env.MIDDLEWARE_HOST}:${process.env.MIDDLEWARE_PORT}`,
    completeRequestRoute: '/internal/complete_request',
    liveNewsRoute: '/internal/live_news',
  },
  scrapers: {
    polisenBaseURL: `${process.env.POLISEN_HOST}:${process.env.POLISEN_PORT}`,
    svtBaseUrl: `${process.env.SVT_HOST}:${process.env.SVT_PORT}`,
  },
  databaseName: 'cloudnews',
  scraperMetaCollectionName: 'prefetched',
};

module.exports = config;
