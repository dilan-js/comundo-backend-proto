const { stop } = require('./server');

module.exports = async () => {
  // TODO gracefull clean test DB
  await stop();
};
