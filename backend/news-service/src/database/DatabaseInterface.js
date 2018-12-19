const dbConnection = require('./DatabaseHandler');
const { getIncludedTimespans, getNewTimespan, compareDates } = require('../utils');
const config = require('../config/config');
const logger = require('../logger');

function fillTimeSpan(service, news, timespan, callback, retries = 5) {
  logger.debug('Filling timespan');
  const prefetchedCollectionName = 'prefetched';
  const articlesCollectionName = `articles_${service}`;

  if (timespan.until > Date.now() || timespan.from >= timespan.until) {
    callback('The timespan you have provided is invalid.');
    return;
  }

  dbConnection.connect((error, client) => {
    logger.debug('Creating a session');
    const session = dbConnection.getSession();
    const db = client.db(config.databaseName);
    try {
      logger.debug('Starting transaction');
      session.startTransaction();
    } catch (mongoError) {
      if (retries) {
        logger.info('Retrying starting transaction');
        setTimeout(() => fillTimeSpan(service, news, timespan, callback, retries - 1), 300);
        return;
      }
      logger.error(mongoError);
    }

    db.collection(prefetchedCollectionName).findOne({ service }, { session, _id: false }, (error3, result) => {
      logger.debug(`Got timespans available in the database for service: ${service}`);
      let timespans = null;
      try {
        timespans = result.timespans;
      } catch (e) {
        timespans = [];
      }
      if (error3) {
        logger.error('Got an error when getting prefetched timespans. Aborting transaction.');
        logger.error(error3);
        session.abortTransaction();
        dbConnection.closeSession();
        callback('Things went to hell');
        return;
      }
      timespans.sort(compareDates);
      const includedTimespans = getIncludedTimespans(timespan.from, timespan.until, timespans);
      const newTimespan = getNewTimespan(timespan.from, timespan.until, includedTimespans);
      if (news.length !== 0) {
        logger.debug('Inserting news into database.');
        db.collection(articlesCollectionName).insertMany(news, { ordered: false }, (error4, result1) => {
          if (error4) {
            if (error4.writeErrors) {
              if (!error4.writeErrors.every(wError => wError.code === 11000)) {
                logger.error('Got a fatal database error. Aborting transaction and closing session.');
                logger.error(error4.writeErrors);
                session.abortTransaction();
                dbConnection.closeSession();
                callback(error);
                return;
              }
              logger.error('Tried to insert entities into databse which share URL');
            }
          }
          logger.debug(`Should remove timespans: ${JSON.stringify(includedTimespans)}`);
          const query = {
            service,
          };
          const update1 = {
            $pull: { timespans: { $in: includedTimespans } },
          };
          const update2 = {
            $push: { timespans: newTimespan },
          };

          db.collection(prefetchedCollectionName).update(query, update1, { session }, (error1, result2) => {
            if (error1) {
              logger.error(error1);
            } else {
              logger.debug(`Removed old timespans from prefetched collections for service: ${service}, with results: ${JSON.stringify(result2)}`);
            }
            db.collection(prefetchedCollectionName).update(query, update2, { session }, (error2, result3) => {
              if (error2) {
                logger.error(error2);
              } else {
                logger.debug(`Inserted new timespan in prefetched collection for service: ${service}`);
              }
              session.commitTransaction(() => {
                logger.debug('Committed transaction. Closing session.');
                dbConnection.closeSession();
                callback();
              });
            });
          });
        });
      } else {
        logger.debug(`No news for selected timespan: ${timespan}`);
        const query = {
          service,
        };
        const update1 = {
          $pull: { timespans: { $in: includedTimespans } },
        };
        const update2 = {
          $push: { timespans: newTimespan },
        };
        db.collection(prefetchedCollectionName).update(query, update1, { session }, (error1, result2) => {
          if (error1) {
            logger.error(error1);
          } else {
            logger.debug(`Removed old timespans from prefetched collections for service: ${service}`);
          }
          db.collection(prefetchedCollectionName).update(query, update2, { session }, (error2, result3) => {
            if (error2) {
              logger.error(error2);
            } else {
              logger.debug(`Inserted new timespan in prefetched collection for service: ${service}`);
            }
            session.commitTransaction(() => {
              logger.debug('Committed transaction. Closing session.');
              dbConnection.closeSession();
              callback();
            });
          });
        });
      }
    });
  });
}

