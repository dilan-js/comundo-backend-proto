/**
 * @description stages to be used inside Appointment.aggregate pipeline
 */

const $lookupClients = {
  $lookup: {
    from: "clients",
    localField: "clientId",
    foreignField: "_id",
    as: "client",
  },
};

const $lookupSalons = {
  $lookup: {
    from: "salons",
    localField: "salonId",
    foreignField: "_id",
    as: "salon",
  },
};

const $lookupStylists = {
  $lookup: {
    from: "stylists",
    localField: "stylist",
    foreignField: "_id",
    as: "stylist",
  },
};

const $lookupServices = {
  $lookup: {
    from: "services",
    localField: "service",
    foreignField: "_id",
    as: "service",
  },
};

const $project = {
  $project: {
    _id: 0,
    id: "$_id",
    scheduledDate: 1,
    startTime: 1,
    endTime: 1,
    status: 1,
    price: 1,
    date: {
      $dateToString: { format: "%Y-%m-%d", date: "$startTime", timezone: "$timezone" },
    },
    localStartTime: {
      $dateToString: { format: "%H:%M", date: "$startTime", timezone: "$timezone" },
    },
    localEndTime: {
      $dateToString: { format: "%H:%M", date: "$endTime", timezone: "$timezone" },
    },
    timezone: 1,
    isPast: {
      $lt: ["$endTime", "$$NOW"],
    },
    salon: {
      salonName: 1,
      phoneNumber: 1,
    },
    client: {
      photo: 1,
      firstName: 1,
      lastName: 1,
      phoneNumber: 1,
    },
    stylist: {
      _id: 1,
      photo: 1,
      firstName: 1,
      lastName: 1,
    },
    service: {
      duration: 1,
      photo: 1,
      price: 1,
      title: 1,
    },
  },
};

const $unwind = [
  {
    $unwind: {
      path: "$salon",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $unwind: {
      path: "$service",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $unwind: {
      path: "$stylist",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $unwind: {
      path: "$client",
      preserveNullAndEmptyArrays: true,
    },
  },
];

module.exports = {
  $lookupClients,
  $lookupSalons,
  $lookupStylists,
  $lookupServices,
  $project,
  $unwind,
};
