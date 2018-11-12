const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

module.exports = class MicroserviceHandler {
  constructor(serviceHandler) {
    this.activeServices = [];
    this.availableServices = [];
    this.app = express();
    this.app.use(bodyParser.json());

    this.app.post('/', (req, res) => {
      serviceHandler(req.query.service, req.body);
      res.send('Done');
    });
  }

  listen(port) {
    this.app.listen(port, () => {
      console.log(`Starting internal listening on port ${port}`);
    });
  }
};
