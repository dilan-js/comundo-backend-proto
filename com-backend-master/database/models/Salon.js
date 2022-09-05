const { model, Schema } = require("mongoose");
const { ROLES } = require("../../constants");

/**
 * Salon Schema
 * @private
 */

const ObjectId = Schema.Types.ObjectId;

const salonSchema = new Schema(
  {
    ownerId: {
      type: ObjectId,
      ref: "Owner",
    },
    salonName: {
      type: String,
      trim: true,
    },
    salonTags: {
      type: [String],
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
    website: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    photo: {
      type: [String],
    },
    description: {
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
    operatingHours: [
      {
        day: {
          type: String,
        },
        start: {
          type: String,
        },
        end: {
          type: String,
        },
        breaks: [
          {
            start: {
              type: String,
            },
            end: {
              type: String,
            },
          },
        ],
        isClosed: {
          type: Boolean,
          default: true,
        },
      },
    ],
    numEarnings: {
      perDay: {
        type: Number,
      },
      perWeek: {
        type: Number,
      },
      perMonth: {
        type: Number,
      },
    },
    rating: {
      type: Number,
      default: 0.0,
    },
    numReviews: {
      type: Number,
      default: 0.0,
    },
    timezone: {
      type: String,
      default: "America/Merida",
    },
    role: {
      type: String,
      default: ROLES.SALON,
    },
  },
  {
    timestamps: true,
  },
);

const Salon = model("Salon", salonSchema);

/**
 * @typedef Salon
 */
module.exports = Salon;
