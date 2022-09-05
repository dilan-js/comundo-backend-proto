
/** Dependencies */
const { Service } = require("../../database/models");

/**
 * @description Search services
 */
const search = async (req, res) => {
  const { str } = req.query;

  try {
    const services = await Service.aggregate([
      {
        $match: {
          $or: [
            {
              title: { $regex: `.*${str}.*`, $options: "i" },
            },
            {
              description: { $regex: `.*${str}.*`, $options: "i" },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "salons",
          localField: "salonId",
          foreignField: "_id",
          as: "salon",
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
          salon: {
            _id: 1,
            salonName: 1,
            phoneNumber: 1,
          },
        },
      },
    ]);

    return res.status(200).json(services);
  } catch (e) {
    return res.status(422).json({ message: e.message });
  }
};

module.exports = {
  search,
};
