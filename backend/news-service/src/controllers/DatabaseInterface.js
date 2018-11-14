const dbConnection = require('./DatabaseHandler');
require('dotenv').config();

const dbName = process.env.DATABASE_NAME;
const collectionName = `${process.env.ARTICLES_PREFIX}svt`;

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

module.exports = {
  pushArticles,
  getTimeSpan,
};
