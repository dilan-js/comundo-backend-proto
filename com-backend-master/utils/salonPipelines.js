/**
 * @description stages to be used inside Salon.aggregate pipeline
 */

const $lookupPromotions = {
  $lookup: {
    from: "promotions",
    let: {
      id: "$_id",
    },
    pipeline: [
      {
        $match: {
          $expr: { $eq: ["$salonId", "$$id"] },
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          photos: 1,
          promotionTitle: 1,
          promotionDescription: 1,
          promotionNewPrice: 1,
          promotionOldPrice: 1,
          discount: 1,
          promotionListingDate: 1,
          validUntil: 1,
        },
      },
    ],
    as: "promotions",
  },
};

const $lookupReviews = {
  $lookup: {
    from: "reviews",
    let: {
      id: "$_id",
    },
    pipeline: [
      {
        $match: {
          $expr: { $eq: ["$salonId", "$$id"] },
        },
      },
      {
        $lookup: {
          from: "clients",
          let: {
            clientId: "$clientId",
          },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$clientId"] },
              },
            },
          ],
          as: "client",
        },
      },
      {
        $unwind: "$client",
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          clientId: 1,
          comment: 1,
          rating: 1,
          createdAt: 1,
          firstName: "$client.firstName",
          lastName: "$client.lastName",
        },
      },
    ],
    as: "reviews",
  },
};

const $lookupServices = {
  $lookup: {
    from: "services",
    let: {
      id: "$_id",
    },
    pipeline: [
      {
        $match: {
          $expr: { $eq: ["$salonId", "$$id"] },
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          title: 1,
          price: 1,
          duration: 1,
          photo: 1,
          description: 1,
          associatedEmployees:1,
        },
      },
    ],
    as: "services",
  },
};

const $lookupStylists = {
  $lookup: {
    from: "stylists",
    let: {
      id: "$_id",
    },
    pipeline: [
      {
        $match: {
          $expr: { $eq: ["$salonId", "$$id"] },
          deleted: { $ne: true },
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          bio: 1,
          firstName: 1,
          lastName: 1,
          phoneNumber: 1,
          photo: 1,
        },
      },
    ],
    as: "stylists",
  },
};

module.exports = {
  $lookupPromotions,
  $lookupReviews,
  $lookupServices,
  $lookupStylists,
};
