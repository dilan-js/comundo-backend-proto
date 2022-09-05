/**
 * @description Provider Salon API Controller
 */

/** Dependencies */
const mongoose = require("mongoose");
const { $t, KEYS } = require("../../utils/locale");
const Salon = require("../../database/models/Salon");
const Stylist = require("../../database/models/Stylist");
const Service = require("../../database/models/Service");
const {
  $lookupPromotions,
  $lookupReviews,
  $lookupServices,
  $lookupStylists,
} = require("../../utils/salonPipelines");
const ObjectId = mongoose.Types.ObjectId;

/** Dependencies */
const S3 = require("../S3BucketController");

/**
 * @description Get all salons
 */
const getSalons = (pipline) =>
  Salon.aggregate([
    ...pipline,
    {
      $project: {
        _id: 0,
        id: "$_id",
        salonName: 1,
        salonTags: 1,
        address: 1,
        operatingHours: 1,
        rating: 1,
        numReviews: 1,
        reviews: 1,
        phoneNumber: 1,
        website: 1,
        description: 1,
        photo: 1,
        timezone: 1,
        promotions: 1,
        services: 1,
        stylists: 1,
        ownerId: 1,
        role: 1,
      },
    },
  ]);
/**
 * @description Get Salon Profile
 */
const getProfile = async (req, res) => {
  const { id } = req.reqData;

  try {
    const payload = {};
    const salons = await getSalons([
      {
        $match: {
          _id: ObjectId(id),
        },
      },
      $lookupPromotions,
      $lookupReviews,
      $lookupServices,
      $lookupStylists,
    ]);
    const lookedUpSalon = salons[0];
    const {
      timezone = "",
      description = "",
      website = "",
      rating = 0.0,
      numReviews = 0,
      photo = [],
      salonTags = [],
      phoneNumber = {},
      stylists = {},
      operatingHours = [],
      services = [],
      reviews = [],
      ownerId,
      role,
    } = lookedUpSalon;
    const { formatted = "", nonFormatted = "" } = phoneNumber || {};
    payload.id = lookedUpSalon.id;
    payload.ownerId = ownerId;
    payload.salonName = lookedUpSalon.salonName;
    payload.address = lookedUpSalon.address;
    payload.phoneNumber = {
      formatted,
      nonFormatted,
    };
    payload.employees = stylists;
    payload.operatingHours = operatingHours;
    payload.services = services;
    payload.description = description;
    payload.photo = photo;
    payload.role = role;
    payload.timezone = timezone;
    payload.website = website;
    payload.tags = salonTags;
    payload.reviews = {
      rating: Math.round(rating * 100) / 100,
      numReviews,
      reviews,
    };
    return res.status(200).json(payload);
  } catch (error) {
    return res.status(422).json({ message: error.message });
  }
};

/**
 * @description Submit Basic Salon Info
 */
const submitBasicSalonInfo = async (req, res) => {
  try {
    const {
      id,
      salonName,
      salonAddress,
      salonPhoneNumber,
      salonURL,
      salonBio,
      timezone,
    } = req.reqData;

    let salon = new Salon({
      ownerId: id,
      salonName,
      address: salonAddress,
      "phoneNumber.formatted": salonPhoneNumber.formatted,
      "phoneNumber.nonFormatted": salonPhoneNumber.nonFormatted,
      description: salonBio,
      website: salonURL,
      timezone,
    });
    salon = await salon.save();
    return res.status(200).json(salon);
  } catch (error) {
    console.log(error);
    return res.status(422).json({ message: error.message });
  }
};

/**
 * @description Update Basic Salon Info
 */
