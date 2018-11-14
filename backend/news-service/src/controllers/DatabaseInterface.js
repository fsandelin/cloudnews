const dbConnection = require('./DatabaseHandler');

const dbName = 'cloudnews_test';
const collectionName = 'articles_svt';

// Pushes an array of articles to the database
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

module.exports = {
  pushArticles,
};
