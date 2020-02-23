const bodyParser = require('body-parser');
var cors = require('cors');
const externalApp = require('express')();
const externalServer = require('http').Server(externalApp);
const externalIo = require('socket.io')(externalServer);

const internalApp = require('express')();
const Clients = require('./src/client/Clients');
const config = require('./src/config/config');

Clients.initSocket(externalIo);

const internalRoutes = require('./src/microservices/MicroserviceRoutes');
const externalRoutes = require('./src/client/ExternalRoutes');


const origin = process.env.NODE_ENV === 'production' ? process.env.ACCESS_CONTROL_ALLOW_ORIGIN : process.env.ACCESS_CONTROL_ALLOW_ORIGIN_DEV;
externalApp.use(cors(
	{
		origin: origin,
		credentials: true
	}
));
require('./src/client/ExternalEvents').applyEventListeners(externalIo);
externalApp.use('/api', externalRoutes);
internalApp.use(bodyParser.json({ limit: '10mb', extended: true }));
internalApp.use('/internal', internalRoutes);


internalApp.listen(config.internalPort, () => {
  console.log(`Running the internal server on ${config.internalPort}`);
});
externalServer.listen(config.externalPort);
// logger.info(`Listening for sockets and API requests on: ${config.externalPort}`);
