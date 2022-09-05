/**
 * @description Define stylist API Routes
 */

// Stylist API Router
const stylistApiRouter = require("express").Router();

// Controller
const StylistApiController = require("../../../controllers/Provider/StylistApiController");

stylistApiRouter.get(
  "/list/all",
  StylistApiController.getAll,
);

module.exports = stylistApiRouter;
