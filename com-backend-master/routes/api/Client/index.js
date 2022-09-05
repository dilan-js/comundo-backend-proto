// Root API Router
const clientRouter = require("express").Router();

// Import API Middleware
const { isCustomer } = require("../../../middlewares/ApiMiddleware");

// Authenticate API Routes
// For client
const clientAppointmentApiRouter = require("./appointment");
const salonApiRouter = require("./salon");
const clientPromotionApiRouter = require("./promotion");
const clientProfileApiRouter = require("./profile");

clientRouter.use(isCustomer);

clientRouter.use("/appointment", clientAppointmentApiRouter);
clientRouter.use("/promotion", clientPromotionApiRouter);
clientRouter.use("/profile", clientProfileApiRouter);
clientRouter.use("/salon", salonApiRouter);

module.exports = clientRouter;