const updateBasicSalonInfo = async (req, res) => {
  try {
    const {
      id,
      salonName,
      salonAddress,
      salonPhoneNumber,
      salonURL,
      salonBio,
      timezone,
    } = req.reqData;

    const updatedSalon = await Salon.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          salonName,
          address: salonAddress,
          "phoneNumber.formatted": salonPhoneNumber.formatted,
          "phoneNumber.nonFormatted": salonPhoneNumber.nonFormatted,
          description: salonBio,
          website: salonURL,
          timezone,
        },
      },
      { new: true },
    );

    const payload = {
      id: updatedSalon._id,
      ownerId: updatedSalon.ownerId,
      salonName: updatedSalon.salonName,
      address: updatedSalon.address,
      phoneNumber: updatedSalon.phoneNumber,
      description: updatedSalon.description,
      role: updatedSalon.role,
      timezone: updatedSalon.timezone,
      website: updatedSalon.website,
    };

    return res.status(200).json(payload);
  } catch (error) {
    return res.status(422).json({ message: error.message });
  }
};

/**
 * @description Submit Salon Tags
 */
const submitSalonTags = async (req, res) => {
  try {
    //updating the salon with new basic info
    let salon = await Salon.findOneAndUpdate(
      { _id: ObjectId(req.reqData.id) },
      {
        $set: {
          salonTags: req.reqData.salonTags,
        },
      },
      { new: true },
    );

    return res.status(200).json(salon);
  } catch (error) {
    return res.status(422).json({ message: error.message });
  }
};

/**
 * @description Submit Salon Photos
 */
const submitSalonPhotos = async (req, res) => {
  try {
    const photos = await S3.uploadProfilePhoto(req, res, "salon");

    const salon = await Salon.findOneAndUpdate(
      { _id: ObjectId(req.reqData.id) },
      { $addToSet: { photo: { $each: photos } } },
      { new: true },
    );

    return res.status(200).json(salon);
  } catch (e) {
    return res.status(422).json({ message: e.message });
  }
};

/**
 * @description Submit Employees
 */
const submitSalonEmployees = async (req, res) => {
  try {
    const { user } = req;

    const submitEmployees = () =>
      Promise.all(
        req.reqData.salonEmployees.map(async (employee) => {
          let stylist = await Stylist.findOne({
            "phoneNumber.formatted": employee.phoneNumber.formatted,
            deleted: { $ne: true },
          });

          // if Stylist exists and not deleted and work for other then can't update
          if(stylist && !user.salonIDs.includes(stylist.salonId.toString())) {
            return res.status(403).json({ message: $t(req.locale, KEYS.NOT_OWNER) });
          }

          // even if exists but was deleted then can reuse and set active again
          stylist = await Stylist.findOneAndUpdate(
            { "phoneNumber.formatted": employee.phoneNumber.formatted },
            {
              $set: {
                salonId: ObjectId(req.reqData.id),
                firstName: employee.firstName,
                lastName: employee.lastName,
                phoneNumber: {
                  formatted: employee.phoneNumber.formatted,
                  nonFormatted: employee.phoneNumber.nonFormatted,
                },
                deleted: false,
              },
            },
            { new: true, upsert: true },
          );

          return stylist;
        }),
      );

    const savedEmployees = await submitEmployees();
    return res.status(200).json({ employees: savedEmployees });
  } catch (error) {
    return res.status(422).json({ message: error.message });
  }
};

/**
 * @description Submit Salon Business Hours
 */
const submitSalonBusinessHours = async (req, res) => {
  try {
    const hours = [];
    req.reqData.operatingHours.forEach((day) => {
      let data = {
        day: day.day,
        start: day.start,
        end: day.end,
        breaks: day.breaks,
        isClosed: day.isClosed,
      };
      hours.push(data);
    });

    //we need to clear the operating hours.
    const salon = await Salon.findOneAndUpdate(
      { _id: ObjectId(req.reqData.id) },
      {
        $set: {
          operatingHours: hours,
        },
      },
      { new: true },
    );

    return res.status(200).json(salon);
  } catch (error) {
    return res.status(422).json({ message: error.message });
  }
};

/**
 * @description Get Employees For Service Dropdown
 */
