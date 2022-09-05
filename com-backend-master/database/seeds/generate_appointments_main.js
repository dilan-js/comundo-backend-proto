const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const { connect } = require("../index");
const { Appointment } = require("../models");

const getTime = (hour, minutes) => {
  const time = new Date();
  time.setUTCDate(time.getUTCDate() + 7);
  time.setUTCHours(hour);
  time.setUTCMinutes(minutes);
  time.setUTCSeconds(0);
  return time;
};

const appointment = ({ salonId, service, stylist, startTime, endTime }) =>
  new Appointment({
    salonId,
    service,
    clientId: "611561625cc5a813afc233d5",
    stylist,
    // salonName: "Dilans Hair Salon",
    // scheduledDate: "1629104408",
    startTime,
    endTime,
    status: {
      isCancelled: false,
      isConfirmed: true,
      isCompleted: false,
    },
  });

(async () => {
  await connect(process.env.MONGODB_URI);

  const salonId = "6123ecc1433ec760aa68834a";
  const service = "6123f1ee45c644663efa4ae7";
  const stylists = ["6123ecf5433ec760aa688353"];

  const timeList = [
    {
      startTime: getTime(9, 0),
      endTime: getTime(9, 30),
    },
    {
      startTime: getTime(10, 0),
      endTime: getTime(11, 0),
    },
    {
      startTime: getTime(12, 30),
      endTime: getTime(13, 30),
    },
  ];

  const appointments = stylists.flatMap((stylist) =>
    timeList.map(({ startTime, endTime }) =>
      appointment({ salonId, service, stylist, startTime, endTime })
    )
  );

  await Promise.all(appointments.map((apt) => apt.save()));

  console.log("***Generated the appoitnments codes!");
  process.exit(0);
})();
