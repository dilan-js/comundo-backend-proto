/**
 * @description Salon API Validator
 */

/** Dependencies */
const _ = require("lodash");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

/**
 * @description Add the client's review
 */
const addReview = (req, res, next) => {
  const reqData = _.pick(req.body, ["salonId", "comment", "rating"]);

  // Validate request
  const schema = Joi.object({
    salonId: Joi.objectId().required().label("Salon ID"),
    comment: Joi.string().min(4).max(200).required().label("Review comment"),
    rating: Joi.number()
      .integer()
      .min(0)
      .max(5)
      .required()
      .label("Review rating"),
  });
  const { value, error } = schema.validate(reqData);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  req.reqData = value;
  next();
};

/**
 * @description Get salon details
 */
const getSalonDetails = (req, res, next) => {
  const reqData = _.pick(req.params, ["salonId"]);

  // Validate request
  const schema = Joi.object({
    salonId: Joi.objectId().required().label("Salon ID"),
  });

  const { value, error } = schema.validate(reqData);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  req.reqData = value;
  next();
};

module.exports = {
  addReview,
  getSalonDetails,
};
