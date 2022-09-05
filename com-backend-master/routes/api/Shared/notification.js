/**
 * @description Define Push notification API Routes
 */

// Push notification API Router
const notificationApiRouter = require("express").Router();

// Validator Middleware
const NotificationApiValidator = require("../../../middlewares/validators/Shared/NotificationApiValidator");

// Controller
const NotificationApiController = require("../../../controllers/Shared/NotificationApiController");

notificationApiRouter.post(
  "/register",
  NotificationApiValidator.registerToken,
  NotificationApiController.registerToken
);

notificationApiRouter.post(
  "/send",
  NotificationApiValidator.pushNotification,
  NotificationApiController.pushNotification
);

module.exports = notificationApiRouter;
