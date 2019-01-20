require('dotenv').config();

const config = {
  env: process.env.NODE_ENV,
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    enabled: process.env.LOG_ENABLED,
  },
  host: process.env.HOST,
  port: process.env.PORT,
  newsServiceInfo: {
    baseURL: `${process.env.NEWS_SERVICE_HOST}:${process.env.NEWS_SERVICE_PORT}`,
    liveNewsRoute: '/api/live_news',
  }
};

module.exports = config;
