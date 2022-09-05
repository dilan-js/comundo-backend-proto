const { model, Schema } = require("mongoose");
const { STYLISTROLE } = require("../../constants");

/**
 * Stylist Schema
 * @private
 */

const ObjectId = Schema.Types.ObjectId;

const stylistSchema = new Schema(
  {
    salonId: {
      type: ObjectId,
      required: true,
      ref: "Salon",
    },
    role: {
      type: STYLISTROLE,
      default: STYLISTROLE.STYLIST,
    },
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
    bio: {
      type: String,
      default: "",
    },
    services: {
      type: [
        {
          type: ObjectId,
          ref: "Service",
        },
      ],
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Stylist = model("Stylist", stylistSchema);

/**
 * @typedef Stylist
 */
module.exports = Stylist;
