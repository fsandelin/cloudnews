
// Some imports
require('dotenv').config();

const winston = require('winston');

// Import socket.io and hook it up to http-server
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const MicroserviceHandler = require('./src/MicroserviceHandler');
const routes = require('./src/Routes');

// Apply the eventlisteners specified in SocketEvents.js
require('./src/SocketEvents').applyEventListeners(io);

// Get environment variables
const { WS_PORT, SERVER_PORT } = process.env;

// Define logging
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'middleware_root.log' }),
  ],
});

app.use('/api', routes);

// Verify that the requested services are available


const ms = new MicroserviceHandler((service, data) => {
  if (Array.isArray(data)) {
    io.to(service).emit('news_list', data);
  } else {
    io.to(service).emit('news', data);
  }
});


ms.listen(SERVER_PORT);
server.listen(WS_PORT);
logger.info(`Listening for sockets and API requests on: ${WS_PORT}`);
