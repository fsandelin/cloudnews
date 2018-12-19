require('dotenv').config();
const { APP_PORT, NEWS_SERVICE_HOST, NEWS_SERVICE_PORT } = process.env;

module.exports = {
    APP_PORT,
    NEWS_SERVICE_HOST,
    NEWS_SERVICE_PORT
};
