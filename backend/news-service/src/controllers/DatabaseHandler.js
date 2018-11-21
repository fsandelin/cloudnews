const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = `${process.env.DB_HOST}:${process.env.DB_PORT}`;

const state = {
  db: null,
};

function connect(callback) {
  if (state.db) {
    callback(null, state.db);
    return;
  }

  MongoClient.connect(uri, (err, db) => {
    state.db = db;
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
