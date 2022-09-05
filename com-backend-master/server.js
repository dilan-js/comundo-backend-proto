/**
 * @description Http Server
 */

/** Dependencies */
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const locale = require("locale");
const PassportMiddleware = require("./middlewares/PassportMiddleware");

const supported = ["en", "es"];

const router = require("./routes");

let server;
let app;
let DB;

const initApp = () => {

  /** Instantiate Server */
  app = express();

  /** Core Middlewares */
  app.use(cors());
  app.use(
    bodyParser.json({
      limit: process.env.MAXIMUM_FILE_SIZE_LIMIT,
    }),
  );
  app.use(
    bodyParser.urlencoded({
      limit: process.env.MAXIMUM_FILE_SIZE_LIMIT,
      parameterLimit: 100000,
      extended: true,
    }),
  );

  /** Passport Middleware Initialization */
  PassportMiddleware.initialize(app);

  app.use(locale(supported));

  app.use(router);
};

const run = (db) => new Promise((resolve) => {
  initApp();

  DB = db;
  /** Start Http Server */
  const port = process.env.PORT || 3000;

  server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    resolve();
  });
});

const stop = () => new Promise((done) => {
  DB.disconnect().then(() => {
    server.close(done);
    DB = null;
    app = null;
    server = null;
    console.log('Done!');
  });
});

module.exports = {
  run,
  stop,
};
