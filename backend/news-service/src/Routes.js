const express = require('express');

const router = express.Router();

router.get('/timespan', (req, res) => {
  const { services, startDate, endDate } = req.params;
  // const servicesString = Buffer.from(req.params.services, 'base64').toString();
  // const { servicesArray } = JSON.parse(servicesString.trim());
  res.send('Hello world');
});

module.exports = router;
