/**
 * @description Appointment API Controller
 */

/** Dependencies */
const { APPTSTATUS } = require("../../constants");
const { Appointment } = require("../../database/models");
const NotificationService = require("../../services/NotificationService");

/**
 * @description Cancel an appointment and send the push notification
 */
const cancelConfirmAppt = async (req, res) => {
  const { apptId, status } = req.reqData;

  let setQuery;

  if (status === APPTSTATUS.CANCEL) {
    setQuery = { "status.isCancelled": true };
  } else if (status === APPTSTATUS.CONFIRM) {
    setQuery = { "status.isConfirmed": true };
  } else {
    setQuery = {};
  }

  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: apptId },
      {
        $set: setQuery,
      },
      { new: true }
    );

    if (status === APPTSTATUS.CANCEL || status === APPTSTATUS.CONFIRM) {
      const { user } = req;

      await NotificationService.notificationForProviderAppt(
        appointment.salonId,
        appointment.stylist,
        status,
        user.role
      );
    }

    return res.status(200).json(appointment);
  } catch (error) {
    return res.status(422).json({ message: error.message });
  }
};

module.exports = {
  cancelConfirmAppt,
};
