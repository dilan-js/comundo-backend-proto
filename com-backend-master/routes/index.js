/**
 * @description Define Routes
 */

const router = require('express').Router();

const apiRouter = require('./api');

// API Routes
router.use('/api', apiRouter);

module.exports = router;
