const request = require('request');
const app = require('express')();
const counties = require('./counties.json');
const municipalities = require('./municipalities.json');

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
		} else {
			municipality = municipalityWithSuffix(news.location.name);
			if (municipality === undefined) continue;

			let {county, cities} = municipalities[municipality];
			county_temp = county;
			city = findStringInStringList(news.summary, cities);
		}

		newsListFormated.push({
			title: news.type,
			text: news.summary,
			url: news.url,
			timestamp: news.datetime,
			country: 'Sweden',
			county: county_temp,
			municipality: municipality,
			city: city
		});
	}
	console.log('newsList length: ', newsListFormated.length)
	return newsListFormated;
}

app.get('/api/polisens_nyheter', (req, res) => {
	const api_url = 'https://polisen.se/api/events';
	request.get({url: api_url}, (resp, err, body) => {
		const news = getNewsFromNewsList(JSON.parse(body));
		console.log(news);
	});
  res.sendStatus(200);
});

const port = 8080;
app.listen(port, () => {
  console.log(`police-news-service listening on ${port}`);
});
