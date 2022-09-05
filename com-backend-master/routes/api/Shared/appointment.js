/**
 * @description Define Appointment API Routes
 */

// Appointment API Router
const appointmentApiRouter = require("express").Router();

// Validator Middleware
const AppointmentApiValidator = require("../../../middlewares/validators/Shared/AppointmentApiValidator");

// Controller
const SlotsApiController = require("../../../controllers/Appointment/SlotsApiController");
const AppointmentApiController = require("../../../controllers/Shared/AppointmentApiController");

appointmentApiRouter.post(
  "/slots/:salonId",
  AppointmentApiValidator.getSlots,
  SlotsApiController.getSlots,
);

appointmentApiRouter.post(
  "/update/:status/:apptId",
  AppointmentApiValidator.cancelConfirmAppt,
  AppointmentApiController.cancelConfirmAppt,
);

module.exports = appointmentApiRouter;
