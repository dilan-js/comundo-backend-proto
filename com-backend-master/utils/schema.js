const Joi = require("joi");
const CustomJoi = Joi.extend(require("joi-phone-number"));

const formatted = CustomJoi.string()
  .phoneNumber({ format: "e164" })
  .label("Formatted phone number");

const nonFormatted = CustomJoi.string()
  .phoneNumber()
  .label("Non-formatted phone number");

const phoneNumberSchema = CustomJoi.object().keys({
  formatted: formatted.required(),
  nonFormatted: nonFormatted.required(),
});

module.exports = {
  formatted,
  nonFormatted,
  phoneNumberSchema,
};
