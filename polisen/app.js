require('dotenv').config();
const request = require('request');
const app = require('express')();
const axios = require('axios');
const counties = require('./counties.json');
const municipalities = require('./municipalities.json');

const { APP_PORT, NEWS_SERVICE_HOST, NEWS_SERVICE_PORT } = process.env;
const NEWS_SERVICE_URL = `http://${NEWS_SERVICE_HOST}:${NEWS_SERVICE_PORT}/api/fill_timespan`;
app.use(bodyParser.json({ extended: true }));

const findStringInText = (str, strList) => {
	return strList.find(s => str.toLowerCase().includes(s.toLowerCase())) || '';
};

const municipalityWithSuffixOrEmptyString = (municipality) => {
	if (municipality === undefined || municipality === '') {
		return '';
	}
	if (municipalities[municipality + ' kommun'] !== undefined) {
		return municipality + ' kommun';
	}
	if (municipalities[municipality + 's kommun'] !== undefined) {
		return municipality + 's kommun';
	}
	if (municipality === 'Falun') {
		return 'Falu kommun';
	}
};

const formatMunicipalityStrings = (municipalities) => Object.keys(municipalities).map((c) => c.substr(0, c.length - 7)); // Remove ' kommun'

const isNotSummary = (news) => (news['summary'].substr(14) !== 'Sammanfattning');

const findLocationForCountyNews = (news) => {
	const municipalityList = formatMunicipalityStrings(counties[county_temp]);
	const municipality = municipalityWithSuffixOrEmptyString(findStringInText(news.summary, municipalityList));

	return {
		country: 'Sweden',
		county: news.location.name,
		municipality: municipality,
		city: ''
	};
};

const findLocationForMunicipalityNews = (news) => {
	const municipality = municipalityWithSuffixOrEmptyString(news.location.name);
	if (municipality === '') return {};

	const { county, cities } = municipalities[municipality];
	const city = findStringInText(news.summary, cities);

	return {
		country: 'Sweden',
		county: county,
		municipality: municipality,
		city: city
	};
};

const findLocation = (news) => {
	if (news.location.name.substr(-3) === 'län') {
		return findLocationForCountyNews(news);
	} 
	if (news.location.name.substr(-6) === 'kommun') {
		return findLocationForMunicipalityNews(news);
	}
	return {
		country: 'Sweden',
		county: '',
		municipality: '',
		city: ''
	};
};

const formatNews = (news) => {
	return {
		id: uuid(), 
		title: news.type,
		body: news.summary,
		datetime: news.datetime,
		location: findLocation(news) 
	};
};

const getNewsFromNewsList = (newsList) => {
	return newsList.reduce((newsListFormated, news) => {
		if (isNotSummary(news)) {
			newsListFormated.push(formatNews(news));
		}
		return newsListFormated;
	}, []);
};

const sendNewsToNewsService = (news, timespan) => {
	axios.post(NEWS_SERVICE_URL, {
		service: 'polisen',
		news: news,
		timespan: timespan
	})
		.then(() => {
			console.log("Successfully sent news to news service!")
		})
		.catch(error => {
			console.log(error);
		});
};

const getNewsFromPolisen = (date) => {
	const api_url = 'https://polisen.se/api/events';
	return axios.get(api_url, {
		params: {
			datetime: date // If date is null all 500 news will be returned.
		}
	});
};

const getDateRange = (from, until) => {
	const dates = [];
	for (const date = new Date(until); date >= new Date(from); date.setDate(date.getDate() - 1)) {
		dates.push(stripTimeOfDate(date.toISOString()));
	}
	return dates;
};

const flatten = (arr) => [].concat.apply([], arr);

const dateIsGiven = (body) => {
	return (body !== undefined && body.from !== undefined && body.from !== '' && body.until !== undefined);
};

const stripTimeOfDate = (date) => date.substr(0, 10);

const createRequestsFromDates = (dates) => [...dates.map(date => getNewsFromPolisen(date))];

const sendRequests = (requests, from, until) => {
	axios.all(requests)
		.then(results => {
			const newsList = flatten(results.map(r => r.data));
			const news = getNewsFromNewsList(newsList);
			console.log('Number of news:', news.length);
			const timespan = { from: stripTimeOfDate(from), until: stripTimeOfDate(until) };
			sendNewsToNewsService(news, timespan);
		})
		.catch(error => {
			console.log(error);
		});
};

app.post('/api/polisens_nyheter', (req, res) => {
	console.log('Got a request');

	const { from, until } = (dateIsGiven(req.body)) ? req.body : { from: '', until: '' };
	const dates = (from !== '') ? getDateRange(from, until) : [null];
	const requests = createRequestsFromDates(dates);
	sendRequests(requests, from, until);

	res.sendStatus(200);
});

app.listen(APP_PORT, () => {
	console.log(`police-news-service listening on ${APP_PORT}`);
});
