/**
 * @description Profile API Controller
 */

/** Dependencies */
const { Client } = require("../../database/models");
const S3 = require("../S3BucketController");

/**
 * @description Get Profile
 */
const getProfile = async (req, res) => {
  const { id } = req.reqData;
  try {
    let profile = await Client.findById(id).exec();
    return res.status(200).json(profile);
  } catch (e) {
    return res.status(422).json({ message: e.message });
  }
};

/**
 * @description Update Profile
 */
const updateProfile = async (req, res) => {
  const { reqData } = req;

  try {
    const setData = {
      firstName: reqData.firstName,
      lastName: reqData.lastName,
      "phoneNumber.formatted": reqData.phoneNumber.formatted,
      "phoneNumber.nonFormatted": reqData.phoneNumber.nonFormatted,
    };

    if (reqData.photo) {
      const photo = await S3.uploadProfilePhoto(req, res, "client");
      setData.photo = photo;
    }

    let user = await Client.findOneAndUpdate(
      { _id: reqData.id },
      {
        $set: setData,
      },
      { new: true }
    );
    res.status(200).json(user);
  } catch (e) {
    return res.status(422).json({ message: e.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
