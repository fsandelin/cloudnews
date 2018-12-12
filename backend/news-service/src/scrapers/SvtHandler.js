const rq = require('request');
const config = require('../config/config');

function scrapeNeededTimespans(neededTimespans) {
  console.log(`We need to scrape for ${neededTimespans.length} missing timespans`);
  console.log(neededTimespans);
  const options = {
    url: `http://${config.scrapers.svtBaseUrl}/getnews/daterange/thread`,
    body: neededTimespans,
    json: true,
  };
  rq.post(options, (error, response) => {
    if (error) {
      console.log('Got a goddamn error');
      console.log(error);
    } else {
      // console.log(response);
    }
  });
}

module.exports = {
  scrapeNeededTimespans,
};
