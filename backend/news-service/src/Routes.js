const express = require('express');
const db = require('./controllers/DatabaseInterface');

const router = express.Router();

router.post('/new_articles', (req, res) => {
  const { services, startDate, endDate } = req.params;
  // const servicesString = Buffer.from(req.params.services, 'base64').toString();
  // const { servicesArray } = JSON.parse(servicesString.trim());
  db.pushArticles(req.body.articles, (error) => {
    if (error) {
      res.status(500).send(`500 internal server error: ${error}`);
    } else {
      res.send('Successfully added things!');
    }
  });
});

router.get('/timespan', (req, res) => {
  const { from, until } = req.query;
  // console.log(`from: ${from}\n until: ${until}`);
  // console.log(req.query);
  db.getTimeSpan(from, until, (error, documents) => {
    if (error) {
      res.status(500).send(`500 internal server error: ${error}`);
    } else {
      res.json(documents);
    }
  });
});

module.exports = router;
