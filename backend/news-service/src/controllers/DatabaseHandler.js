const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = `${process.env.DB_HOST}:${process.env.DB_PORT}/cloudnews?replicaSet=rs`;

const state = {
  db: null,
  session: null,
};

function connect(callback) {
  if (state.db) {
    return callback(null, state.db);
  }

  MongoClient.connect(uri, (err, db) => {
    state.db = db;
    return callback(err, db);
  });
}

function getSession() {
  if (state.db) {
    if (state.session) return state.session;

    state.session = state.db.startSession();
    return state.session;
  }
  return connect(getSession);
}

function closeSession() {
  if (state.sesssion) state.session.endSession((state.session = null));
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
  getSession,
  closeSession,
};
