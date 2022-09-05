const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const ObjectId = Schema.Types.ObjectId;

const { connect } = require("../index");
const { Salon } = require("../models");

(async () => {
  await connect(process.env.MONGODB_URI);

  // for (let i = 0; i < 10; i++) {

  // }
  const salon = new Salon({
    salonName: "Dilans Hair Salon",
    salonTags: [
      {
        title: "Haircut",
        backgroundColor: "yellow",
        color: "black",
      },
      {
        title: "Haircut",
        backgroundColor: "white",
        color: "black",
      },
    ],
    phoneNumber: {
      formatted: "+16502570295",
      nonFormatted: "6502570295",
    },
    email: "allwithyou999@gmail.com",
    address: "Av, P.º de Montejo 58 C, Centro, 97000 Mérida, Yuc., Mexico",
    bio: "Welcome to Lorde Salon! We are so happy to have you here in our wonderful business.",
    appointments: {
      active: [],
      past: [],
    },
    operatingHours: [
      {
        day: "Monday",
        start: "9:00:00Z",
        end: "21:00:00Z",
        breaks: [
          {
            start: "13:00:00",
            end: "13:30:00Z",
          },
          {
            start: "18:00:00Z",
            end: "18:30:00Z",
          },
        ],
        isClosed: "false",
      },
      {
        day: "Tuesday",
        start: "9:00:00Z",
        end: "21:00:00Z",
        breaks: [
          {
            start: "11:00:00",
            end: "11:30:00Z",
          },
          {
            start: "15:00:00Z",
            end: "15:30:00Z",
          },
        ],
        isClosed: "false",
      },
      {
        day: "Wednesday",
        start: "9:00:00Z",
        end: "21:00:00Z",
        breaks: [
          {
            start: "12:00:00",
            end: "12:30:00Z",
          },
          {
            start: "15:00:00Z",
            end: "15:30:00Z",
          },
        ],
        isClosed: "false",
      },
    ],
    numEarnings: {
      perDay: 35,
      perWeek: 129,
      perMonth: 3200,
    },
    role: "SALON",
  });
  await salon.save();

  console.log("***Generated the access codes!");
  process.exit(0);
})();
