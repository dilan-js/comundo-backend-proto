/**
 * @description Appointment API Validator
 */

/** Dependencies */
const _ = require("lodash");
const { Client, Salon, Service, Stylist } = require("../../../database/models");
const Joi = require("joi").extend(require("@joi/date"));
Joi.objectId = require("joi-objectid")(Joi);

const { $t, KEYS } = require("../../../utils/locale");
const { ROLES } = require("../../../constants");
const {
  formatted,
  nonFormatted,
  phoneNumberSchema,
} = require("../../../utils/schema");

const create = async (req, res, next) => {
  const { user } = req;
  const reqData = _.pick(req.body, [
    "clientId",
    "firstName",
    "lastName",
    "phoneFormatted",
    "phoneNonFormatted",
    "salonId",
    "serviceId",
    "stylistId",
    "startTime",
  ]);

  // Validate request
  const schema = Joi.object({
    clientId: Joi.objectId().label("Client ID"),
    firstName: Joi.string().label("First Name"),
    lastName: Joi.string().label("Last Name"),
    phoneFormatted: formatted,
    phoneNonFormatted: nonFormatted,
    phoneNumberSchema,
    serviceId: Joi.objectId().required().label("Service ID"),
    startTime: Joi.date().iso().required().label("Start time"),
    ...(user.role === ROLES.OWNER
      ? {
        salonId: Joi.objectId().label("Salon ID"),
        stylistId: Joi.objectId().label("Stylist ID"),
      }
      : {}),
  });
  const { value, error } = schema.validate(reqData);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  if (value.startTime.getTime() < Date.now()) {
    return res
      .status(422)
      .json({ message: $t(req.locale, KEYS.NO_BOOK_IN_PAST) });
  }

  let salonId, stylist;
  if (user.role === ROLES.OWNER) {
    if (!value.salonId) {
      return res
        .status(422)
        .json({ message: $t(req.locale, KEYS.SALON_ID_REQUIRED) });
    }
    if (!value.stylistId) {
      return res
        .status(422)
        .json({ message: $t(req.locale, KEYS.STYLIST_ID_REQUIRED) });
    }
    if (user.salonIDs.includes(value.salonId)) {
      salonId = value.salonId;
    } else {
      return res.status(422).json({ message: $t(req.locale, KEYS.NOT_OWNER) });
    }
    stylist = await Stylist.findOne({
      _id: value.stylistId,
      salonId,
      deleted: { $ne: true },
    });
    if (!stylist) {
      return res
        .status(422)
        .json({ message: $t(req.locale, KEYS.NO_ARTIST_AT_SALON) });
    }
  } else if (user.role === ROLES.STYLIST) {
    stylist = user;
    salonId = stylist.salonId;
  } else {
    return res.status(403).send($t(req.locale, KEYS.FORBIDDEN));
  }

  if (!stylist.services.includes(value.serviceId)) {
    return res
      .status(422)
      .json({ message: $t(req.locale, KEYS.NO_SERVICE_FOR_ARTIST) });
  }

  const salon = await Salon.findOne({
    _id: salonId,
  });

  const service = await Service.findOne({
    _id: value.serviceId,
    salonId: salon._id,
  });
  if (!service) {
    return res
      .status(422)
      .json({ message: $t(req.locale, KEYS.NO_SERVICE_AT_SALON) });
  }

  let client = await Client.findOne({
    $or: [
      { _id: value.clientId },
      {
        "phoneNumber.formatted": value.phoneFormatted,
      },
    ],
  });

  if (!client) {
    const { firstName, lastName, phoneFormatted, phoneNonFormatted } = value;
    if (!phoneFormatted) {
      return res
        .status(422)
        .json({ message: $t(req.locale, KEYS.FORMATTED_PHONE_REQUIRED) });
    }
    if (!firstName) {
      return res.status(422).json({ message: $t(req.locale, KEYS.FIRST_NAME_REQUIRED) });
    }
    if (!lastName) {
      return res.status(422).json({ message: $t(req.locale, KEYS.LAST_NAME_REQUIRED) });
    }

    client = new Client({
      firstName,
      lastName,
      phoneNumber: {
        formatted: phoneFormatted,
        nonFormatted: phoneNonFormatted,
      },
    });
    await client.save();
  }

  req.reqData = {
    client,
    salon,
    service,
    stylist,
    startTime: value.startTime,
  };
  next();
};

/**
 * @description Get the special appointment details
 */
const getApptDetails = (req, res, next) => {
  const reqData = _.pick(req.params, ["apptId"]);

  // Validate request
  const schema = Joi.object({
    apptId: Joi.objectId().required().label("Appointment ID"),
  });
  const { value, error } = schema.validate(reqData);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  req.reqData = value;
  next();
};

/**
 * @description Get appointment list by date
 */
const getByDate = (req, res, next) => {
  const reqData = _.pick(req.params, ["date", "id"]);

  // Validate request
  const schema = Joi.object({
    date: Joi.date().format("YYYY-MM-DD").required().label("Date"),
  });
  const { value, error } = schema.validate(reqData);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  req.reqData = value;
  next();
};

module.exports = {
  create,
  getApptDetails,
  getByDate,
};
