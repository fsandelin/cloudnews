const dbConnection = require('./DatabaseHandler');
require('dotenv').config();

const dbName = process.env.DATABASE_NAME;
const collectionName = `${process.env.ARTICLES_PREFIX}svt`;
const scraperMetaCollection = 'prefetched';

// Pushes an array of articles to the database. Right now uses 'articles_svt' as collection for all.
function pushArticles(articles, callback) {
  dbConnection.connect((error, client) => {
    if (error) {
      console.log('Got an error in dbconnection.connect');
      callback(error);
      return;
    }
    const db = client.db(dbName);
    db.collection(collectionName).insertMany(articles, (err, res) => {
      if (err) {
        console.log('Got an error in insertMany');
        callback(error);
        return;
      }
      console.log('Articles added to database!');
      console.log(articles);
      callback();
    });
  });
}

function getTimeSpan(from, until, callback) {
  dbConnection.connect((error, client) => {
    if (error) {
      console.log('Got an error in dbConnection.connect');
      callback(error, null);
    }
    from = from.replace(' ', '+');
    until = until.replace(' ', '+');
    const db = client.db(dbName);
    db.collection(collectionName).find({
      $and: [{ datetime: { $gte: from } }, { datetime: { $lte: until } }],
    }).toArray(callback);
  });
}

function getNeededSpans(service, availableSpans, requestFrom, requestUntil) {
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

function checkCompletion(requestedResource, callback) {
  const { service, from, until } = requestedResource;
  dbConnection.connect((error, client) => {
    const db = client.db(dbName);
    const query = {
      service,
    };
    db.collection(scraperMetaCollection).find(query).toArray((err, results) => {
      const needed = getNeededSpans(service, results, from, until);
      callback(needed);
    });
  });
}

module.exports = {
  pushArticles,
  getTimeSpan,
  checkCompletion,
};
