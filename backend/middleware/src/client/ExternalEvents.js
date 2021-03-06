const uuid = require('uuid/v4');
const rq = require('request');
const config = require('../config/config');
const Clients = require('./Clients');
const Requests = require('../requests/Requests');
const { parseRequestedResource } = require('../utils');
const logger = require('../logger');

const availableServices = ['svt', 'twitter', 'polisen'];

function applyEventListeners(io) {
  Clients.initSocket(io);
  io.use((socket, next) => {
    logger.debug('Checking that services exist.');
    const servicesString = socket.handshake.query.services;
    const services = servicesString.split('+').map(service => service.trim());
    let verified = true;
    for (const service of services) {
      if (availableServices.indexOf(service) === -1) {
        verified = false;
        logger.error(`Tried to subscribe to the following unknown service: ${service}`);
        socket.disconnect();
      }
    }
    if (verified) next();
    else next(new Error('Service not found.'));
  });

  // connection
  io.on('connection', (socket) => {
    logger.debug('Someone connected');
    const servicesString = socket.handshake.query.services;
    const services = servicesString.split('+').map(service => service.trim());
    const clientId = uuid();

    Clients.addClient(clientId, socket, services);

    logger.info(`Joining the following services: ${services}`);
    services.forEach((service) => {
      if (availableServices.includes(service)) {
        socket.join(service);
      }
    });

    // disconnect
    socket.on('disconnect', () => {
      Clients.removeClient(clientId);
      Requests.removeClientsRequest(clientId);
      logger.debug(`Removing client: ${clientId}`);
    });

    // timespan_request
    socket.on('timespan_request', (requestedResource) => {
      logger.debug('Got a timespan request');
      const requestId = uuid();
      let requestedResourceParsed = null;
      try {
        logger.debug('Parsing requested resource');
        requestedResourceParsed = parseRequestedResource(requestedResource);
        requestedResourceParsed.completed = false;
      } catch (exception) {
        console.log(`Cannot parse requestedResources, probably wrong format: ${JSON.stringify(requestedResource)}, the following exception was thrown: ${JSON.stringify(exception)}`);
        Clients.getSocket(clientId).socket.emit('warning', 'Unable to parse the requested dates, please do things right!');
        return;
      }
      logger.debug('Adding request.');
      Requests.addRequest(requestId, clientId, requestedResourceParsed);
      logger.debug('Posting request to news-service');
      rq.post({
        url: `http://${config.newsServiceInfo.baseURL}${config.newsServiceInfo.timespanRoute}`,
        body: Requests.getRequest(requestId),
        json: true,
      }, (error, response) => {
        if (error) {
          logger.error(`Received an error when trying to post request to news-service: ${error}`);
          Requests.removeRequest(requestId);
        } else if (response.statusCode === 200) {
          logger.debug(`Successfully posted request. There are ${Requests.getRequestsCount()} unfullfilled requests`);
        } else {
          logger.debug(response.statusCode);
        }
      });
    });
  });
}

module.exports = {
  applyEventListeners,
};
