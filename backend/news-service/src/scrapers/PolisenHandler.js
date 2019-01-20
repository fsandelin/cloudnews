const rq = require('request');
const config = require('../config/config');
const logger = require('../logger');

function scrapeNeededTimespans(neededTimespans) {
  const neededTimespan = neededTimespans[0];
  const options = {
    url: `http://${config.scrapers.polisen.baseURL}/api/polisens_nyheter`,
    body: neededTimespan,
    json: true,
  };
  logger.debug(`Sending scraping-request to polisen for the timespan: ${JSON.stringify(neededTimespan)}.`);
  rq.post(options, (error) => {
    if (error) {
      logger.error('Got an error when requesting a scraping campaign from polisen.');
      logger.error(error);
    } else {
      logger.debug('Successfully requested a scraping campaign from polisen.');
    }
  });
}

module.exports = {
  scrapeNeededTimespans,
};
