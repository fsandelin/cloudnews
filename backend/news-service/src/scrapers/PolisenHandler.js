const rq = require('request');
const config = require('../config/config');

function scrapeNeededTimespans(neededTimespans) {
  console.log('Should get timespans fron polisen');
  console.log(neededTimespans);
  const neededTimespan = neededTimespans[0];
  const options = {
    url: `http://${config.scrapers.polisenBaseURL}/api/polisens_nyheter`,
    body: neededTimespan,
    json: true,
  };
  console.log(options.url);
  rq.post(options, (error, response) => {
    if (error) {
      console.log('Got an error');
    } else {
      console.log('Managed to send a scrape-request');
    }
  });
}

module.exports = {
  scrapeNeededTimespans,
};
