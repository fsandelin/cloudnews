require('dotenv').config();
const app = require('express')();
const bodyParser = require('body-parser');
const { dateIsGiven, getDateRange } = './misc';
const { createNewsRequestsFromDates, sendNewsRequests } = './news';

const { APP_PORT } = process.env;
app.use(bodyParser.json({ extended: true }));

app.post('/api/polisens_nyheter', (req, res) => {
  console.log('Got a request');

  const { from, until } = (dateIsGiven(req.body)) ? req.body : { from: '', until: '' };
  const dates = (from !== '') ? getDateRange(from, until) : [null];
  const newsRequests = createNewsRequestsFromDates(dates);
  sendNewsRequests(newsRequests, from, until);

  res.sendStatus(200);
});

app.listen(APP_PORT, () => {
  console.log(`police-news-service listening on ${APP_PORT}`);
});
