const Requests = require('../requests/Requests');
const Clients = require('../client/Clients');
const logger = require('../logger');

function completeRequest(req, res) {
  logger.debug('Trying to complete a request.');
  const { requestId } = req.body;
  const timespanRequest = Requests.getRequest(requestId);
  if (!timespanRequest) {
    logger.error(`Could not find the request ${requestId}.`);
    res.status(400).send('Could not complete the request as it does not exist');
    return;
  }
  const { clientId } = timespanRequest;
  const client = Clients.getClient(clientId);
  logger.debug('Successfully read request. Now pushing comletion-message to client.');
  client.socket.emit('complete_request', requestId);
  logger.debug(`Removing the request ${requestId}`);
  Requests.removeRequest(requestId);
  logger.debug('Responding with success-code');
  res.status(200).send('Successfully completed request ');
}

function liveNews(req, res) {
  logger.debug('Deconstructing request-body to get live news.');
  const { service, news } = req.body;
  logger.debug('Successfully parsed body. Responding with success. Pushing news to client.');
  res.sendStatus(200);
  Clients.emitLiveNews(service, news);
}
module.exports = {
  completeRequest,
  liveNews,
};
