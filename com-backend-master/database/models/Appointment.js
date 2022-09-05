const { model, Schema } = require("mongoose");
const { autoIncrement } = require("mongoose-plugin-autoinc");

/**
 * Appointment Schema
 * @private
 */

const ObjectId = Schema.Types.ObjectId;

const appointmentSchema = new Schema(
  {
    salonId: {
      type: ObjectId,
      required: true,
      ref: "Salon",
    },
    salonName: {
      type: String,
    },
    service: {
      type: ObjectId,
      required: true,
      ref: "Service",
    },
    scheduledDate: {
      type: Date,
    },
    clientId: {
      type: ObjectId,
      required: true,
      ref: "Client",
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    stylist: {
      type: ObjectId,
      required: true,
      ref: "Stylist",
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
    },
    timezone: {
      type: String,
      default: "America/Merida",
    },
    status: {
      isCancelled: {
        type: Boolean,
      },
      isConfirmed: {
        type: Boolean,
      },
      isCompleted: {
        type: Boolean,
      },
    },
    notificationId: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

appointmentSchema.plugin(autoIncrement, {
  model: "Appointment",
  field: "notificationId",
  startAt: 1,
  incrementBy: 2,
});
const Appointment = model("Appointment", appointmentSchema);

/**
 * @typedef Appointment
 */
module.exports = Appointment;
