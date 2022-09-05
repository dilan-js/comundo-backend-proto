/**
 * @description Define Promotion API Routes for Provider
 */

// Appointment API Router
const promotionApiRouter = require("express").Router();

// Validator Middleware
const PromotionApiValidator = require("../../../middlewares/validators/Provider/PromotionsApiValidator");

// Controller
const PromotionApiController = require("../../../controllers/Provider/PromotionApiController");

promotionApiRouter.post(
  "/",
  PromotionApiValidator.createPromotion,
  PromotionApiController.createPromotion,
);

promotionApiRouter.get(
  "/getAllPromotions/:id",
  PromotionApiValidator.getAllPromotions,
  PromotionApiController.getAllPromotions,
);

promotionApiRouter.post(
  "/deletePromotion/:id",
  PromotionApiValidator.deletePromotion,
  PromotionApiController.deletePromotion,
);

module.exports = promotionApiRouter;
