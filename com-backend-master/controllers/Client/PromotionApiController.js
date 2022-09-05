/**
 * @description Promotion API Controller
 */

/** Dependencies */
const mongoose = require("mongoose");
const { Promotion, Salon } = require("../../database/models");

const ObjectId = mongoose.Types.ObjectId;

/**
 * @description Get all promotions
 */
const getAllPromotions = async (req, res) => {
  // const match = salonId
  //   ? [
  //       {
  //         $match: {
  //           _id: ObjectId(salonId),
  //         },
  //       },
  //     ]
  //   : [];

  try {
    const salonsWithPromotions = await Salon.aggregate([
      {
        $lookup: {
          from: "promotions",
          localField: "_id",
          foreignField: "salonId",
          as: "promotions",
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          salonName: 1,
          address: 1,
          numReviews: 1,
          rating: 1,
          photos: 1,
          promotions: 1,
        },
      },
      {
        $match: {
          $expr: { $gt: [{ $size: "$promotions" }, 0] },
        },
      },
    ]);

    console.log({ salonsWithPromotions });

    return res.status(200).json(salonsWithPromotions);
  } catch (e) {
    return res.status(422).json({ message: e.message });
  }
};

/**
 * @description Get specific promotion
 */
const getSpecificPromotion = async (req, res) => {
  const { id } = req.reqData;

  try {
    const promotion = await Promotion.findById(id).exec();
    return res.status(200).json(promotion);
  } catch (e) {
    return res.status(422).json({ message: e.message });
  }
};

module.exports = {
  getAllPromotions,
  getSpecificPromotion,
};
