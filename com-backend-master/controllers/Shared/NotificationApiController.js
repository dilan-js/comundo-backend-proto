/**
 * @description Push notification API Controller
 */

/** Dependencies */
const mongoose = require("mongoose");
const { ROLES } = require("../../constants");
const { Device } = require("../../database/models");
const NotificationService = require("../../services/NotificationService");

const ObjectId = mongoose.Types.ObjectId;

/**
 * @description register a device token
 */
const registerToken = async (req, res) => {
  const { token, role, id } = req.reqData;

  try {
    if (role === ROLES.OWNER) {
      await Device.findOneAndUpdate(
        { ownerId: ObjectId(id) },
        {
          ownerId: id,
          token,
          role,
        },
        { new: true, upsert: true }
      );
    } else if (role === ROLES.STYLIST) {
      await Device.findOneAndUpdate(
        { stylistId: ObjectId(id) },
        {
          stylistId: id,
          token,
          role,
        },
        { new: true, upsert: true }
      );
    } else {
      await Device.findOneAndUpdate(
        { clientId: ObjectId(id) },
        {
          clientId: id,
          token,
          role,
        },
        { new: true, upsert: true }
      );
    }

    return res
      .status(200)
      .json({ status: "OK", message: "Successfully registered FCM Token!" });
  } catch (e) {
    return res.status(422).json({ message: e.message });
  }
};

/**
 * @description Send the push notification
 */
const pushNotification = async (req, res) => {
  try {
    await NotificationService.sendNotification(req.reqData);

    return res
      .status(200)
      .json({ status: "OK", message: "Successfully sent notifications!" });
  } catch (e) {
    return res.status(422).json({ message: e.message });
  }
};

module.exports = {
  registerToken,
  pushNotification,
};
