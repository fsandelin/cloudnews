
// Get configuration things
require('dotenv').config();
// Import socket.io and hook it up to http-server
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const MicroserviceHandler = require('./src/MicroserviceHandler');
const routes = require('./src/Routes');

const { WS_PORT, SERVER_PORT } = process.env;

const availableServices = ['tt', 'svt'];
const clients = {};

// setInterval(() => { console.log(clients); }, 5000);

// Hook up the websocket server to the http server
// Verify the services are available
app.use('/api', routes);

io.use((socket, next) => {
  const servicesString = Buffer.from(socket.handshake.query.services, 'base64').toString();
  const { services } = JSON.parse(servicesString.trim());
  let verified = true;
  let service = null;
  for (let i = 0; i < services.length; i++) {
    service = services[i];
    if (availableServices.indexOf(service) === -1) {
      verified = false;
      console.log(`The following service cannot be found: ${service}`);
      socket.disconnect();
    }
  }
  if (verified) next();
  else next(new Error('Service not found.'));
});

io.on('connection', (socket) => {
  console.log('Someone connected');
  const servicesString = Buffer.from(socket.handshake.query.services, 'base64').toString();
  const { services } = JSON.parse(servicesString.trim());

  clients[socket.id] = {
    socket,
    services,
  };
  console.log(`Joining the following services: ${services}`);
  services.forEach((service) => {
    if (availableServices.includes(service)) {
      socket.join(service);
    }
  });

  socket.on('disconnect', () => {
    delete clients[socket.id];
    console.log('Client disconnected');
    console.log(clients);
  });
});

const ms = new MicroserviceHandler((service, data) => {
  // console.log(`Got data from the following service: ${service}`);
  io.to(service).emit('news', data);
});


ms.listen(SERVER_PORT);
server.listen(WS_PORT);
console.log(`Listening for sockets and API requests on: ${WS_PORT}`);
