
function parseRequestedResource(requestedResource) {
  try {
    const requestedResourceParsed = JSON.parse(requestedResource);
    requestedResourceParsed.from = new Date(requestedResourceParsed.from);
    requestedResourceParsed.until = new Date(requestedResourceParsed.until);
  } catch (exception) {
    throw exception;
  }
}

module.exports = {
  parseRequestedResource,
};
