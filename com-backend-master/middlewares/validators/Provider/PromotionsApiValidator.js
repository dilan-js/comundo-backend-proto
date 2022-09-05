/**
 * @description Promotions API Validator
 */

/** Dependencies */
const _ = require("lodash");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

/**
 * @description Create a promostion
 */
const createPromotion = (req, res, next) => {
  const reqData = _.pick(req.body, [
    "id",
    "photos",
    "promotionTitle",
    "promotionDescription",
    "promotionNewPrice",
    "promotionOldPrice",
    "discount",
  ]);

  // Validate request
  const schema = Joi.object({
    id: Joi.objectId().required().label("Salon ID"),
    photos: Joi.array().label("Photos"),
    promotionTitle: Joi.string().required().label("Promotion title"),
    promotionDescription: Joi.string().label("Promotion description"),
    promotionNewPrice: Joi.number().label("Promotion new price"),
    promotionOldPrice: Joi.number().label("Promotion old price"),
    discount: Joi.number().label("Discount"),
  });
  const { value, error } = schema.validate(reqData);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  req.reqData = value;

  next();
};

/**
 * @description Get All Promotions
 */
const getAllPromotions = (req, res, next) => {
  const reqData = _.pick(req.params, ["id"]);

  // Validate request
  const schema = Joi.object({
    id: Joi.objectId().required().label("Provider ID"),
  });
  const { value, error } = schema.validate(reqData);

  if (error) {
    console.log(error);
    return res.status(422).json({ message: error.details[0].message });
  }

  req.reqData = value;

  next();
};

/**
 * @description Delete Specific Promotion
 */
const deletePromotion = (req, res, next) => {
  const reqId = _.pick(req.params, ["id"]);
  // const reqData = _.pick(req.body, ["promotionId"]);
  // console.log(req.body);
  // //   console.log({ reqData });
  // //   // Validate request
  // const schema = Joi.object({
  //   id: Joi.objectId().required().label("Promotion ID"),
  // });
  // const { value, error } = schema.validate(reqId);

  // if (error) {
  //   console.log(error);
  //   return res.status(422).json({ message: error.details[0].message });
  // }

  // req.reqId = value;
  // req.reqData = reqData;
  req.reqId = reqId;
  req.reqData = req.body;
  next();
};

module.exports = {
  createPromotion,
  getAllPromotions,
  deletePromotion,
};
