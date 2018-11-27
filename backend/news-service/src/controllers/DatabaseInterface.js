const dbConnection = require('./DatabaseHandler');
require('dotenv').config();

const dbName = process.env.DATABASE_NAME;

const scraperMetaCollection = 'prefetched';

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
function getArticles(service, from, until, callback) {
  if (!service) service = 'svt';
  dbConnection.connect((error, client) => {
    if (error) {
      callback(error, null);
    }
    from = from.replace(' ', '+');
    until = until.replace(' ', '+');
    const collectionName = `${process.env.ARTICLES_PREFIX}${service}`;
    const db = client.db(dbName);
    db.collection(collectionName).find({
      $and: [{ datetime: { $gte: from } }, { datetime: { $lte: until } }],
    }).toArray(callback);
  });
}

// Returns an array of timespans that are missing to fulfill a requested timespan for a given service and timespans already available.
function computeMissingSpans(service, availableSpans, requestFrom, requestUntil) {
  const missingSpans = [];
  let tentFrom = new Date(requestFrom);
  const until = new Date(requestUntil);
  for (let i = 0; i < availableSpans.length; i += 1) {
    const currentDateFrom = new Date(availableSpans[i].from);
    const currentDateUntil = new Date(availableSpans[i].until);
    if (tentFrom < currentDateFrom) {
      if (until < currentDateFrom) {
        missingSpans.push({ service, from: tentFrom, until });
        return missingSpans;
      }
      missingSpans.push({ service, from: tentFrom, until: new Date(currentDateFrom.setDate(currentDateFrom.getDate() - 1)) });
      if (until <= currentDateUntil) {
        return missingSpans;
      }
      tentFrom = new Date(currentDateUntil.setDate(currentDateUntil.getDate() + 1));
      continue;
    }
    if (tentFrom >= currentDateFrom) {
      if (tentFrom > currentDateUntil) {
        continue;
      }
      if (until <= currentDateUntil) {
        return missingSpans;
      }
      tentFrom = new Date(currentDateUntil.setDate(currentDateUntil.getDate() + 1));
    }
  }
  missingSpans.push({ service, from: tentFrom, until });
  return missingSpans;
}

// Applies a callback function to the timespans needed to complete a requested resource.
function getMissingTimespans(requestedResource, callback) {
  const { service, from, until } = requestedResource;
  dbConnection.connect((error, client) => {
    const db = client.db(dbName);
    const query = {
      service,
    };
    db.collection(scraperMetaCollection).find(query).sort({ from: 1 }).toArray((err, results) => {
      const needed = computeMissingSpans(service, results, from, until);
      callback(needed);
    });
  });
}

module.exports = {
  pushArticles,
  getArticles,
  getMissingTimespans,
};
