const Twitter = require('twitter');
const axios = require('axios');
const express = require('express')
const { newsServiceUrl } = require('./helpers/constants');
const { boundingBoxCoordinatesAroundSweden } = require('./helpers/constants');
const { twitterAccessTokenKey, twitterAccessTokenSecret, twitterConsumerKey, twitterConsumerSecret } = require('./helpers/constants');
const { tweetIsFromASwedishCity, formatTweet } = require('./helpers/misc');

const config = require('./config/config.js')
const app = express();

app.get('/api/heartbeat', (req, res) => {
  res.sendStatus(200);
})

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}`)
})

const client = new Twitter({
  consumer_key: twitterConsumerKey,
  consumer_secret: twitterConsumerSecret,
  access_token_key: twitterAccessTokenKey,
  access_token_secret: twitterAccessTokenSecret
});

const stream = client.stream('statuses/filter', { track: '', locations: boundingBoxCoordinatesAroundSweden });

stream.on('data', tweet => {
  if (tweetIsFromASwedishCity(tweet.place)) {
    const formatedTweet = formatTweet(tweet);

    axios.post(newsServiceUrl, {
      service: 'twitter',
      news: formatedTweet,
      timespan: {
        from: '',
        until: ''
      }
    })
      .then(() => {
        //console.log("Successfully sent news to news service!");
      })
      .catch(error => {
		console.log('Got an error sending to news-service');
        //console.log(error);
      });
  }
});

stream.on('error', (error) => {
  console.log('Got an error');
});
