/**
 * @description Define API Routes
 */

/** Dependencies */
const passport = require("passport");

// Root API Router
const apiRouter = require("express").Router();

// Public API Routes
const authApiRouter = require("./auth");

const appointmentApiRouter = require("./Shared/appointment");
const notificationApiRouter = require("./Shared/notification");
const searchApiRouter = require("./Shared/search");

// For client
const clientRouter = require("./Client");

// For provider
const providerRouter = require("./Provider");

// Add Public API Routes
apiRouter.use("/auth", authApiRouter);

/** Add JWT Middleware */
apiRouter.use(passport.authenticate("jwt-header"));

// Add Authenticate API Routes
// Shared for either client or provider. But not public
apiRouter.use("/appointment", appointmentApiRouter);
apiRouter.use("/notification", notificationApiRouter);
apiRouter.use("/search", searchApiRouter);

// For client
apiRouter.use("/client", clientRouter);

// For provider
apiRouter.use("/provider", providerRouter);

module.exports = apiRouter;
