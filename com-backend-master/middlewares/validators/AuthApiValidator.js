/**
 * @description Auth Api Validator
 */

/** Dependencies */
const _ = require("lodash");
const Joi = require("joi");

const { Client, Owner, Stylist } = require("../../database/models");
const { ROLES_MAP } = require("../../constants/index.js");
const { $t, KEYS } = require("../../utils/locale");
const { phoneNumberSchema } = require("../../utils/schema");

const validate = async (req, res, fields = {}) => {
  const { role } = req.params;
  if (!Object.prototype.hasOwnProperty.call(ROLES_MAP, role)) {
    return {
      error: res.status(401).send($t(req.locale, KEYS.UNAUTHORIZED)),
    };
  }
  const reqData = _.pick(req.body, ["phoneNumber", ...Object.keys(fields)]);

  // Validate request
  const schema = Joi.object({
    phoneNumber: phoneNumberSchema,
    ...fields,
  });
  const { value, error } = schema.validate(reqData);

  if (error) {
    return {
      error: res.status(422).json({ message: error.details[0].message }),
    };
  }

  // Check users existence
  const filter = {
    "phoneNumber.formatted": value.phoneNumber.formatted,
    deleted: { $ne: true },
  };

  if (role === "client") {
    const client = await Client.findOne(filter);
    return { client, role, value };
  }
  if (role === "owner") {
    const owner = await Owner.findOne(filter);
    return { owner, role, value };
  }
  if (role === "stylist") {
    const stylist = await Stylist.findOne(filter);
    return { stylist, role, value };
  }

  return {
    error: res.status(422).json({ message: `Uknown role ${role}` }),
  };
};

const loginRequestSMS = async (req, res, next) => {
  const { value, error, client, owner, stylist } = await validate(req, res);

  if (error) {
    return error;
  }
  if (!(client || owner || stylist)) {
    return res
      .status(401)
      .json({ message: $t(req.locale, KEYS.NO_PHONE) });
  }

  req.reqData = value;
  next();
};

const loginConfirmSMS = async (req, res, next) => {
  const { value, error, client, owner, stylist } = await validate(req, res, {
    code: Joi.string().required().min(6).max(6).label("Code"),
  });
  if (error) {
    return error;
  }
  if (!(client || owner || stylist)) {
    return res
      .status(401)
      .json({ message: $t(req.locale, KEYS.NO_PHONE) });
  }

  req.reqData = value;
  req.client = client;
  req.owner = owner;
  req.stylist = stylist;
  next();
};

const validatePhoneInUse = (user, req, res) => {
  const { client, owner, stylist, role } = user;

  if (
    (client && role === "client") ||
    (owner && role === "owner") ||
    (stylist && role === "stylist")
  ) {
    return res.status(401).json({ message: $t(req.locale, KEYS.PHONE_IN_USE) });
  }
};

const registerRequestSMS = async (req, res, next) => {
  const { role } = req.params;

  if (role === "stylist") {
    return res.status(403).send($t(req.locale, KEYS.FORBIDDEN));
  }

  const { value, error, ...user } = await validate(req, res);

  if (error) {
    return error;
  }

  const isPhoneInUse = validatePhoneInUse(user, req, res);
  if (isPhoneInUse) {
    return;
  }

  req.reqData = value;
  next();
};

const registerConfirmSMS = async (req, res, next) => {
  const { role } = req.params;
  if (role === "stylist") {
    return res.status(403).send($t(req.locale, KEYS.FORBIDDEN));
  }

  const firstName = Joi.string().required().label("First Name");
  const lastName = Joi.string().required().label("Last Name");
  let requiredFields = {
    firstName,
    lastName,
  };

  const { value, error, ...user } = await validate(req, res, {
    code: Joi.string().required().min(6).max(6).label("Code"),
    ...requiredFields,
  });

  if (error) {
    return error;
  }

  const isPhoneInUse = validatePhoneInUse(user, req, res);
  if (isPhoneInUse) {
    return;
  }

  req.reqData = value;
  next();
};

module.exports = {
  loginRequestSMS,
  loginConfirmSMS,
  registerRequestSMS,
  registerConfirmSMS,
};
