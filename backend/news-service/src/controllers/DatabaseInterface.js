const dbConnection = require('./DatabaseHandler');
require('dotenv').config();

const dbName = process.env.DATABASE_NAME;

const scraperMetaCollection = 'prefetched';

function compareDates(a, b) {
  const dA = new Date(a.from);
  const dB = new Date(b.from);
  if (dA < dB) {
    return -1;
  }
  if (dA > dB) {
    return 1;
  }
  return 0;
}

function getNextDay(date) {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  return nextDay;
}

function getPreviousDay(date) {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() - 1);
  return nextDay;
}

function getIncludedTimespans(newFrom, newUntil, timespans) {
  let tentFrom = null;
  let tentUntil = null;
  let placedFrom = false;
  const includedTimespans = [];
  for (let i = 0; i < timespans.length; i += 1) {
    tentFrom = new Date(timespans[i].from);
    tentUntil = new Date(timespans[i].until);
    if (!placedFrom) {
      if (newFrom > getNextDay(tentUntil)) {
        continue;
      } else {
        placedFrom = true;
      }
    }
    if (placedFrom) {
      if (newUntil < getPreviousDay(tentFrom)) {
        break;
      }
      includedTimespans.push(timespans[i]);
    }
  }
  return includedTimespans;
}

function getNewTimespan(inputFrom, inputUntil, timespans) {
  if (timespans.length === 0) return { from: inputFrom, until: inputUntil };
  const includedTimespans = getIncludedTimespans(inputFrom, inputUntil, timespans);
  const firstFrom = new Date(timespans[0].from);
  const lastUntil = new Date(timespans[timespans.length - 1].until);

  let newFrom = null;
  let newUntil = null;

  if (firstFrom < inputFrom) {
    newFrom = firstFrom;
  } else {
    newFrom = inputFrom;
  }

  if (lastUntil > inputUntil) {
    newUntil = lastUntil;
  } else {
    newUntil = inputUntil;
  }

  return { from: newFrom, until: newUntil };
}

function fillTimeSpan(service, news, timespan, callback, retries = 5) {
  // Todo
  const prefetchedCollectionName = 'prefetched';
  const articlesCollectionName = `articles_${service}`;
  const newFrom = new Date(timespan.from);
  const newUntil = new Date(timespan.until);
  dbConnection.connect((error, client) => {
    if (error) {
      console.log(error);
    }
    const session = dbConnection.getSession();
    const db = client.db(dbName);
    try {
      session.startTransaction();
    } catch (mongoError) {
      if (retries) {
        console.log('Retrying!!!');
        setTimeout(() => fillTimeSpan(service, news, timespan, callback, retries - 1), 3000);
        return;
      }
    }

    db.collection(prefetchedCollectionName).findOne({ service }, { session }, (error3, result) => {
      let timespans = null;
      try {
        timespans = result.timespans;
      } catch (e) {
        timespans = [];
      }
      if (error3) {
        console.log('Got an error when trying to get timespans for service');
        console.log('ABORTING TRANSACTION');
        session.abortTransaction();
        dbConnection.closeSession();
        callback('Things went to hell');
        return;
      }
      timespans.sort(compareDates);

      const includedTimespans = getIncludedTimespans(newFrom, newUntil, timespans);
      const newTimespan = getNewTimespan(newFrom, newUntil, includedTimespans);
      console.log('news');
      console.log(news);
      if (news.length !== 0) {
        db.collection(articlesCollectionName).insertMany(news, { ordered: false }, (error4, result1) => {
          if (error4) {
            if (error4.writeErrors) {
              if (!error4.writeErrors.every(wError => wError.code === 11000)) {
                session.abortTransaction();
                dbConnection.closeSession();
                callback(error);
                return;
              }
            }
          }
          const query = {
            service,
          };
          const update1 = {
            $pull: { timespans: { $in: includedTimespans } },
          };
          const update2 = {
            $push: { timespans: newTimespan },
          };
          setTimeout(() => {
            db.collection(prefetchedCollectionName).update(query, update1, { session }, (error1, result2) => {
              db.collection(prefetchedCollectionName).update(query, update2, { session }, (error2, result3) => {
                session.commitTransaction(() => {
                  dbConnection.closeSession();
                  callback();
                });
              });
            });
          }, 1000); // Added timeout only to test concurrency-things for this transaction
        });
      } else {
        const query = {
          service,
        };
        const update1 = {
          $pull: { timespans: { $in: includedTimespans } },
        };
        const update2 = {
          $push: { timespans: newTimespan },
        };
        setTimeout(() => {
          db.collection(prefetchedCollectionName).update(query, update1, { session }, (error1, result2) => {
            db.collection(prefetchedCollectionName).update(query, update2, { session }, (error2, result3) => {
              session.commitTransaction(() => {
                dbConnection.closeSession();
                callback();
              });
            });
          });
        }, 1000);
      }
    });
  });
}

