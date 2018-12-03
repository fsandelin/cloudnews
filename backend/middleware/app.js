
require('dotenv').config();

const winston = require('winston');

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const MicroserviceHandler = require('./src/MicroserviceHandler');
const routes = require('./src/Routes');

require('./src/SocketEvents').applyEventListeners(io);

const { WS_PORT, SERVER_PORT } = process.env;

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'middleware_root.log' }),
  ],
});

app.use('/api', routes);

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
