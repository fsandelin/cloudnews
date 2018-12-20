const logger = require('./logger');

function parseRequestedResource(requestedResource) {
  logger.debug(`Parsing requested resource: ${JSON.stringify(requestedResource)}`);
  try {
    const requestedResourceParsed = JSON.parse(requestedResource);
    requestedResourceParsed.from = new Date(requestedResourceParsed.from);
    requestedResourceParsed.until = new Date(requestedResourceParsed.until);
    if (requestedResourceParsed.until > Date.now()) {
      logger.debug('Until-date is after now');
      requestedResourceParsed.until = new Date(Date.now());
    }
    return requestedResourceParsed;
  } catch (exception) {
    logger.error(`Got an exception when trying to parse requested resource. Exception: ${exception}`);
    throw exception;
  }
}

module.exports = {
  parseRequestedResource,
};
