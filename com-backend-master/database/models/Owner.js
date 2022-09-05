const { model, Schema } = require("mongoose");
const { ROLES } = require("../../constants/");
/**
 * Owner Schema
 * @private
 */

const ownerSchema = new Schema(
  {
    phoneNumber: {
      formatted: {
        type: String,
        required: true,
        trim: true,
      },
      nonFormatted: {
        type: String,
        required: true,
        trim: true,
      },
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: ROLES.OWNER,
    },
  },
  {
    timestamps: true,
  },
);

const Owner = model("Owner", ownerSchema);

/**
 * @typedef Owner
 */
module.exports = Owner;
