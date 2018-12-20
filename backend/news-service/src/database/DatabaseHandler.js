const MongoClient = require('mongodb').MongoClient;
const logger = require('../logger');
require('dotenv').config();

const uri = `${process.env.OS === 'Windows_NT' ? process.env.DB_HOST_WINDOWS : process.env.DB_HOST}:${process.env.DB_PORT}/cloudnews?replicaSet=rs`;

const state = {
  db: null,
  session: null,
};

function connect(callback) {
  if (state.db) {
    return callback(null, state.db);
  }
  logger.debug('Establishing connection with MongoDB');
  MongoClient.connect(uri, (err, db) => {
    if (err) logger.error(err);
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
    logger.debug('Closing connection to MongoDB');
    state.db.close((error, result) => {
      if (error) {
        logger.error(error);
        state.db = null;
        return callback();
      }
    });
  }
}

module.exports = {
  connect,
  close,
  getSession,
  closeSession,
};
