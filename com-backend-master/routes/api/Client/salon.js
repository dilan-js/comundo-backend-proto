/**
 * @description Define Salon API Routes
 */

// Salon API Router
const salonApiRouter = require("express").Router();

// Validator Middleware
const SalonApiValidator = require("../../../middlewares/validators/Client/SalonApiValidator");

// Controller
const SalonApiController = require("../../../controllers/Client/SalonApiController");

salonApiRouter.get(
  "/list",
  SalonApiController.getAllSalons,
);

salonApiRouter.get(
  "/details/:salonId",
  SalonApiValidator.getSalonDetails,
  SalonApiController.getSalonDetails,
);

salonApiRouter.post(
  "/review",
  SalonApiValidator.addReview,
  SalonApiController.addReview,
);

module.exports = salonApiRouter;
