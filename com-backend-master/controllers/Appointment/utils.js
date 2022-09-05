const mongoose = require("mongoose");
const { Appointment } = require("../../database/models");
const { offsetMinutesToDate, localMidnight } = require("../../utils/date.js");
const { $t, KEYS } = require("../../utils/locale");

const ObjectId = mongoose.Types.ObjectId;

// This is mininum minutes prior to a slot available to book --
// if it's 5:00PM now and appointment is at 5:10 -- cannot book.
const MIN_BUFFER_MINUTES = 15;

const DAY_MAP = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  0: "Sunday",
};

function getOperatingHoursOfSalon(salon, date, locale) {
  const midnight = localMidnight(date, salon.timezone);
  const operatingHours =
    salon.operatingHours &&
    salon.operatingHours.find((o) => DAY_MAP[midnight.getUTCDay()] === o.day);

  if (!operatingHours || operatingHours.isClosed) {
    throw new Error(`${$t(locale, KEYS.SALON_CLOSED_ON)} ${ $t(locale, DAY_MAP[midnight.getUTCDay()]) }`);
  }

  return operatingHours;
}

const timeSlots = (from, to) =>
  Array((to - from) / 5)
    .fill(0)
    .map((t, i) => from + 5 * i);

const excludeRange = (slots, from, to) =>
  slots.filter((t) => !(t >= from && t < to));

const timeToMinutes = (h, m) => 60 * h + m;

const stringToMinutes = (time) =>
  timeToMinutes(...time.split(":").slice(0, 2).map(Number));

const localTime = (date, timeZone) =>
  stringToMinutes(
    date.toLocaleString("en", {
      timeZone,
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    }),
  );

const ceil5 = (minutes) => {
  const remainder = minutes % 5;
  return remainder ? minutes + (5 - remainder) : minutes;
};

const excludeBreakes = (slots, breaks, duration) =>
  breaks.reduce((prev, aBreak) => {
    const start = stringToMinutes(aBreak.start);
    const end = stringToMinutes(aBreak.end);
    return excludeRange(prev, start - duration + 5, end);
  }, slots);

const excludeAppointments = (slots, appointments, duration, timeZone) =>
  appointments.reduce((prev, appointment) => {
    const startTime = new Date(appointment.startTime);
    const endTime = new Date(appointment.endTime);
    const start = localTime(startTime, timeZone);
    const end = localTime(endTime, timeZone);
    return excludeRange(prev, start - duration + 5, end);
  }, slots);

function setStatusText(appointment) {
  appointment.statusText =
    appointment.status.isCancelled ? "cancelled"
    : appointment.endTime <= Date.now() ? "past"
    : appointment.startTime > Date.now() ? (appointment.status.isConfirmed ? "active" : "pending_confirmation")
    : "started";
  return appointment;
}

function getArtistsAppointments(salonId, stylist, fromMidnight) {
  const toMidnight = new Date(fromMidnight);
  toMidnight.setHours(fromMidnight.getHours() + 24);

  return Appointment.aggregate([
    {
      $match: {
        salonId: ObjectId(salonId),
        stylist,
        startTime: {
          $gte: fromMidnight,
          $lte: toMidnight,
        },
        "status.isCancelled": false,
      },
    },
    {
      $group: {
        _id: "$stylist",
        appointments: {
          $push: {
            startTime: "$startTime",
            endTime: "$endTime",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        stylist: "$_id",
        appointments: 1,
      },
    },
  ]);
}

const minutesToString = (minutes) =>
  [(minutes / 60) | 0, `00${minutes % 60}`.slice(-2)].join(":");

const calcSlots =
  (artistsAppointments, slots, date, duration, timeZone) =>
    (stylist) => {
      stylist = Object.assign({}, stylist);
      const { appointments = [] } =
        artistsAppointments.find(
          (s) => s.stylist.toString() === stylist.id.toString(),
        ) || {};
      const localAvailableSlots = appointments.length
        ? excludeAppointments(slots, appointments, duration, timeZone)
        : slots.slice();
      stylist.localTimeSlots = localAvailableSlots.map(minutesToString);

      stylist.utcSlots = localAvailableSlots.map((mins) =>
        offsetMinutesToDate(date, mins),
      );
      return stylist;
    };

async function getTimeData(
  salonId,
  stylists,
  date,
  slots,
  duration,
  timeZone,
) {
  date = localMidnight(date, timeZone);

  const artistsAppointments = await getArtistsAppointments(
    salonId,
    { $in: stylists.map((s) => s.id) },
    date,
  );

  const timeSlots = stylists
    .map(
      calcSlots(artistsAppointments, slots, date, duration, timeZone),
    )
    .filter((stylist) => stylist.utcSlots.length);

  return timeSlots;
}

async function isArtistAvailable(
  stylist,
  slots,
  startTime,
  duration,
  timeZone,
) {
  const date = localMidnight(startTime, timeZone);

  const artistsAppointments = await getArtistsAppointments(
    stylist.salonId,
    stylist._id,
    date,
  );

  const timeSlots = calcSlots(
    artistsAppointments,
    slots,
    date,
    duration,
    timeZone,
  )(stylist);

  return timeSlots.utcSlots.map(d => d.getTime()).includes(startTime.getTime());
}

function slotsFrom(operating, duration, isToday, timeZone) {
  let start = 0;
  if (isToday) {
    start = ceil5(localTime(new Date(), timeZone)) + MIN_BUFFER_MINUTES;
  }
  start = Math.max(start, stringToMinutes(operating.start));
  const end = stringToMinutes(operating.end);
  if (start > end) {
    console.error(new Error("Incorrect operating hours"));
    return [];
  }
  if (duration > end - start) {
    console.error(new Error("Incorrect duration"));
    return [];
  }
  const allslots = timeSlots(start, end);
  const working =
    operating.breaks && operating.breaks.length
      ? excludeBreakes(allslots, operating.breaks, duration)
      : allslots;
  return working;
}

module.exports = {
  getOperatingHoursOfSalon,
  getTimeData,
  isArtistAvailable,
  setStatusText,
  slotsFrom,
};
