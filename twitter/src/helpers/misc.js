const cities = require('./assets/cities.json');

const tweetIsFromASwedishCity = (place) => {
  return (place !== null && place.country_code === 'SE' && place.place_type === 'city' && cities[place.name] !== undefined);
};

const formatTweet = (tweet) => {
  const city = tweet.place.name;
  const { county, municipality } = cities[city];
  const datetime = new Date(tweet.created_at).toISOString().substr(0, 10);
  const url = 'https://twitter.com/statuses/' + tweet.id_str;

  return {
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
  };
};

module.exporst = {
  tweetIsFromASwedishCity,
  formatTweet
};