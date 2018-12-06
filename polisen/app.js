require('dotenv').config();
const app = require('express')();
const axios = require('axios');
const bodyParser = require('body-parser');
const counties = require('./counties.json');
const municipalities = require('./municipalities.json');
const uuid = require('uuid/v4');

const {APP_PORT, NEWS_SERVICE_HOST, NEWS_SERVICE_PORT} = process.env;
const NEWS_SERVICE_URL = `http://${NEWS_SERVICE_HOST}:${NEWS_SERVICE_PORT}/api/fill_timespan`;
app.use(bodyParser.json({ extended: true }));

const findStringInStringList = (str, strList) => {
	for (const s of strList) {
		if (str.toLowerCase().includes(s.toLowerCase())) {
			return s;
		}
	}
	return '';
}

const municipalityWithSuffix = (municipality) => {
	if (municipalities[municipality + ' kommun'] !== undefined) {
		return municipality + ' kommun';
	}
	if (municipalities[municipality + 's kommun'] !== undefined) {
		return municipality + 's kommun';
	}
	if (municipality === 'Falun') {
		return 'Falu kommun';
	}
}

const getNewsFromNewsList = (newsList) => {
	const newsListFormated = [];
	for	(const news of newsList) {
		let county_temp = '', municipality = '', city = '';

		if (news['summary'].substr(14) === 'Sammanfattning') {
			continue;
		}
		if (news.location.name.substr(-3) === 'län') {
			county_temp = news.location.name;

			const municipalityList = Object.keys(counties[county_temp]).map((c) => c.substr(0, c.length-7)); // Remove ' kommun'
			municipality = findStringInStringList(news.summary, municipalityList);
			municipality = (municipality !== '') ? municipalityWithSuffix(municipality) : '';
		} else {
			municipality = municipalityWithSuffix(news.location.name);
			if (municipality === undefined) continue;

			let {county, cities} = municipalities[municipality];
			county_temp = county;
			city = findStringInStringList(news.summary, cities);
		}

		newsListFormated.push({
			id: uuid(),
			title: news.type,
			body: news.summary,
			url: news.url,
			datetime: news.datetime,
			location: {
				country: 'Sweden',
				county: county_temp,
				municipality: municipality,
				city: city
			}
		});
	}
	return newsListFormated;
}

const sendNewsToNewsService = (news, timespan) => {
  axios.post(NEWS_SERVICE_URL, {
      service: 'polisen',
      news: news,
      timespan: timespan
		})
		.then((res) => {
      console.log("Successfully sent news to news service!")
		})
		.catch((error) => {
			console.log(error);
		});
};

const getNewsFromPolisen = (date) => {
  const api_url = 'https://polisen.se/api/events';
  return axios.get(api_url, {
      params: {
        datetime: date
      }
    });
};

const getDateRange = (from, until) => {
  let dates = [];
  for (const date = new Date(until); date >= new Date(from); date.setDate(date.getDate()-1)) {
    dates.push(date.toISOString().substr(0, 10));
  }
  return dates;
};

const flatten = (arr) => [].concat.apply([], arr);

const dateIsGiven = (neededTimespan) => {
	return !(neededTimespan === undefined || neededTimespan.from === undefined || neededTimespan.from === '');
}

app.post('/api/polisens_nyheter', (req, res) => {
	let from = '';
	let until = '';
	let requests; 

	if (dateIsGiven(req.body.neededTimespan)) {
    ({from, until} = req.body.neededTimespan);
    if (until === '') until = from;
  
    const dates = getDateRange(from, until);
    requests = dates.map(date => getNewsFromPolisen(date));
	} else {
		requests = [getNewsFromPolisen(null)];
	}

  axios.all(requests)
    .then((results) => {
      const newsList = flatten(results.map(r => r.data));
      const news = getNewsFromNewsList(newsList);
      const timespan = {from: from.substr(0, 10), until: until.substr(0, 10)};

      sendNewsToNewsService(news, timespan);
    })
    .catch((error) => {
      console.log(error);
    });
  
  res.sendStatus(200);
});

app.listen(APP_PORT, () => {
  console.log(`police-news-service listening on ${APP_PORT}`);
});
