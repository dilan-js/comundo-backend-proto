/**
 * @description Promotions API Validator
 */

/** Dependencies */
const _ = require("lodash");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

/**
 * @description Get all promotions
 */
const getAllPromotions = (req, res, next) => {
  const reqData = _.pick(req.params, ["salonId"]);

  // Validate request
  const schema = Joi.object({
    salonId: Joi.objectId().label("Salon ID"),
  });
  const { value, error } = schema.validate(reqData);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }
  req.reqData = value;
  next();
};

/**
 * @description Get specific promotion
 */
const getSpecificPromotion = (req, res, next) => {
  const reqData = _.pick(req.params, ["id"]);

  // Validate request
  const schema = Joi.object({
    id: Joi.objectId().required().label("Promotion ID"),
  });
  const { value, error } = schema.validate(reqData);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  req.reqData = value;
  next();
};

module.exports = {
  getAllPromotions,
  getSpecificPromotion,
};
