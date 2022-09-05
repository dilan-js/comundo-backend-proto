const { model, Schema } = require("mongoose");
const { ROLES } = require("../../constants");

/**
 * Client Schema
 * @private
 */

const clientSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      formatted: {
        type: String,
        required: true,
        trim: true,
      },
      nonFormatted: {
        type: String,
        trim: true,
      },
    },
    photo: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: ROLES.CUSTOMER,
    },
  },
  {
    timestamps: true,
  },
);

const Client = model("Client", clientSchema);

/**
 * @typedef Client
 */
module.exports = Client;
