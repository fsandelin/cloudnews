const uuid = require('uuid/v4');
const winston = require('winston');
const rq = require('request');
const config = require('../config/config');
const Clients = require('./Clients');
const Requests = require('../requests/Requests');
const { parseRequestedResource } = require('../utils');

const availableServices = ['svt', 'twitter', 'polisen'];

// Define logging
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'middleware_SocketEvents.log' }),
  ],
});

function applyEventListeners(io) {
  Clients.initSocket(io);
  io.use((socket, next) => {
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
    console.log('Someone connected');
    const servicesString = socket.handshake.query.services;
    const services = servicesString.split('+').map(service => service.trim());
    const clientId = uuid();

    Clients.addClient(clientId, socket, services);

    logger.info(`Joining the following services: ${services}`);
    services.forEach((service) => {
      if (availableServices.includes(service)) {
        console.log(`Joining ${service}`);
        socket.join(service);
      }
    });

    // disconnect
    socket.on('disconnect', () => {
      Clients.removeClient(clientId);
      Requests.removeClientsRequest(clientId);
    });

    // timespan_request
    socket.on('timespan_request', (requestedResource) => {
      const requestId = uuid();
      let requestedResourceParsed = null;
      try {
        requestedResourceParsed = parseRequestedResource(requestedResource);
        requestedResourceParsed.completed = false;
      } catch (exception) {
        console.log(`Cannot parse requestedResources, probably wrong format: ${JSON.stringify(requestedResource)}`);
        Clients.getSocket(clientId).socket.emit('warning', 'Unable to parse the requested dates, please do things right!');
        return;
      }

      Requests.addRequest(requestId, clientId, requestedResourceParsed);
      console.log('Should now post request to news-service');
      rq.post({
        url: `http://${config.newsServiceInfo.baseURL}${config.newsServiceInfo.timespanRoute}`,
        body: Requests.getRequest(requestId),
        json: true,
      }, (error, response) => {
        if (error) {
          console.log('Got an error when posting to news-service');
          console.log(`Received an error when trying to post request to news-service: ${error}`);
          Requests.removeRequest(requestId);
          console.log(`Removed request with id: ${requestId}`);
        } else if (response.statusCode === 200) {
          console.log('Successfully posted request');
          console.log(`There are ${Requests.getRequestsCount()} unfullfilled requests`);
        } else {
          console.log(response.statusCode);
        }
      });
    });
  });
}

module.exports = {
  applyEventListeners,
};
