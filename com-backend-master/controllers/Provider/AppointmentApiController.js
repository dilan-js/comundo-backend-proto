/**
 * @description Appointment API Controller
 */

/** Dependencies */
const mongoose = require("mongoose");
const { setStatusText } = require("../Appointment/utils");
const { ROLES } = require("../../constants");
const { Appointment } = require("../../database/models");
const { weekOfDate } = require("../../utils/date.js");
const { $t, KEYS } = require("../../utils/locale");

const {
  $lookupClients,
  $lookupSalons,
  $lookupServices,
  $lookupStylists,
  $project,
  $unwind,
} = require("../../utils/appointmentPipelines");

const ObjectId = mongoose.Types.ObjectId;

const convertToObject = (appointmentGroups) =>
  appointmentGroups.reduce((grouped, appt) => {
    grouped[appt._id] = appt.appointments.map(setStatusText);
    return grouped;
  }, {});

const aggregateAppointments = ($match, user) =>
  Appointment.aggregate([
    {
      $match,
    },
    $lookupClients,
    $lookupSalons,
    $lookupServices,
    $lookupStylists,
    $project,
    ...$unwind,
    {
      $addFields: {
        isMine: { $eq: [user._id, "$stylist._id"] },
      },
    },
    {
      $group: {
        _id: "$date",
        appointments: {
          $push: "$$CURRENT",
        },
      },
    },
  ]);

const getUserMatch = (user) =>
  (user.role === ROLES.OWNER) ? {
    salonId: { $in: user.salonIDs.map(id => ObjectId(id)) },
  }
  : (user.role === ROLES.STYLIST) ? {
    salonId: ObjectId(user.salonId),
  }
  : {};

/**
 * @description Get all appointments
 */
const getAllAppts = async (req, res) => {
  const { user } = req;
  try {
    const appointments = await aggregateAppointments(getUserMatch(user), user);
    res.status(200).json(convertToObject(appointments));
  } catch (error) {
    return res.status(422).json({ message: error.message });
  }
};

/**
 * @description Get appointments by date
 */
const getByDate = async (req, res) => {
  const { user } = req;
  const { date } = req.reqData;

  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);

  try {
    const appointments = await aggregateAppointments({
      ...getUserMatch(user),
      startTime: {
        $gte: date,
        $lte: nextDay,
      },
    }, user);
    res.status(200).json(convertToObject(appointments));
  } catch (error) {
    return res.status(422).json({ message: error.message });
  }
};

/**
 * @description Get appointments for a whole week by date
 */
const getWeekly = async (req, res) => {
  const { user } = req;
  const { date } = req.reqData;

  const { monday, sunday } = weekOfDate(date);

  try {
    const appointments = await aggregateAppointments({
      ...getUserMatch(user),
      startTime: {
        $gte: monday,
        $lte: sunday,
      },
    }, user);
    res.status(200).json(convertToObject(appointments));
  } catch (error) {
    return res.status(422).json({ message: error.message });
  }
};

/**
 * @description Get appointments for a whole month by date
 */
const getMonthly = async (req, res) => {
  const { user } = req;
  const { date } = req.reqData;
  const offset = -date.getTimezoneOffset();
  const start = new Date(date);
  start.setDate(1);
  start.setMinutes(offset);
  const end = new Date(start);
  end.setMonth(start.getMonth() + 1);
  try {
    const appointments = await aggregateAppointments({
      ...getUserMatch(user),
      $expr: {
        $and: [
          { $gte: [ "$startTime" , { $dateFromString: {
            dateString: start.toISOString().split('T')[0],
            timezone: "$timezone",
          } } ]},
          { $lte: [ "$startTime" , { $dateFromString: {
            dateString: end.toISOString().split('T')[0],
            timezone: "$timezone",
          } } ]},
        ],
      },
    }, user);
    res.status(200).json(convertToObject(appointments));
  } catch (error) {
    return res.status(422).json({ message: error.message });
  }
};

/**
 * @description Get the special appointment details
 */
const getApptDetails = async (req, res) => {
  const { user } = req;
  const { apptId } = req.reqData;
  try {
    const appointments = await aggregateAppointments({
      ...getUserMatch(user),
      _id: ObjectId(apptId),
    }, user);

    if (!appointments) {
      return res.status(401).json({ message: $t(req.locale, KEYS.SOMETHING_WRONG) });
    }

    if (appointments.length === 0) {
      return res
        .status(401)
        .json({ message: $t(req.locale, KEYS.NO_APPOINTMENT) });
    }

    return res.status(200).json(appointments[0].appointments[0]);
  } catch (error) {
    return res.status(422).json({ message: error.message });
  }
};

module.exports = {
  getAllAppts,
  getByDate,
  getWeekly,
  getMonthly,
  getApptDetails,
};
