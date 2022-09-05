/**
 * @description Define Entering Business Information API Routes
 */

// Appointment API Router
const businessInformationApiRouter = require("express").Router();

// Validator Middleware
const BusinessInformationApiValidator = require("../../../middlewares/validators/Provider/BusinessInformationApiValidator");

// Controller
const BusinessInformationApiController = require("../../../controllers/Provider/BusinessInformationApiController");

businessInformationApiRouter.post(
  "/basicInfo",
  BusinessInformationApiValidator.submitBasicSalonInfo,
  BusinessInformationApiController.submitBasicSalonInfo,
);

businessInformationApiRouter.post(
  "/update/basicInfo",
  BusinessInformationApiValidator.updateBasicSalonInfo,
  BusinessInformationApiController.updateBasicSalonInfo,
);

businessInformationApiRouter.post(
  "/salonTags",
  BusinessInformationApiValidator.submitSalonTags,
  BusinessInformationApiController.submitSalonTags,
);

businessInformationApiRouter.post(
  "/salonPhotos",
  BusinessInformationApiValidator.submitSalonPhotos,
  BusinessInformationApiController.submitSalonPhotos,
);

businessInformationApiRouter.post(
  "/salonEmployees",
  BusinessInformationApiValidator.submitSalonEmployees,
  BusinessInformationApiController.submitSalonEmployees,
);

businessInformationApiRouter.delete(
  "/salonEmployees/:stylistId",
  BusinessInformationApiValidator.deleteSalonEmployees,
  BusinessInformationApiController.deleteSalonEmployees,
);

businessInformationApiRouter.post(
  "/businessHours",
  BusinessInformationApiValidator.submitSalonBusinessHours,
  BusinessInformationApiController.submitSalonBusinessHours,
);

businessInformationApiRouter.get(
  "/getEmployees/:id",
  BusinessInformationApiValidator.getEmployees,
  BusinessInformationApiController.getEmployees,
);

businessInformationApiRouter.post(
  "/service",
  BusinessInformationApiValidator.createService,
  BusinessInformationApiController.submitService,
);

businessInformationApiRouter.put(
  "/service/:serviceId",
  BusinessInformationApiValidator.updateService,
  BusinessInformationApiController.submitService,
);

businessInformationApiRouter.delete(
  "/service/:serviceId",
  BusinessInformationApiValidator.deleteServices,
  BusinessInformationApiController.deleteServices,
);

module.exports = businessInformationApiRouter;
