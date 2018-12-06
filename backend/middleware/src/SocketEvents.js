require('dotenv').config();
const uuid = require('uuid/v4');
const winston = require('winston');
const rq = require('request');

const availableServices = ['tt', 'svt', 'twitter', 'polisen'];
const { NEWS_SERVICE_HOST, NEWS_SERVICE_PORT } = process.env;

const clients = {};
const requests = {};

// Define logging
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'middleware_SocketEvents.log' }),
  ],
});

function applyEventListeners(io) {
  io.use((socket, next) => {
    const servicesString = Buffer.from(socket.handshake.query.services, 'base64').toString();
    const { services } = JSON.parse(servicesString.trim());
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

  io.on('connection', (socket) => {
    logger.info('Someone connected');
    const servicesString = Buffer.from(socket.handshake.query.services, 'base64').toString();
    const { services } = JSON.parse(servicesString.trim());
    const clientId = uuid();

    clients[clientId] = {
      socket,
      services,
    };
    logger.info(`Joining the following services: ${services}`);
    services.forEach((service) => {
      if (availableServices.includes(service)) {
        socket.join(service);
      }
    });

    socket.on('disconnect', () => {
      delete clients[socket.id];
      logger.info('Client disconnected');
      logger.debug(clients);
    });

    socket.on('timespan_request', (requestedResource) => {
      const requestId = uuid();
      const request = {
        requestId,
        clientId,
      };
      let requestedResourceParsed = null;
      try {
        requestedResourceParsed = JSON.parse(requestedResource);
        requestedResourceParsed.completed = false;
      } catch (exception) {
        console.log('Cannot parse requestedResources, probably wrong format');
        return;
      }
      if (isNaN(Date.parse(requestedResourceParsed.from)) || isNaN(Date.parse(requestedResourceParsed.until))) {
        clients[clientId].socket.emit('warning', 'Unable to parse the requested dates, please do things right!');
        return;
      }

      request.requestedResource = requestedResourceParsed;

      requests[requestId] = request;
      logger.info(requests);
      rq.post({
        url: `http://${NEWS_SERVICE_HOST}:${NEWS_SERVICE_PORT}/api/request/timespan`,
        body: request,
        json: true,
      }, (error, response) => {
        if (error) {
          logger.error(`Received an error when trying to post request to news-service: ${error}`);
          delete requests[requestId];
          logger.error(`Removed request with id: ${requestId}`);
        } else if (response.statusCode === 200) {
          logger.info('Successfully posted request');
          logger.info(`There are ${Object.keys(requests).length} unfullfilled requests`);
        }
      });
    });
  });
}

module.exports = {
  applyEventListeners,
  clients,
  requests,
};
