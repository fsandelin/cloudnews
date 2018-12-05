const R = require('request');
const db = require('./controllers/DatabaseInterface');
require('dotenv').config();

const {
  MIDDLEWARE_HOST, MIDDLEWARE_PORT, SVT_PORT, POLISEN_PORT,
} = process.env;
const MIDDLEWARE_ROUTE = '/complete_request';
const COMPLETE_REQUEST_URL = `http://${MIDDLEWARE_HOST}:${MIDDLEWARE_PORT}${MIDDLEWARE_ROUTE}`;
const SCRAPER_URL_SVT = `http://localhost:${SVT_PORT}/getnews/daterange`;
const SCRAPER_URL_POLISEN = `http://localhost:${POLISEN_PORT}/api/polisens_nyheter`;


function handleSVT(neededTimespans) {
  console.log(`We need to scrape for ${neededTimespans.length} missing timespans`);
  console.log(neededTimespans);
  const options = {
    url: SCRAPER_URL_SVT,
    body: neededTimespans,
    json: true,
  };
  R.post(options, (error, response) => {
    if (error) {
      console.log('Got a goddamn error');
      console.log(error);
    } else {
      console.log(response);
    }
  });
}

function handlePolisen(neededTimespan) {
  const options = {
    url: SCRAPER_URL_POLISEN,
    body: neededTimespan,
    json: true,
  };
  R.post(options, (error, response) => {
    if (error) {
      console.log('Got an error');
    } else {
      console.log('Managed to send a scrape-request');
    }
  });
}

module.exports = {
  svt: handleSVT,
  polisen: handlePolisen,
};
