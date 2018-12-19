
function parseRequestedResource(requestedResource) {
  console.log(requestedResource);
  try {
    const requestedResourceParsed = JSON.parse(requestedResource);
    requestedResourceParsed.from = new Date(requestedResourceParsed.from);
    requestedResourceParsed.until = new Date(requestedResourceParsed.until);
    if (requestedResourceParsed.until >= Date.now()) {
      requestedResourceParsed.until = Date.now();
    }
    return requestedResourceParsed;
  } catch (exception) {
    console.log(exception);
    throw exception;
  }
}

module.exports = {
  parseRequestedResource,
};
