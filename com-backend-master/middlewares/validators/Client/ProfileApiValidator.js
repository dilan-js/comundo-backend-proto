/**
 * @description Profile API Validator
 */

/** Dependencies */
const _ = require("lodash");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const { Client } = require("../../../database/models");
const { $t, KEYS } = require("../../../utils/locale");
const { phoneNumberSchema } = require("../../../utils/schema.js");

const checkClient = async (formattedPhone) => {
  const filter = {
    "phoneNumber.formatted": formattedPhone,
  };

  const client = await Client.findOne(filter, { _id: 1 });
  return { client };
};

/**
 * @description Get profile
 */
const getProfile = (req, res, next) => {
  const reqData = _.pick(req.params, ["id"]);
  // Validate request
  const schema = Joi.object({
    id: Joi.objectId().required().label("Client ID"),
  });
  const { value, error } = schema.validate(reqData);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  req.reqData = value;
  next();
};

/**
 * @description Update profile
 */
const updateProfile = async (req, res, next) => {
  const { id } = req.params;
  const reqData = _.pick(req.body, ["firstName", "lastName", "phoneNumber", "photo"]);
  reqData.id = id;

  // Validate request
  const schema = Joi.object({
    id: Joi.string().required().label("Client ID"),
    firstName: Joi.string().required().label("Client's first name"),
    lastName: Joi.string().required().label("Client's last name"),
    phoneNumber: phoneNumberSchema,
    photo: Joi.string().label("Photo"),
  });
  const { value, error } = schema.validate(reqData);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  const { client } = await checkClient(value.phoneNumber.formatted);

  if (client && client._id.toString() !== id.toString()) {
    return res
      .status(401)
      .json({ message: $t(req.locale, KEYS.PHONE_IN_USE) });
  }

  req.reqData = value;
  next();
};

module.exports = {
  getProfile,
  updateProfile,
};
