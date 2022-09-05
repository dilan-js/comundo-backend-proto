
require('dotenv').config();
const { connect } = require("./database");
const { run } = require('./server');

// Connect to DB
connect(process.env.MONGODB_URI).then(run);
