/**
 * @description Salon API Controller
 */

/** Dependencies */
const mongoose = require("mongoose");
const { Review, Salon } = require("../../database/models");
const {
  $lookupPromotions,
  $lookupReviews,
  $lookupServices,
  $lookupStylists,
} = require("../../utils/salonPipelines");
const { $t, KEYS } = require("../../utils/locale");

const ObjectId = mongoose.Types.ObjectId;

/**
 * @description Add the client's review
 */
const addReview = async (req, res) => {
  try {
    const { user: client } = req;
    let { salonId, comment, rating } = req.reqData;

    const salon = await Salon.findOne({ _id: salonId });

    if (!salon) {
      return res.status(422).json({ message: $t(req.locale, KEYS.NO_SALON) });
    }

    const review = new Review({
      clientId: client._id,
      salonId,
      comment,
      rating,
    });

    let { numReviews = 0, rating: prevRating = 0 } = salon;
    rating = (numReviews * prevRating + rating) / (numReviews + 1);
    numReviews += 1;

    await Promise.all([
      review.save(),
      Salon.findOneAndUpdate(
        { _id: salonId },
        {
          $set: {
            numReviews,
            rating,
          },
        },
        { new: true },
      ),
    ]);

    return res.status(200).json({ rating, numReviews });
  } catch (e) {
    return res.status(422).json({ message: e.message });
  }
};

/**
 * @description Get all salons
 */
const getSalons = (pipline) =>
  Salon.aggregate([
    ...pipline,
    {
      $project: {
        _id: 0,
        id: "$_id",
        salonName: 1,
        salonTags: 1,
        address: 1,
        operatingHours: 1,
        rating: 1,
        numReviews: 1,
        reviews: 1,
        phoneNumber: 1,
        website: 1,
        description: 1,
        photo: 1,
        timezone: 1,
        promotions: 1,
        services: 1,
        stylists: 1,
      },
    },
  ]);

const getAllSalons = async (_req, res) => {
  try {
    var salons = await getSalons([{ $sample: { size: 50 } }, $lookupServices]);

    return res.status(200).json(salons);
  } catch (e) {
    return res.status(422).json({ message: e.message });
  }
};

/**
 * @description Search salons
 */
const searchSalons = async (req, res) => {
  const { str } = req.query;

  try {
    const salons = await getSalons([
      {
        $match: {
          $or: [
            {
              salonName: { $regex: `.*${str}.*`, $options: "i" },
            },
            {
              "salonTags.title": { $regex: `.*${str}.*`, $options: "i" },
            },
            {
              "salonTags.backgroundColor": {
                $regex: `.*${str}.*`,
                $options: "i",
              },
            },
            {
              "salonTags.color": { $regex: `.*${str}.*`, $options: "i" },
            },
          ],
        },
      },
      $lookupServices,
    ]);

    return res.status(200).json(salons);
  } catch (e) {
    return res.status(422).json({ message: e.message });
  }
};

/**
 * @description Search salons
 */
const getSalonDetails = async (req, res) => {
  const { salonId } = req.params;

  try {
    const salons = await getSalons([
      {
        $match: {
          _id: ObjectId(salonId),
        },
      },
      $lookupPromotions,
      $lookupReviews,
      $lookupServices,
      $lookupStylists,
    ]);

    return res.status(200).json(salons);
  } catch (e) {
    return res.status(422).json({ message: e.message });
  }
};

module.exports = {
  addReview,
  getAllSalons,
  getSalonDetails,
  searchSalons,
};
