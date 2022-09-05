/**
 * @description Provider Salon API Controller
 */

/** Dependencies */
const mongoose = require("mongoose");
const { $t, KEYS } = require("../../utils/locale");
const { Appointment } = require("../../database/models");
const { isoWeek, relativeWeek, formated } = require("../../utils/date.js");

const { ROLES } = require("../../constants");

const ObjectId = mongoose.Types.ObjectId;

const getAppointments = (match) =>
  Appointment.aggregate([
    {
      $match: {
        ...match,
        startTime: {
          $gte: relativeWeek(4).monday,
          $lte: new Date(),
        },
        "status.isCancelled": false,
      },
    },
    {
      $group: {
        _id: {
          week: {
            $isoWeek: {
              date: "$startTime",
              timezone: "$timezone",
            },
          },
        },
        total: { $sum: "$price" },
        count: { $sum: 1 },
      },
    },
  ]);

const calcRelative = (earnings) => {
  const currentWeek = relativeWeek(0);
  const lastWeek = relativeWeek(1);
  const week2 = relativeWeek(2);
  const week3 = relativeWeek(3);
  const week4 = relativeWeek(4);
  const weeks = [week4, week3, week2, lastWeek, currentWeek];
  return weeks.slice(1).map((week, i) => {
    const weekN = isoWeek(week.monday);
    const prev = weeks[i];
    const prevN = isoWeek(prev.monday);

    const currentEarn = earnings.find((e) => e._id.week === weekN) || {};
    const { total = 0, count = 0 } = currentEarn;

    const prevEarn = earnings.find((e) => e._id.week === prevN) || {};
    const { total: prevTotal = 0, count: prevCount = 0 } = prevEarn;

    const diffTotal =
      prevTotal > 0
        ? (((total - prevTotal) / prevTotal) * 100).toFixed(2) + "%"
        : `${total}$`;
    const diffCount =
      prevCount > 0
        ? (((count - prevCount) / prevCount) * 100).toFixed(2) + "%"
        : `${count} units`;

    return {
      total,
      count,
      diffTotal,
      diffCount,
      week: {
        monday: formated(week.monday),
        sunday: formated(week.sunday),
      },
    };
  });
};

/**
 * @description Get Salon Earnings
 */
const getEarnings = async (req, res) => {
  try {
    const { user } = req;
    const match = {};

    if (user.role === ROLES.STYLIST) {
      match.stylist = user._id;
    } else if (user.role === ROLES.OWNER) {
      const salonId = req.reqData.salonId || user.salonId;
      if (salonId) {
        if (!user.salonIDs.includes(salonId)) {
          return res.status(403).send($t(req.locale, KEYS.NOT_OWNER));
        }
        match.salonId = ObjectId(salonId);
      } else {
        match.salonId = {
          $in: user.salonIDs.map(ObjectId),
        };
      }
    } else {
      return res.status(403).send($t(req.locale, KEYS.FORBIDDEN));
    }

    //1. retrieve num of appointments for each week -- return a max of 4 weeks of past appointments
    // each week should return two metrics:
    //-->) Dollar amount of earnings for the week (this is calculated by the price of each appointment that has been marked 'completed')
    //-->) Total number of appointments booked and marked 'completed'
    //--> this includes the current week's performance
    //2. return the percentage of total bookings/appointments this week vs last week's total.
    //3. return the percentage of dollars earned this week vs last week's total.

    const earnings = await getAppointments(match);
    const relative = calcRelative(earnings);

    return res.status(200).json(relative);
  } catch (error) {
    return res.status(422).json({ message: error.message });
  }
};

module.exports = {
  getEarnings,
};
