/**
 * @description Push notification API Validator
 */

/** Dependencies */
const _ = require("lodash");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { ROLES } = require("../../../constants/index.js");

/**
 * @description register a device token
 */
const registerToken = async (req, res, next) => {
  const reqData = _.pick(req.body, ["token", "role", "id"]);

  // Validate request
  const schema = Joi.object({
    token: Joi.string().required().label("FCM token"),
    role: Joi.string()
      .required()
      .valid(ROLES.CUSTOMER, ROLES.OWNER, ROLES.STYLIST)
      .label("Role"),
    id: Joi.objectId().required().label("The signin user's ID"),
  });
  const { value, error } = schema.validate(reqData);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  req.reqData = value;
  next();
};

/**
 * @description Send the push notification
 */
const pushNotification = async (req, res, next) => {
  const reqData = _.pick(req.body, ["tokens", "title", "body", "imageUrl"]);

  // Validate request
  const schema = Joi.object({
    tokens: Joi.array().required().label("FCM tokens"),
    title: Joi.string().required().label("Title"),
    body: Joi.string().required().label("Description"),
    imageUrl: Joi.string().label("Image url"),
  });
  const { value, error } = schema.validate(reqData);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  req.reqData = value;
  next();
};

module.exports = {
  registerToken,
  pushNotification,
};
