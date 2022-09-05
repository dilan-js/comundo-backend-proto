/**
 * @description Promotion API Controller
 */

/** Dependencies */
const mongoose = require("mongoose");
const { Promotion, Salon } = require("../../database/models");
const S3 = require("../S3BucketController");
const NotificationService = require("../../services/NotificationService");
const { $t, KEYS } = require("../../utils/locale");

const ObjectId = mongoose.Types.ObjectId;

/**
 * @description Create a promostion
 */
const createPromotion = async (req, res) => {
  const { reqData } = req;

  try {
    const salon = await Salon.findOne({
      _id: ObjectId(reqData.id),
    });

    if (!salon) {
      return res.status(401).json({ message: $t(req.locale, KEYS.NO_SALON) });
    }

    let photos = [];
    if (reqData.photos && reqData.photos.length > 0) {
      // Upload the photos on S3 Bucket
      photos = await S3.uploadPromotionPhotos(req, res);
    }

    const data = {
      salonId: reqData.id,
      promotionTitle: reqData.promotionTitle,
      promotionDescription: reqData.promotionDescription,
      promotionNewPrice: reqData.promotionNewPrice,
      promotionOldPrice: reqData.promotionOldPrice,
      discount: reqData.discount,
      photos,
    };

    const promotion = new Promotion(data);
    let savedPromotion = await promotion.save();

    await NotificationService.notificationForCreatedPromotion(
      reqData.id,
      salon.salonName,
    );

    return res.status(200).json(savedPromotion);
  } catch (e) {
    return res.status(422).json({ message: e.message });
  }
};

/**
 * @description Get All Promotions
 */
const getAllPromotions = async (req, res) => {
  const { id } = req.reqData;
  try {
    const promotions = await Promotion.find({ salonId: id });
    return res.status(200).json({ promotions });
  } catch (error) {
    return res.status(422).json({ message: error.message });
  }
};

/**
 * @description Delete Specific Promotion
 */
const deletePromotion = async (req, res) => {
  const { id } = req.reqId;
  const { salonId } = req.reqData;

  try {
    await Promotion.deleteOne({ _id: ObjectId(id) });
    const promotions = await Promotion.find().where("salonId").equals(salonId);
    return res.status(200).json({ promotions });
  } catch (error) {
    return res.status(422).json({ message: error.message });
  }
};

module.exports = {
  createPromotion,
  getAllPromotions,
  deletePromotion,
};
