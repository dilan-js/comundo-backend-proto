/**
 * @description Appointment API Validator
 */

/** Dependencies */
const _ = require("lodash");
const { APPTSTATUS } = require("../../../constants");
const Joi = require("joi").extend(require("@joi/date"));
Joi.objectId = require("joi-objectid")(Joi);
const { $t, KEYS } = require("../../../utils/locale");

/**
 * @description Get slots
 */
const getSlots = (req, res, next) => {
  const reqData = _.pick(req.body, [
    "date",
    "numDays",
    "serviceId",
    "stylistId",
  ]);
  reqData.salonId = req.params.salonId;

  // Validate request
  const schema = Joi.object({
    date: Joi.date().format("YYYY-MM-DD").label("Date"),
    numDays: Joi.number().max(30).label("Days number"),
    salonId: Joi.objectId().required().label("Salon ID"),
    serviceId: Joi.objectId().label("Service ID"),
    stylistId: Joi.objectId().label("Stylist ID"),
  });
  const { value, error } = schema.validate(reqData);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);

  if (value.date < midnight) {
    return res
      .status(422)
      .json({ message: $t(req.locale, KEYS.NO_BOOK_IN_PAST) });
  }

  req.reqData = value;
  next();
};

/**
 * @description Cancel an appointment
 */
const cancelConfirmAppt = (req, res, next) => {
  const reqData = _.pick(req.params, ["status", "apptId"]);

  const schema = Joi.object({
    apptId: Joi.objectId().required().label("Appointment ID"),
    status: Joi.string().required().valid(APPTSTATUS.CANCEL, APPTSTATUS.CONFIRM).label("Appointment status"),
  });
  const { value, error } = schema.validate(reqData);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  req.reqData = value;

  next();
};

module.exports = {
  getSlots,
  cancelConfirmAppt,
};
