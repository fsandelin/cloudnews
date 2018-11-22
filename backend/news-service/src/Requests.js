const db = require('./controllers/DatabaseInterface');

const requests = {};

function scrapeRequestedResources(neededTimespans) {
  console.log(`We need to scrape for ${neededTimespans.length} missing timespans`);
  console.log(neededTimespans);
}

function completeRequest(request) {
  console.log('Should get articles from db and send to middleware');
  // Has Sent some stuffs
  delete requests[request.requestId];
}

function checkRequestCompletion(request) {
  const { requestId, requestedResources } = request;
  let neededTimespans = [];
  let uncheckedResources = requestedResources.length;
  requestedResources.forEach((requestedResource, index) => {
    if (requestedResource.completed) {
      console.log('requestedResource completed');
      uncheckedResources -= 1;
      return;
    }
    db.checkCompletion(requestedResource, (timespans) => {
      console.log(requestedResource);
      if (timespans.length === 0) {
        requestedResources[index].completed = true;
      } else {
        neededTimespans = neededTimespans.concat(timespans);
      }
      uncheckedResources -= 1;
      if (uncheckedResources === 0) {
        console.log('Has checked all resources');
        if (neededTimespans.length === 0) {
          requests[requestId].completed = true;
          completeRequest(requests[requestId]);
          console.log(`${requestId} is now marked as completed`);
        } else {
          scrapeRequestedResources(neededTimespans);
        }
      }
    });
  });
}

function addRequest(requestId, requestedResources) {
  requests[requestId] = {
    requestId,
    requestedResources,
    completed: false,
  };
  console.log(requests);
  checkRequestCompletion(requests[requestId]);
}

function checkRequestsCompletion() {
  const keys = Object.keys(requests);
  for (let i = 0; i < keys.length; i += 1) {
    checkRequestCompletion(requests[keys[i]]);
  }
}

module.exports = {
  addRequest,
  checkRequestsCompletion,
  requests,
};
