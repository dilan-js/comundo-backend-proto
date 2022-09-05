/**
 * @description Push notification Service
 */

/** Dependencies */
const admin = require("firebase-admin");
const mongoose = require("mongoose");

const { APPTSTATUS, ROLES } = require("../constants");
const serviceAccount = require("../constants/firebase.json");
const { Appointment, Salon, Device } = require("../database/models");

const ObjectId = mongoose.Types.ObjectId;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/**
 * @description Send the push notification to devices
 */
const sendNotification = async (data) => {
  const { tokens, title, body, imageUrl } = data;

  await admin.messaging().sendMulticast({
    tokens,
    notification: {
      title,
      body,
      imageUrl,
    },
  });
};

const getClientsBySalonId = async (salonId) => {
  return await Appointment.aggregate([
    {
      $match: {
        salonId: ObjectId(salonId),
      },
    },
    {
      $project: {
        _id: 0,
        clientId: 1,
      },
    },
    {
      $lookup: {
        from: "devices",
        localField: "clientId",
        foreignField: "clientId",
        as: "device",
      },
    },
    {
      $unwind: "$device",
    },
    {
      $project: {
        token: "$device.token",
      },
    },
    {
      $group: {
        _id: "$token",
      },
    },
  ]);
};

const getOwnerStylistToken = async (ownerId, stylistId) => {
  const ownerToken = await Device.findOne({
    ownerId,
  });
  const stylistToken = await Device.findOne({
    stylistId,
  });

  const tokens = [];

  if (ownerToken && ownerToken.token) {
    tokens.push(ownerToken.token);
  }

  if (stylistToken && stylistToken.token) {
    tokens.push(stylistToken.token);
  }

  return tokens;
};

/**
 * @description Send the push notification when a promotion is created
 */
const notificationForCreatedPromotion = async (salonId, salonName) => {
  const clients = await getClientsBySalonId(salonId);

  const tokens = clients.map((client) => client._id);
  if (tokens && tokens.length > 0) {
    await sendNotification({
      tokens,
      title: "¡No Dejes Que Se Te Escape!",
      body: `"${salonName}" tiene una promoción`,
    });
  }
};

/**
 * @description Send the push notification when an appointment is canceled/confirmed by salon/stylist
 */
const notificationForProviderAppt = async (
  salonId,
  stylistId,
  status,
  role
) => {
  let title = "";
  let body = "";
  let tokens = [];
  let byWho = "";

  if (status === APPTSTATUS.CANCEL) {
    title = "Reserva Cancelada";
  } else if (status === APPTSTATUS.CONFIRM) {
    title = "Reserva Confirmada";
  }

  const salon = await Salon.findOne({
    _id: salonId,
  });

  if (role === ROLES.CUSTOMER) {
    byWho = "El Cliente";

    tokens = await getOwnerStylistToken(salon.ownerId, stylistId);
  } else {
    byWho = role === ROLES.OWNER ? "El Salón" : "El Estilista";

    const clients = await getClientsBySalonId(salonId);
    tokens = clients.map((client) => client._id);
  }

  if (status === APPTSTATUS.CANCEL) {
    // body = `An appointment of "${salon.salonName}" has just been cancelled by the ${byWho}`;
    body = `${byWho} ha cancelado la reserva del salón "${salon.salonName}"`;
  } else if (status === APPTSTATUS.CONFIRM) {
    // body = `An appointment of "${salon.salonName}" has just been confirmed by the ${byWho}`;
    body = `${byWho} ha confirmado la reserva para el salón "${salon.salonName}"`;
  }

  if (tokens && tokens.length > 0) {
    await sendNotification({
      tokens,
      title,
      body,
    });
  }
};

/**
 * @description Send the push notification when an appointment is canceled/confirmed by salon/stylist
 */
const notificationForBook = async (ownerId, stylistId, clientName) => {
  const tokens = await getOwnerStylistToken(ownerId, stylistId);

  if (tokens.length > 0) {
    await sendNotification({
      tokens,
      title: "¡Nueva Reserva!",
      body: `"${clientName}" ha hecho una reserva`,
    });
  }
};

module.exports = {
  sendNotification,
  notificationForCreatedPromotion,
  notificationForProviderAppt,
  notificationForBook,
};
