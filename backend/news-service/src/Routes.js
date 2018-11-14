const express = require('express');
const db = require('./controllers/DatabaseInterface');

const router = express.Router();

router.get('/timespan', (req, res) => {
  const { services, startDate, endDate } = req.params;
  // const servicesString = Buffer.from(req.params.services, 'base64').toString();
  // const { servicesArray } = JSON.parse(servicesString.trim());
  db.pushArticles([{ title: 'Carlsson & Carlsson på taket!' }], (error) => {
    if (error) {
      res.status(500).send(`500 internal server error: ${error}`);
    } else {
      res.send('Successfully added things!');
    }
  });
});

module.exports = router;
