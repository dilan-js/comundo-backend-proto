/**
 * @description Define Promotion API Routes
 */

// Appointment API Router
const profileApiRouter = require("express").Router();

// Validator Middleware
const ProfileApiValidator = require("../../../middlewares/validators/Client/ProfileApiValidator");

// Controller
const ProfileApiController = require("../../../controllers/Client/ProfileAPIController");

profileApiRouter.get(
  "/:id",
  ProfileApiValidator.getProfile,
  ProfileApiController.getProfile,
);

profileApiRouter.put(
  "/update/:id/",
  ProfileApiValidator.updateProfile,
  ProfileApiController.updateProfile,
);

module.exports = profileApiRouter;
