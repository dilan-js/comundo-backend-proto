/**
 * @description Define Entering Business Information API Routes
 */

// Appointment API Router
const earningsApiRouter = require("express").Router();

// Validator Middleware
const EarningsApiValidator = require("../../../middlewares/validators/Provider/EarningsApiValidator");

// Controller
const EarningsApiController = require("../../../controllers/Provider/EarningsApiController");

earningsApiRouter.get(
  "/:salonId?",
  EarningsApiValidator.getEarnings,
  EarningsApiController.getEarnings,
);

module.exports = earningsApiRouter;
