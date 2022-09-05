/**
 * @description Business Information API Validator
 */

/** Dependencies */
const _ = require("lodash");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const { phoneNumberSchema } = require("../../../utils/schema.js");
const { $t, KEYS } = require("../../../utils/locale");

/**
 * @description Get Profile
 */
const getProfile = (req, res, next) => {
  const reqData = _.pick(req.params, ["id"]);
  const schema = Joi.object({
    id: Joi.objectId().required().label("Salon ID"),
  });
  const { value, error } = schema.validate(reqData);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  req.reqData = value;
  next();
};

/**
 * @description Submit Basic Salon Info
 */
const submitBasicSalonInfo = (req, res, next) => {
  const reqData = _.pick(req.body, [
    "id",
    "salonName",
    "salonAddress",
    "salonPhoneNumber",
    "salonBio",
    "salonURL",
    "timezone",
  ]);

  // Validate request
  const schema = Joi.object({
    id: Joi.objectId().required().label("Owner ID"),
    salonName: Joi.string().required().label("Salon name"),
    salonAddress: Joi.string().label("Salon address"),
    salonPhoneNumber: phoneNumberSchema,
    salonBio: Joi.string().label("Salon description"),
    salonURL: Joi.string().label("Salon URL"),
    timezone: Joi.string().label("Timezone"),
  });
  const { value, error } = schema.validate(reqData);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  req.reqData = value;
  next();
};

/**
 * @description Update Basic Salon Info
 */
const updateBasicSalonInfo = (req, res, next) => {
  const reqData = _.pick(req.body, [
    "id",
    "salonName",
    "salonAddress",
    "salonPhoneNumber",
    "salonBio",
    "salonURL",
    "timezone",
  ]);

  // Validate request
  const schema = Joi.object({
    id: Joi.objectId().required().label("Salon ID"),
    salonName: Joi.string().required().label("Salon name"),
    salonAddress: Joi.string().label("Salon address"),
    salonPhoneNumber: phoneNumberSchema,
    salonBio: Joi.string().label("Salon description"),
    salonURL: Joi.string().label("Salon URL"),
    timezone: Joi.string().label("Timezone"),
  });
  const { value, error } = schema.validate(reqData);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  req.reqData = value;
  next();
};

/**
 * @description Submit Salon Tags
 */
const submitSalonTags = (req, res, next) => {
  const reqData = _.pick(req.body, ["id", "salonTags"]);

  // Validate request
  const schema = Joi.object({
    id: Joi.objectId().required().label("Salon ID"),
    salonTags: Joi.array().required().label("Salon tags"),
  });
  const { value, error } = schema.validate(reqData);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  req.reqData = value;
  next();
};

/**
 * @description Submit Provider Photos
 */
const submitSalonPhotos = (req, res, next) => {
  const reqData = _.pick(req.body, ["id", "photos"]);

  // Validate request
  const schema = Joi.object({
    id: Joi.objectId().required().label("Salon ID"),
    photos: Joi.array().required().label("Salon photos"),
  });
  const { value, error } = schema.validate(reqData);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  req.reqData = value;
  next();
};

/**
 * @description Submit Salon Employees
 */
const submitSalonEmployees = (req, res, next) => {
  const reqData = _.pick(req.body, ["id", "salonEmployees"]);

  // Validate request
  const employee = Joi.object().keys({
    firstName: Joi.string().label("Firstname"),
    lastName: Joi.string().label("Lastname"),
    phoneNumber: phoneNumberSchema,
  });

  const schema = Joi.object({
    id: Joi.objectId().required().label("Salon ID"),
    salonEmployees: Joi.array()
      .items(employee)
      .required()
      .label("Salon employees"),
  });
  const { value, error } = schema.validate(reqData);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  const { user } = req;
  if(!user.salonIDs.includes(value.id)) {
    return res.status(403).json({ message: $t(req.locale, KEYS.NOT_OWNER) });
  }

  req.reqData = value;
  next();
};

/**
 * @description Submit Salon Business Hours
 */
const submitSalonBusinessHours = (req, res, next) => {
  const reqData = _.pick(req.body, ["id", "operatingHours"]);

  // Validate request
  const operatingHour = Joi.object().keys({
    day: Joi.string().label("Day"),
    start: Joi.string().allow("").label("Start time"),
    end: Joi.string().allow("").label("End time"),
    breaks: Joi.array().label("Breaks"),
    isClosed: Joi.boolean().label("isClosed"),
  });

  const schema = Joi.object({
    id: Joi.objectId().required().label("Salon ID"),
    operatingHours: Joi.array()
      .items(operatingHour)
      .required()
      .label("Operating hours"),
  });
  const { value, error } = schema.validate(reqData);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  req.reqData = value;
  next();
};

/**
 * @description Get Employees
 */
const getEmployees = (req, res, next) => {
  const reqData = _.pick(req.params, ["id"]);

  // Validate request
  const schema = Joi.object({
    id: Joi.objectId().required().label("Salon ID"),
  });
  const { value, error } = schema.validate(reqData);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  req.reqData = value;

  next();
};

const serviceSchema = Joi.object().keys({
  serviceId: Joi.objectId().label("Service ID"),
  servicePrice: Joi.number().label("Service price"),
  serviceTitle: Joi.string().min(4).max(30).label("Service title"),
  serviceDescription: Joi.string().min(4).max(200).label("Service description"),
  serviceArtists: Joi.array()
    .items(Joi.objectId().required().label("Stylist ID"))
    .label("Service artists"),
  serviceDuration: Joi.number()
    .min(5)
    .max(24 * 60)
    .label("Service duration"),
});

/**
 * @description Create Services For a Salon
 */
const createService = (req, res, next) => {
  const reqData = _.pick(req.body, ["id", "service"]);
  // Validate request

  const schema = Joi.object({
    id: Joi.objectId().required().label("Salon ID"),
    service: serviceSchema.required().label("Service"),
  });
  const { value, error } = schema.validate(reqData);
  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  req.reqData = value;
  next();
};

/**
 * @description Update Services For a Salon
 */
const updateService = (req, res, next) => {
  const { serviceId } = req.params;
  const reqData = _.pick(req.body, [
    "serviceTitle",
    "servicePrice",
    "serviceDescription",
    "serviceArtists",
    "serviceDuration",
  ]);
  reqData.serviceId = serviceId;

  // Validate request
  const { value, error } = serviceSchema.validate(reqData);
  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  req.reqData = { service: value };
  next();
};

/**
 * @description Deletee Services For a Salon
 */
const deleteServices = (req, res, next) => {
  const reqData = _.pick(req.params, ["serviceId"]);
  // Validate request
  const schema = Joi.object({
    serviceId: Joi.objectId().required().label("Service ID"),
  });
  const { value, error } = schema.validate(reqData);
  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  req.reqData = value;
  next();
};

/**
 * @description Delete Salon Employee
 */
const deleteSalonEmployees = (req, res, next) => {
  const reqData = _.pick(req.params, ["stylistId"]);

  const schema = Joi.object({
    stylistId: Joi.objectId().required().label("Stylist ID"),
  });
  const { value, error } = schema.validate(reqData);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  req.reqData = value;
  next();
};

module.exports = {
  createService,
  deleteSalonEmployees,
  deleteServices,
  getEmployees,
  getProfile,
  submitBasicSalonInfo,
  submitSalonBusinessHours,
  submitSalonEmployees,
  submitSalonTags,
  submitSalonPhotos,
  updateBasicSalonInfo,
  updateService,
};
