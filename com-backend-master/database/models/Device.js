const { model, Schema } = require("mongoose");

/**
 * Device Schema
 * @private
 */

const ObjectId = Schema.Types.ObjectId;

const deviceSchema = new Schema(
  {
    clientId: {
      type: ObjectId,
      ref: "Client",
    },
    ownerId: {
      type: ObjectId,
      ref: "Owner",
    },
    stylistId: {
      type: ObjectId,
      ref: "Stylist",
    },
    token: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Device = model("Device", deviceSchema);

/**
 * @typedef Device
 */
module.exports = Device;