// Gets all articles for a given service in a given timespan and calls callback on it.
function getArticles(service, from, until, callback) {
  logger.debug('getArticles()');
  if (!service) {
    service = 'svt';
    logger.error('No service provided, defaulting to svt');
  }
  dbConnection.connect((error, client) => {
    if (error) {
      callback(error, null);
    }

    const fromISO = from.toISOString();
    const untilISO = until.toISOString();

    const collectionName = `${config.articles_collection_prefix}${service}`;
    const db = client.db(config.databaseName);
    logger.debug(`Getting articles for service: ${service} and timespan: from: ${fromISO} - until: ${untilISO}`);
    db.collection(collectionName).find({
      $and: [{ datetime: { $gte: fromISO } }, { datetime: { $lte: untilISO } }],
    }, { _id: false }).toArray((data) => {
      logger.debug('Managed to get articles');
      callback(data);
    });
  });
}

function getEntriesPaged(service, from, until, pageNumber = 1, callback = () => {}) {
  logger.debug('getEntriesPaged()');
  dbConnection.connect((error, client) => {
    if (error) {
      return;
    }

    const untilISO = until.toISOString();
    const fromISO = from.toISOString();

    const collectionName = `${process.env.ARTICLES_PREFIX}${service}`;
    const db = client.db(config.databaseName);

    const query = {
      $and: [{ datetime: { $gte: fromISO } }, { datetime: { $lte: untilISO } }],
    };
    const sorter = {
      datetime: 1,
    };
    logger.debug(`Getting article-page #${pageNumber} for service: ${service} and timespan: from: ${fromISO} - until: ${untilISO}`);
    db.collection(collectionName).find(query).sort(sorter).skip(config.pageSize * pageNumber)
      .limit(config.pageSize)
      .toArray()
      .then((page) => {
        logger.debug(`Fetched page #${pageNumber} from database for service: ${service} and timespan: from: ${fromISO} - until: ${untilISO}`);
        callback(page);
      })
      .catch((exception) => {
        logger.error(`Got an error when getting page #${pageNumber} for service: ${service} and timespan: from: ${fromISO} - until: ${untilISO}`);
        logger.error(exception);
        callback();
      });
  });
}

// Returns an array of timespans that are missing to fulfill a requested timespan for a given service and timespans already available.
function computeMissingSpans(service, serviceTimespans, requestFrom, requestUntil) {
  logger.debug('computeMissingTimespans()');
  const missingTimespans = [];
  let tentFrom = new Date(requestFrom);
  const until = new Date(requestUntil);
  let availableTimespans = null;
  if (serviceTimespans) {
    availableTimespans = serviceTimespans.timespans.sort(compareDates);
  } else {
    logger.debug('There are no available timespans');
    availableTimespans = [];
  }
  for (let i = 0; i < availableTimespans.length; i += 1) {
    const currentDateFrom = new Date(availableTimespans[i].from);
    const currentDateUntil = new Date(availableTimespans[i].until);
    if (tentFrom < currentDateFrom) {
      if (until < currentDateFrom) {
        missingTimespans.push({ service, from: tentFrom, until });
        return missingTimespans;
      }
      missingTimespans.push({ service, from: tentFrom, until: new Date(currentDateFrom.setDate(currentDateFrom.getDate() - 1)) });
      if (until <= currentDateUntil) {
        return missingTimespans;
      }
      tentFrom = new Date(currentDateUntil.setDate(currentDateUntil.getDate() + 1));
      continue;
    }
    if (tentFrom >= currentDateFrom) {
      if (tentFrom > currentDateUntil) {
        continue;
      }
      if (until <= currentDateUntil) {
        return missingTimespans;
      }
      tentFrom = new Date(currentDateUntil.setDate(currentDateUntil.getDate() + 1));
    }
  }
  missingTimespans.push({ service, from: tentFrom, until });
  return missingTimespans;
}

// Applies a callback function to the timespans needed to complete a requested resource.
function getMissingTimespans(requestedResource, callback) {
  logger.debug('getMissingTimespans()');
  const { service, from, until } = requestedResource;
  dbConnection.connect((error, client) => {
    if (error) {
      return;
    }
    const db = client.db(config.databaseName);
    const query = {
      service,
    };
    db.collection(config.scraperMetaCollectionName).findOne(query, { _id: false }, (err, results) => {
      if (results === undefined) {
        logger.warn(`No meta-collection entry for service: ${service}`);
        // should create an entry for service
      }
      const needed = computeMissingSpans(service, results, from, until);
      callback(needed);
    });
  });
}

module.exports = {
  getArticles,
  getMissingTimespans,
  fillTimeSpan,
  getEntriesPaged,
};
