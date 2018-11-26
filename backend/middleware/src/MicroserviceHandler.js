const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
require('dotenv').config();


// Define logging
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'middleware_Routes.log' }),
  ],
});

// Get clients and requests objects.
const { clients, requests } = require('./SocketEvents');

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

    this.app.post('/complete_request', (req, res) => {
      logger.info('Should try to complete part of request');
      const { service, requestId, articles } = req.body;
      const timespanRequest = requests[requestId];
      if (!timespanRequest) {
        logger.error(`Cannot find request ${requestId}. Could it have already been completed?`);
        res.status(400).send('Could not complete the request as it does not exist');
        return;
      }
      const { clientId, requestedResources } = timespanRequest;
      const client = clients[clientId];
      const message = {
        requestId,
        articles,
      };
      client.socket.emit('complete_request', message);
      requestedResources.forEach((element) => {
        if (element.service === service) {
          element.completed = true;
          timespanRequest.incompleteResources -= 1;
        }
      });
      if (timespanRequest.incompleteResources === 0) {
        console.log('Removing request');
        delete requests[requestId];
      }

      res.status(200).send('Successfully completed request ');
    });
  }


  listen(port) {
    this.app.listen(port, () => {
      console.log(`Starting internal listening on port ${port}`);
    });
  }
};
