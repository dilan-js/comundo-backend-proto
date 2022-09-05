/**
 * @description Define Appointment API Routes
 */

// Appointment API Router
const appointmentApiRouter = require("express").Router();

// Validator Middleware
const AppointmentApiValidator = require("../../../middlewares/validators/Provider/AppointmentApiValidator");

// Controller
const AppointmentApiController = require("../../../controllers/Provider/AppointmentApiController");

const Appointment = require("../../../controllers/Appointment");

appointmentApiRouter.post(
  "/create",
  AppointmentApiValidator.create,
  Appointment.create,
);

appointmentApiRouter.get("/list/all", AppointmentApiController.getAllAppts);

appointmentApiRouter.get(
  "/list/daily/:date",
  AppointmentApiValidator.getByDate,
  AppointmentApiController.getByDate,
);

appointmentApiRouter.get(
  "/list/weekly/:date",
  AppointmentApiValidator.getByDate,
  AppointmentApiController.getWeekly,
);

appointmentApiRouter.get(
  "/list/monthly/:date",
  AppointmentApiValidator.getByDate,
  AppointmentApiController.getMonthly,
);

appointmentApiRouter.get(
  "/details/:apptId",
  AppointmentApiValidator.getApptDetails,
  AppointmentApiController.getApptDetails,
);

module.exports = appointmentApiRouter;
