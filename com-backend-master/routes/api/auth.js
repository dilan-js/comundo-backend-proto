/**
 * @description Define Auth API Routes
 */

// Auth API Router
const authApiRouter = require("express").Router();

// Validator Middleware
const AuthApiValidator = require("../../middlewares/validators/AuthApiValidator");

// Controller
const AuthApiController = require("../../controllers/AuthApiController");

authApiRouter.post(
  "/:role/login/request-sms",
  AuthApiValidator.loginRequestSMS,
  AuthApiController.requestSMS,
);
authApiRouter.post(
  "/:role/login/confirm-sms",
  AuthApiValidator.loginConfirmSMS,
  AuthApiController.loginConfirmSMS,
);
authApiRouter.post(
  "/:role/register/request-sms",
  AuthApiValidator.registerRequestSMS,
  AuthApiController.requestSMS,
);
authApiRouter.post(
  "/:role/register/confirm-sms",
  AuthApiValidator.registerConfirmSMS,
  AuthApiController.registerConfirmSMS,
);

module.exports = authApiRouter;
