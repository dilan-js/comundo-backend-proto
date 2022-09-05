/**
 * @description Appointment API Controller
 */

/** Dependencies */
const mongoose = require("mongoose");
const { Appointment } = require("../../database/models");
const { setStatusText } = require("../Appointment/utils");
const { $t, KEYS } = require("../../utils/locale");

const {
  $lookupSalons,
  $lookupServices,
  $lookupStylists,
  $project,
  $unwind,
} = require("../../utils/appointmentPipelines");

const ObjectId = mongoose.Types.ObjectId;

const getAppointments = async (clientId, apptId) => (await Appointment.aggregate([
  {
    $match: {
      clientId: ObjectId(clientId),
      ...(apptId ? { _id : ObjectId(apptId)} : {}),
    },
  },
  $lookupSalons,
  $lookupServices,
  $lookupStylists,
  $project,
  ...$unwind,
])).map(setStatusText);

/**
 * @description Get all appointments
 */
const getAllAppts = async (req, res) => {
  const { user: client } = req;

  try {
    const appointments = await getAppointments(client._id);

    res.status(200).json(appointments);
  } catch (e) {
    return res.status(422).json({ message: e.message });
  }
};

/**
 * @description Get the special appointment details
 */
const getApptDetails = async (req, res) => {
  const { user: client } = req;
  const { apptId } = req.reqData;

  try {
    const appointments = await getAppointments(client._id, apptId);

    if (!appointments) {
      return res.status(401).json({ message: $t(req.locale, KEYS.SOMETHING_WRONG) });
    }

    if (appointments.length === 0) {
      return res
        .status(401)
        .json({ message: $t(req.locale, KEYS.NO_APPOINTMENT) });
    }

    return res.status(200).json(appointments[0]);
  } catch (e) {
    return res.status(422).json({ message: e.message });
  }
};

module.exports = {
  getAllAppts,
  getApptDetails,
};
