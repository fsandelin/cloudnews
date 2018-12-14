require('dotenv').config();
const Twitter = require('Twitter');
const cities = require('./assets/cities.json');
const axios = require('axios');
const newsServiceUrl = require('./helpers/constants');
const boundingBoxCoordinatesAroundSweden = require('./helpers/constants')

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const stream = client.stream('statuses/filter', { track: '', locations: boundingBoxCoordinatesAroundSweden });

const tweetIsFromASwedishCity = (place) => {
  return (place !== null && place.country_code === 'SE' && place.place_type === 'city' && cities[place.name] !== undefined);
};

stream.on('data', tweet => {
  if (tweetIsFromASwedishCity(tweet.place)) {
    const city = tweet.place.name;
    const { county, municipality } = cities[city];
    const datetime = new Date(tweet.created_at).toISOString().substr(0, 10);
    const url = 'https://twitter.com/statuses/' + tweet.id_str;

    const tweet = {
      id: uuid(),
      title: tweet.user.screen_name,
      datetime: datetime,
      location: {
        country: 'Sweden',
        county: county,
        municipality: municipality,
        city: tweet.place.name,
      },
      body: tweet.text,
      url: url
    }

    axios.post(newsServiceUrl, {
      service: 'twitter',
      news: tweet,
      timespan: {
        from: '',
        until: ''
      }
    })
      .then(() => {
        console.log("Successfully sent news to news service!");
      })
      .catch(error => {
        console.log(error);
      });
  }
});

stream.on('error', (error) => {
  console.log('error', error);
});
