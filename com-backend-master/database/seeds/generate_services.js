const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const { connect } = require("../index");
const { Service, Salon, Stylist } = require("../models");

(async () => {
  try {
    await connect(process.env.MONGODB_URI);
    const service = new Service({
      salonId: "6123ecc1433ec760aa68834a",
      title: "GEL DIP + EYEBALL WAX",
      description: "this is gel dip and eyeball wax service",
      price: 390,
      currency: "USD",
      duration: 90,
    });

    const savedService = await service.save();

    let updatedStylist = await Stylist.findOneAndUpdate(
      { _id: "6123ecf5433ec760aa688353" },
      {
        $set: {
          services: [savedService._id],
        },
      },
      { new: true }
    );

    console.log("***Generated the service!");
    process.exit(0);
  } catch (error) {
    console.log(error);
  }
})();
