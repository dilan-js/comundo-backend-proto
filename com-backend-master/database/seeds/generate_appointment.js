const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const { connect } = require("../index");
const { Appointment } = require("../models");

(async () => {
  await connect(process.env.MONGODB_URI);

  const appointment = new Appointment({
    salonId: "611571df2ab73d1e4eadc0d9",
    salonName: "Dilans Hair Salon",
    clientId: "611561625cc5a813afc233d5",
    scheduledDate: "1629104408",
    startTime: "2021-08-16T09:30:09+00:00",
    endTime: "2021-08-16T11:00:09+00:00",
    status: {
      isCancelled: false,
      isConfirmed: false,
      isCompleted: false,
    },
  });
  await appointment.save();

  console.log("***Generated the access codes!");
  process.exit(0);
})();
