/**
 * @description Define Promotion API Routes for Client
 */

// Appointment API Router
const promotionApiRouter = require("express").Router();

// Validator Middleware
const PromotionApiValidator = require("../../../middlewares/validators/Client/PromotionsApiValidator");

// Controller
const PromotionApiController = require("../../../controllers/Client/PromotionApiController");

promotionApiRouter.get(
  "/:salonId?",
  PromotionApiValidator.getAllPromotions,
  PromotionApiController.getAllPromotions,
);

promotionApiRouter.get(
  "/details/:id",
  PromotionApiValidator.getSpecificPromotion,
  PromotionApiController.getSpecificPromotion,
);

module.exports = promotionApiRouter;
