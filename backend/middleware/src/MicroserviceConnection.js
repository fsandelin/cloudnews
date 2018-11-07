require('dotenv').config();
const io = require('socket.io-client');

module.exports = class MicroserviceConnection {
  constructor(serviceName, serviceHost, servicePort, params, callback) {
    // Connection information for the service
    this.serviceName = serviceName;
    this.serviceHost = serviceHost;
    this.servicePort = servicePort;
    this.params = params;
    this.callback = callback;
    // Parameters for active connections
    this.socket = new io(`http://${this.serviceHost}:${this.servicePort}`, { reconnectionAttempts: 6 });
    this.socket.on('connect', () => {
      console.log('User connected');
    });
    this.socket.on('news', (article) => {
      this.callback(article);
    });
    this.socket.on('disconnect', () => {
      console.log('The connection with the microservice has been disconnected');
    });
    this.socket.on('reconnection_attempt', () => {
      console.log('Trying to reconnect');
    });
  }

  disconnect() {
    this.socket.disconnect();
  }
};
