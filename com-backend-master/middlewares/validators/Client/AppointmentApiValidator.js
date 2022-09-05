/**
 * @description Appointment API Validator
 */

/** Dependencies */
const _ = require("lodash");
const Joi = require("joi").extend(require("@joi/date"));
Joi.objectId = require("joi-objectid")(Joi);
const {
  Service,
  Stylist,
  Salon,
} = require("../../../database/models");
const { $t, KEYS } = require("../../../utils/locale");

const create = async (req, res, next) => {
  const reqData = _.pick(req.body, [
    "serviceId",
    "stylistId",
    "salonId",
    "startTime",
  ]);

  // Validate request
  const schema = Joi.object({
    salonId: Joi.objectId().required().label("Salon ID"),
    serviceId: Joi.objectId().required().label("Service ID"),
    startTime: Joi.date().iso().required().label("Start time"),
    stylistId: Joi.objectId().required().label("Stylist ID"),
  });
  const { value, error } = schema.validate(reqData);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  if (value.startTime.getTime() < Date.now()) {
    return res.status(422).json({ message: $t(req.locale, KEYS.NO_BOOK_IN_PAST) });
  }

  const salon = await Salon.findOne({
    _id: value.salonId,
  });
  if (!salon) {
    return res.status(422).json({ message: $t(req.locale, KEYS.NO_SALON) });
  }

  const service = await Service.findOne({
    _id: value.serviceId,
    salonId: value.salonId,
  });
  if (!service) {
    return res.status(422).json({ message: $t(req.locale, KEYS.NO_SERVICE_AT_SALON) });
  }

  let stylist = await Stylist.findOne({
    _id: value.stylistId,
    salonId: value.salonId,
    deleted: { $ne: true },
  });
  if (!stylist) {
    return res.status(422).json({ message: $t(req.locale, KEYS.NO_ARTIST_AT_SALON) });
  }

  const { user: client } = req;

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

module.exports = {
  create,
  getApptDetails,
};
