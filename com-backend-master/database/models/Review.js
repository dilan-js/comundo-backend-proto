const { model, Schema } = require("mongoose");

/**
 * Review Schema
 * @private
 */

const ObjectId = Schema.Types.ObjectId;

const reviewSchema = new Schema(
  {
    clientId: {
      type: ObjectId,
      ref: "Client",
    },
    salonId: {
      type: ObjectId,
      ref: "Salon",
    },
    comment: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

const Review = model("Review", reviewSchema);

/**
 * @typedef Review
 */
module.exports = Review;