// Pushes an array of articles to the database. Right now uses articles_${service} as collection for all. DOES NO DATACHECK WHATSOEVER
function pushArticles(service, articles, callback) {
  dbConnection.connect((error, client) => {
    if (error) {
      console.log('Got an error in dbconnection.connect');
      callback(error);
      return;
    }
    const db = client.db(dbName);
    const collectionName = `${process.env.ARTICLES_PREFIX}${service}`;
    db.listCollections({}, { nameOnly: true }).toArray((error, docs) => {
      if (docs.indexOf(collectionName) > -1) {
        db.collection(collectionName).insertMany(articles, (err, res) => {
          if (err) {
            console.log('Got an error in insertMany 1');
            callback(error);
            return;
          }
          console.log(`Articles added to database collection ${collectionName}`);
          console.log(articles);
          callback();
        });
      } else {
        db.createCollection(collectionName, {}, (err, collection) => {
          collection.createIndex({ url: 1 }, { unique: true });
          collection.insertMany(articles, (errr, res) => {
            if (err) {
              console.log('Got an error in insertMany 2');
              callback(error);
            } else {
              console.log(`Articles added to database collection ${collectionName}`);
              console.log(articles);
              callback();
            }
          });
        });
      }
    });
  });
}

// Gets all articles for a given service in a given timespan and calls callback on it.
function getArticles(service, from_, until_, callback) {
  if (!service) service = 'svt';
  dbConnection.connect((error, client) => {
    if (error) {
      callback(error, null);
    }

    from_ = from_.replace(' ', '+');
    until_ = until_.replace(' ', '+');

    const from = new Date(from_);
    const until = new Date(until_);

    until.setHours(23, 59, 59, 999);
    from_ = from.toISOString();
    until_ = until.toISOString();

    const collectionName = `${process.env.ARTICLES_PREFIX}${service}`;
    const db = client.db(dbName);
    db.collection(collectionName).find({
      $and: [{ datetime: { $gte: from_ } }, { datetime: { $lte: until_ } }],
    }).toArray(callback);
  });
}

// Returns an array of timespans that are missing to fulfill a requested timespan for a given service and timespans already available.
function computeMissingSpans(service, serviceTimespans, requestFrom, requestUntil) {
  const missingTimespans = [];
  let tentFrom = new Date(requestFrom);
  const until = new Date(requestUntil);
  let availableTimespans = null;
  if (serviceTimespans) {
    availableTimespans = serviceTimespans.timespans.sort(compareDates);
  } else {
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
  const { service, from, until } = requestedResource;
  dbConnection.connect((error, client) => {
    const db = client.db(dbName);
    const query = {
      service,
    };
    db.collection(scraperMetaCollection).findOne(query, (err, results) => {
      if (results === undefined) {
        // should create an entry for service
      }
      const needed = computeMissingSpans(service, results, from, until);
      callback(needed);
    });
  });
}

module.exports = {
  pushArticles,
  getArticles,
  getMissingTimespans,
  fillTimeSpan,
};
