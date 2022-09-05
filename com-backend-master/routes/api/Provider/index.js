// Root API Router
const providerRouter = require("express").Router();

// Import API Middleware
const { isProvider, isOwner } = require("../../../middlewares/ApiMiddleware");

// Authenticate API Routes
// For client
const businessInformationApiRouter = require("./businessInformation");
const providerPromotionApiRouter = require("./promotion");
const providerAppointmentApiRouter = require("./appointment");
const providerEarningsApiRouter = require("./earnings");
const providerStylistApiRouter = require("./stylist");

const BusinessInformationApiValidator = require("../../../middlewares/validators/Provider/BusinessInformationApiValidator");
const BusinessInformationApiController = require("../../../controllers/Provider/BusinessInformationApiController");

// Both owner and stylist
providerRouter.use(isProvider);

providerRouter.use("/appointment", providerAppointmentApiRouter);
providerRouter.use("/earnings", providerEarningsApiRouter);

providerRouter.get(
  "/businessInformation/getProfile/:id",
  BusinessInformationApiValidator.getProfile,
  BusinessInformationApiController.getProfile,
);

// Owner only
providerRouter.use(isOwner);

providerRouter.use("/businessInformation", businessInformationApiRouter);
providerRouter.use("/promotion", providerPromotionApiRouter);
providerRouter.use("/stylist", providerStylistApiRouter);

module.exports = providerRouter;
