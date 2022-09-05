/** Dependencies */
const { Appointment } = require("../../database/models");
const NotificationService = require("../../services/NotificationService");
const {
  getOperatingHoursOfSalon,
  slotsFrom,
  isArtistAvailable,
} = require("./utils");

const { $t, KEYS } = require("../../utils/locale");

/**
 * @description Create appointment
 */
const create = async (req, res) => {
  try {
    const { client, salon, service, stylist, startTime } = req.reqData;

    const operatingHours = getOperatingHoursOfSalon(
      salon,
      startTime,
      req.locale,
    );

    const { duration } = service;
    const isToday =
      new Date().toLocaleDateString() === startTime.toLocaleDateString();
    const slots = slotsFrom(operatingHours, duration, isToday, salon.timezone);
    const isAvailable = await isArtistAvailable(
      Object.assign({}, stylist.toObject(), { id: stylist._id }),
      slots,
      startTime,
      duration,
      salon.timezone,
    );

    if (!isAvailable) {
      return res
        .status(422)
        .json({ message: $t(req.locale, KEYS.ARTIST_NOT_AVAILABLE) });
    }

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + duration);

    const appointment = new Appointment({
      salonId: salon._id,
      service: service._id,
      stylist: stylist._id,
      clientId: client._id,
      startTime,
      endTime,
      // TODO: calculate final price including discount
      price: service.price,
      currency: service.currency,
      timezone: salon.timezone,
      status: {
        isCancelled: false,
        isConfirmed: false,
        isCompleted: false,
      },
    });
    const savedAppointment = await appointment.save();
    savedAppointment.id = savedAppointment._id;
    delete savedAppointment._id;

    await NotificationService.notificationForBook(
      salon.ownerId,
      stylist._id,
      `${client.firstName} ${client.lastName}`,
    );

    return res.status(200).json(savedAppointment);
  } catch (error) {
    return res.status(422).json({ message: error.message });
  }
};

module.exports = {
  create,
};
