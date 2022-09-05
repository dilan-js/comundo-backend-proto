// Root API Router
const searchApiRouter = require("express").Router();

// Controller
const SalonApiController = require("../../../controllers/Client/SalonApiController");
const ServiceApiController = require("../../../controllers/Client/ServiceApiController");

searchApiRouter.get(
  "/salon",
  SalonApiController.searchSalons,
);

searchApiRouter.get(
  "/service",
  ServiceApiController.search,
);

module.exports = searchApiRouter;
