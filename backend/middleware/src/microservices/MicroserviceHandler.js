const Requests = require('../requests/Requests');
const Clients = require('../client/Clients');

function completeRequest(req, res) {
  const { requestId } = req.body;
  const timespanRequest = Requests.getRequest(requestId);
  if (!timespanRequest) {
    console.log(`Cannot find request ${requestId}. Could it have already been completed?`);
    res.status(400).send('Could not complete the request as it does not exist');
    return;
  }
  const { clientId } = timespanRequest;
  const client = Clients.getClient(clientId);

  client.socket.emit('complete_request', requestId);
  Requests.removeRequest(requestId);

  res.status(200).send('Successfully completed request ');
}

function liveNews(req, res) {
  const { service, news } = req.body;
  res.sendStatus(200);
  Clients.emitLiveNews(service, news);
}
module.exports = {
  completeRequest,
  liveNews,
};
