const { model, Schema } = require("mongoose");

/**
 * Service Schema
 * @private
 */

const ObjectId = Schema.Types.ObjectId;

const serviceSchema = new Schema(
  {
    salonId: {
      type: ObjectId,
      required: true,
      ref: "Salon",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
    },
    duration: {
      type: Number,
      required: true,
    },
    associatedEmployees: {
      type: [
        {
          type: ObjectId,
          ref: "Stylist",
        },
      ],
    },
    numTotalAppointments: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Service = model("Service", serviceSchema);

/**
 * @typedef Service
 */
module.exports = Service;
