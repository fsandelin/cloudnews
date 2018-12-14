require('dotenv').config();

const config = {
  env: process.env.NODE_ENV,
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    enabled: process.env.LOG_ENABLED,
  },
  externalHost: process.env.EXTERNAL_HOST,
  externalPort: process.env.EXTERNAL_PORT,
  internalHost: process.env.INTERNAL_HOST,
  internalPort: process.env.INTERNAL_PORT,
  newsServiceInfo: {
    baseURL: `${process.env.NEWS_SERVICE_HOST}:${process.env.NEWS_SERVICE_PORT}`,
    timespanRoute: '/api/request/timespan',
    availableServicesRoute: '/api/available_services',
    getNewsRoute: '/api/news',
  },
};

module.exports = config;