const getEmployees = async (req, res) => {
  const { id } = req.reqData;
  try {
    const stylists = await Stylist.find({
      salonId: id,
      deleted: { $ne: true },
    });

    return res.status(200).json({ employees: stylists });
  } catch (error) {
    return res.status(422).json({ message: error.message });
  }
};

const create = (salonId, service) =>
  new Service({
    salonId,
    title: service.serviceTitle,
    price: service.servicePrice,
    description: service.serviceDescription,
    duration: service.serviceDuration,
  });

const update = (_service, service) => {
  const {
    serviceTitle: title = _service.title,
    servicePrice: price = _service.price,
    serviceDescription: description = _service.description,
    serviceDuration: duration = _service.duration,
  } = service;
  Object.assign(_service, {
    title,
    price,
    description,
    duration,
  });
};

/**
 * @description
    Update stylists by _id and belongs to the salon
    and store new service to their documents
 */
const updateArtists = (_service, serviceArtists) =>
  Stylist.updateMany(
    {
      _id: { $in: serviceArtists.map(ObjectId) },
      salonId: ObjectId(_service.salonId),
      services: { $ne: ObjectId(_service._id) },
      deleted: { $ne: true },
    },
    {
      $push: {
        services: _service._id,
      },
    },
  );

/**
 * @description Submit Services For a Salon
 */
const submitService = async (req, res) => {
  const { id, service } = req.reqData;
  const { user } = req;
  try {
    const retrieveServicesPromise = async () => {
      const _service = id
        ? create(id, service)
        : await Service.findOne({ _id: service.serviceId });

      if (!user.salonIDs.includes(_service.salonId.toString())) {
        throw new Error($t(req.locale, KEYS.NOT_OWNER));
      }

      if (!id) {
        update(_service, service);
      }

      if (id || service.serviceArtists) {
        await updateArtists(_service, service.serviceArtists);
        const associatedEmployees = await Stylist.find({
          services: _service._id,
          salonId: _service.salonId,
          deleted: { $ne: true },
        });

        _service.associatedEmployees = associatedEmployees.map((s) => s._id);
      }

      await _service.save();

      return _service;
    };

    const result = await retrieveServicesPromise();

    return res.status(200).json(result);
  } catch (error) {
    return res.status(422).json({ message: error.message });
  }
};

/**
 * @description Delete Services For a Salon
 */
const deleteServices = async (req, res) => {
  const { serviceId } = req.reqData;
  try {
    const service = await Service.findOne({
      _id: serviceId,
    });

    if (!service) {
      return res.status(200).json({ status: "OK" });
    }

    const { user } = req;
    if (!user.salonIDs.includes(service.salonId.toString())) {
      return res.status(403).send($t(req.locale, KEYS.NOT_OWNER));
    }

    await Stylist.updateMany(
      {
        services: ObjectId(serviceId),
        deleted: { $ne: true },
      },
      {
        $pull: {
          services: serviceId,
        },
      },
    );

    service.delete();

    return res.status(200).json({ status: "OK" });
  } catch (error) {
    return res.status(422).json({ message: error.message });
  }
};

const deleteSalonEmployees = async (req, res) => {
  try {
    const { stylistId } = req.reqData;
    const { user } = req;

    const stylist = await Stylist.findOne({
      _id: stylistId,
      deleted: { $ne: true },
    });

    if (!stylist) {
      return res.status(200).json({ status: "OK" });
    }

    if(!user.salonIDs.includes(stylist.salonId.toString())) {
      return res.status(403).json({ message: $t(req.locale, KEYS.NOT_OWNER) });
    }

    stylist.deleted = true;
    await stylist.save();

    return res.status(200).json({ status: "OK" });
  } catch (error) {
    return res.status(422).json({ message: error.message });
  }
};

module.exports = {
  deleteSalonEmployees,
  deleteServices,
  getEmployees,
  getProfile,
  submitBasicSalonInfo,
  submitSalonBusinessHours,
  submitSalonEmployees,
  submitSalonTags,
  submitSalonPhotos,
  submitService,
  updateBasicSalonInfo,
};
