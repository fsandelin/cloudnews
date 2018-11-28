const request = require('request');
const app = require('express')();
const counties = require('./counties.json');
const municipalities = require('./municipalities.json');

app.get('/api/polisens_nyheter', (req, res) => {
  const api_url = 'https://polisen.se/api/events';
  const params = {};
  request.get({url: api_url, qs: params}, (resp, err, body) => {
    console.log(body);
  });
  res.sendStatus(200);
});

const port = 8080;
app.listen(port, () => {
  console.log(`police-news-service listening on ${port}`);
});

const findStringInStringList = (str, strList) => {
	for (const s of strList) {
		if (str.toLowerCase().includes(s)) {
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

const newsList = require('./polisens_nyheter_test.json');
const newsList_formated = [];
for	(const news of newsList) {
	let county = '', municipality = '', city = '';

	if (news['summary'].substr(14) === 'Sammanfattning') {
		continue;
	}
	if (news.location.name.substr(-3) === 'län') {
		county = news.location.name;
		municipality = findStringInStringList(news.summary, counties[county.substr(county.length-4)]);
		municipality = municipalityWithSuffix(municipality);
	} else {
		console.log("------------------")
		console.log(news.location.name)
		municipality = municipalityWithSuffix(news.location.name);
		console.log(municipality)
		console.log(municipalities[municipality])
		let {county, cities} = municipalities[municipality];
		city = findStringInStringList(news.summary, cities);
	}

	newsList_formated.push({
		title: news.type,
		text: news.summary,
		url: news.url,
		timestamp: news.datetime,
		country: 'Sweden',
		county: county,
		municipality: municipality,
		city: city
	});
}
console.log(newsList_formated);