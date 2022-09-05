const { model, Schema } = require("mongoose");

/**
 * Promotion Schema
 * @private
 */

const ObjectId = Schema.Types.ObjectId;

const promotionSchema = new Schema(
  {
    photos: {
      type: [String],
    },
    salonId: {
      type: ObjectId,
      ref: "Salon",
    },
    promotionTitle: {
      type: String,
      default: "",
    },
    promotionDescription: {
      type: String,
      default: "",
    },
    promotionNewPrice: {
      type: Number,
      default: 0,
    },
    promotionOldPrice: {
      type: Number,
      default: 0,
    },
    discount: {
      type: String,
    },
    promotionListingDate: {
      type: String,
    },
    validUntil: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Promotion = model("Promotion", promotionSchema);

/**
 * @typedef Promotion
 */
module.exports = Promotion;
