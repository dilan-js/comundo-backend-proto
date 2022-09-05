/**
 * @description Appointment API Controller
 */

/** Dependencies */
const mongoose = require("mongoose");
const { getTimezoneDiff } = require("../../utils/date.js");
const { $t, KEYS } = require("../../utils/locale");

const { Salon, Service, Stylist } = require("../../database/models");

const { getOperatingHoursOfSalon, slotsFrom, getTimeData } = require("./utils");

const ObjectId = mongoose.Types.ObjectId;

async function getSalon(salonId, locale) {
  const salon = await Salon.findOne({
    _id: ObjectId(salonId),
  });

  if (!salon) {
    throw new Error($t(locale, KEYS.NO_SALON));
  }

  return salon;
}

async function getStylists(stylistId, salonId, serviceId) {
  const stylists = await Stylist.aggregate([
    {
      $match: {
        salonId: ObjectId(salonId),
        deleted: { $ne: true },
        ...(stylistId ? { _id: ObjectId(stylistId) } : {}),
        ...(serviceId ? { services: ObjectId(serviceId) } : {}),
      },
    },
    {
      $project: {
        _id: 0,
        id: "$_id",
        firstName: 1,
        lastName: 1,
        photo: 1,
        services: 1,
      },
    },
  ]);

  return stylists;
}

async function getServices(salonId, serviceId) {
  const services = await Service.aggregate([
    {
      $match: {
        ...(serviceId ? { _id: ObjectId(serviceId) } : {}),
        salonId: ObjectId(salonId),
      },
    },
    {
      $project: {
        _id: 0,
        id: "$_id",
        duration: 1,
        description: 1,
        photo: 1,
        price: 1,
        title: 1,
      },
    },
  ]);

  return services;
}

const getAvailableSlots =
  (salon, _stylists, date, locale) => async (service) => {
    _stylists = _stylists.filter((stylist) =>
      stylist.services.map(String).includes(service.id.toString()),
    );
    let operatingHours;
    try {
      operatingHours = getOperatingHoursOfSalon(salon, date, locale);
    } catch (error) {
      return null;
    }

    const { duration } = service;

    const isToday =
      new Date().toLocaleDateString() === date.toLocaleDateString();
    const slots = slotsFrom(operatingHours, duration, isToday, salon.timezone);

    const stylists = await getTimeData(
      salon._id,
      _stylists,
      date,
      slots,
      duration,
      salon.timezone,
    );
    return {
      service,
      stylists,
    };
  };

/**
 * @description Get appointment free slots
 */
const getSlots = async (req, res) => {
  const { salonId, serviceId, stylistId, numDays = 7 } = req.reqData;
  let { date } = req.reqData;

  // 0. Get Salon's working hours
  // 1. Check they are open on week day of the date
  // 2. Get stylists who offer a service by the serviceId
  // 3. Check there is at least one stylist
  // 4. Get duration of service

  // 5. Get consecutive available time slots of service duration long per each stylist from 2.
  // 5.1 generate all possible time slots according to opertaing hours
  // 5.2 get appointments per stylist
  // 5.3 exclude booked slots per stylist

  try {
    const salon = await getSalon(salonId, req.locale);

    const services = await getServices(salonId, serviceId);

    if (!services.length) {
      return res.status(200).json([]);
    }

    const stylists = await getStylists(stylistId, salon._id, serviceId);

    if (!stylists.length) {
      return res.status(200).json([]);
    }

    const tzDiff = getTimezoneDiff(salon.timezone);

    if (!date) {
      date = new Date();
      date.setHours(0, 0, 0, 0);
    }
    date.setMilliseconds(tzDiff);

    const dates = new Array(numDays).fill(0).map((_, i) => {
      const d = new Date(date);
      d.setDate(d.getDate() + i);
      return d;
    });

    const timeData = (
      await Promise.all(
        dates.map(async (date) => {
          const slots = (
            await Promise.all(
              services.map((s) => {
                return getAvailableSlots(salon, stylists, date, req.locale)(s);
              }),
            )
          ).filter(
            (serviceSlots) => serviceSlots && serviceSlots.stylists && serviceSlots.stylists.length,
          );

          return {
            date,
            services: slots,
          };
        }),
      )
    ).filter((slots) => slots.services && slots.services.length);

    return res.status(200).json(timeData);
  } catch (e) {
    console.log({ e });
    return res.status(422).json({ message: e.message });
  }
};

module.exports = {
  getSlots,
};
