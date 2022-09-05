const mongoose = require('mongoose');
const models = require('./models');

/**
 * The default options fix all deprecation warnings in MongoDB Node.js driver.
 * For more details, visit https://mongoosejs.com/docs/deprecations.html
 */
const defaultOptions = {
  useFindAndModify: false,
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

/**
 * Opens the default mongoose connection.
 *
 * @param {string} url - MongoDB connection string
 * @returns {Promise} mongose connection Promise
 */
const connect = url => {
  return mongoose.connect(url, {
    ...defaultOptions,
  }).then((db) => {
    process.on('SIGTERM', db.disconnect);

    console.log("Connected to DB");
    return db;
  });
};

module.exports = {
  connect,
  models,
};
