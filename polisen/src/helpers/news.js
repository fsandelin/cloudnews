const axios = require('axios');
const { flatten, stripTimeOfDate } = require('./misc');
const { findLocation } = require('./location');
const { newsServiceUrl } = require('./constants');
const { apiUrl } = require('./constants');
const uuid = require('uuid/v4');

const isNotSummary = (news) => (news['summary'].substr(14) !== 'Sammanfattning');

const formatNews = (news) => {
  return {
    id: uuid(),
    title: news.type,
    body: news.summary,
    datetime: news.datetime,
    location: findLocation(news)
  };
};

const formatNewsList = (newsList) => {
  return newsList.reduce((newsListFormated, news) => {
    if (isNotSummary(news)) {
      newsListFormated.push(formatNews(news));
    }
    return newsListFormated;
  }, []);
};

const sendNewsToNewsService = (news, timespan) => {
  axios.post(newsServiceUrl, {
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

const sendNewsRequests = (newsRequests, from, until) => {
  axios.all(newsRequests)
    .then(results => {
      const newsList = flatten(results.map(r => r.data));
      const newsListFormated = formatNewsList(newsList);
      console.log('Number of news:', newsListFormated.length);
      const timespan = { from: from, until: until };
      sendNewsToNewsService(newsListFormated, timespan);
    })
    .catch(error => {
      console.log(error);
    });
};

const getNewsFromPolisen = (date) => {
  return axios.get(apiUrl, {
    params: {
      datetime: (date === null) ? null : stripTimeOfDate(date) // If date is null all 500 news will be returned.
    }
  });
};

const createNewsRequestsFromDates = (dates) => [...dates.map(date => getNewsFromPolisen(date))];

module.exports = {
  sendNewsRequests,
  createNewsRequestsFromDates
};
