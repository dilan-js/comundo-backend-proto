const { connect } = require('./database');
const { run } = require('./server');

if (!/test/.test(process.env.MONGODB_URI)) {
  throw new Error(`It is not safe to run tests on ${process.env.MONGODB_URI} database. Use 'test' in a db name`);
}

module.exports = async () => {
  await connect(process.env.MONGODB_URI).then(run);
};
