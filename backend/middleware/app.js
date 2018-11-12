
// Get configuration things
require('dotenv').config();
// Import socket.io and hook it up to http-server
const io = require('socket.io')();
const MicroserviceHandler = require('./src/MicroserviceHandler');

const ws_host = process.env.WS_HOST;
const ws_port = process.env.WS_PORT;
const mock_host = process.env.MOCK_HOST;
const mock_port = process.env.MOCK_PORT;
const SERVER_PORT = process.env.SERVER_PORT;

const availableServices = ['tt', 'svt'];
const clients = {};

// setInterval(() => { console.log(clients); }, 5000);

// Hook up the websocket server to the http server
// Verify the services are available
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
io.listen(ws_port);
