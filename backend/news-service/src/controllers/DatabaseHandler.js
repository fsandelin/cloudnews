const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = `${process.env.DB_HOST}:${process.env.DB_PORT}`;

const state = {
  db: null,
};

function connect(callback) {
  if (state.db) {
    console.log('state.db already exists, returning callback');
    callback(null, state.db);
    return;
  }

  MongoClient.connect(uri, (err, db) => {
    state.db = db;
    console.log('Has successfully connected to db and set state.db to the connection. ');
    callback(err, db);
  });
}

function close(callback) {
  if (state.db) {
    state.db.close((error, result) => {
      state.db = null;
      return callback(error);
    });
  }
}

module.exports = {
  connect,
  close,
};
