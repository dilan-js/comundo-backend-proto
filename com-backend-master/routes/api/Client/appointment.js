/**
 * @description Define Appointment API Routes
 */

// Appointment API Router
const appointmentApiRouter = require("express").Router();

// Validator Middleware
const AppointmentApiValidator = require("../../../middlewares/validators/Client/AppointmentApiValidator");

// Controller
const AppointmentApiController = require("../../../controllers/Client/AppointmentApiController");

const Appointment = require("../../../controllers/Appointment");

appointmentApiRouter.post(
  "/create",
  AppointmentApiValidator.create,
  Appointment.create,
);

appointmentApiRouter.get(
  "/list/all",
  AppointmentApiController.getAllAppts,
);

appointmentApiRouter.get(
  "/details/:apptId",
  AppointmentApiValidator.getApptDetails,
  AppointmentApiController.getApptDetails,
);

module.exports = appointmentApiRouter;
