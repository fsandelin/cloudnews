
// Get configuration things
require('dotenv').config();
// Import and instantiate an http server
const server = require('http').createServer();
// Import socket.io and hook it up to http-server
const io = require('socket.io')();
const MicroserviceConnection = require('./src/MicroserviceConnection');

const ws_host = process.env.WS_HOST;
const ws_port = process.env.WS_PORT;
const mock_host = process.env.MOCK_HOST;
const mock_port = process.env.MOCK_PORT;

const clients = [];

// Hook up the websocket server to the http server
io.on('connect', () => {
  console.log('Someone connected');
});
io.on('connection', (socket) => {
  clients.push(socket);
  // console.log(client);
  const ms = new MicroserviceConnection('TT', mock_host, mock_port, {}, (article) => {
    console.log(`The following article was received: ${article}`);
  });

  socket.on('disconnect', () => {
    clients.pop();
    console.log('Client disconnected');
    // ms.disconnect();
  });
  socket.on('message', (message) => {
    console.log(`User tried to send a message but this isn\'t a goddamn chat, anyhow, heres what they wrote: ${message}`);
  });
});

io.listen(ws_port);
// const { services } = JSON.parse(Buffer.from(query_params.services, 'base64').toString().trim());
