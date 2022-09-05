
/**
 * @description Get all stylists
 */

/** Dependencies */
const mongoose = require("mongoose");
const { Stylist } = require("../../database/models");

const ObjectId = mongoose.Types.ObjectId;

const aggregateStylists = ($match) => Stylist.aggregate([
  {
    $match: {
      ...$match,
      deleted: { $ne: true },
    },
  },
  {
    $project: {
      _id: 0,
      id: "$_id",
      photo: 1,
      firstName: 1,
      lastName: 1,
      phoneNumber: 1,
      bio: 1,
    },
  },
]);

const getAll = async (req, res) => {
  const { user: salon } = req;
  try {
    const stylists = await aggregateStylists({
      salonId: ObjectId(salon._id),
    });
    res.status(200).json(stylists);
  } catch (error) {
    return res.status(422).json({ message: error.message });
  }
};

module.exports = {
  getAll,
};
