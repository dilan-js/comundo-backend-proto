const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const { connect } = require("../index");
const { Salon } = require("../models");

(async () => {
  await connect(process.env.MONGODB_URI);
  console.log("Connected to DB");

  // for (let i = 0; i < 10; i++) {

  // }
  const salon = new Salon({
    salonName: "Robert Abuda Salon de Belleza Merida",
    salonTags: [
      {
        title: "Corte de Pelo",
        backgroundColor: "#EEE3F9",
        color: "#7527C8",
      },
      {
        title: "Uñas",
        backgroundColor: "#E9F7EB",
        color: "#4CBC62",
      },
      {
        title: "Masaje",
        backgroundColor: "#FAE8E6",
        color: "#DB4437",
      },
    ],
    phoneNumber: {
      formatted: "+529999263015",
      nonFormatted: "9999263015",
    },
    email: "",
    address: "Av, P.º de Montejo 470 C, Centro, 97000 Mérida, Yuc., Mexico",
    photo: [
      "https://casa-s3-v1.s3.us-east-2.amazonaws.com/avatar/Screen+Shot+2021-08-14+at+1.38.27+PM.png",
      "https://casa-s3-v1.s3.us-east-2.amazonaws.com/avatar/Screen+Shot+2021-08-14+at+1.38.41+PM.png",
      "https://casa-s3-v1.s3.us-east-2.amazonaws.com/avatar/Screen+Shot+2021-08-14+at+1.38.54+PM.png",
      "https://casa-s3-v1.s3.us-east-2.amazonaws.com/avatar/Screen+Shot+2021-08-14+at+1.39.10+PM.png",
      "https://casa-s3-v1.s3.us-east-2.amazonaws.com/avatar/Screen+Shot+2021-08-14+at+1.39.23+PM.png",
      "https://casa-s3-v1.s3.us-east-2.amazonaws.com/avatar/Screen+Shot+2021-08-14+at+1.39.44+PM.png",
      "https://casa-s3-v1.s3.us-east-2.amazonaws.com/avatar/Screen+Shot+2021-08-14+at+1.40.01+PM.png",
    ],
    description: `Robert Abuda Hair Salon Merida is located on the famous Paseo de Montejo in Merida, Yucatan. Uniquely, we are situated in the middle of Merida’s hotel zone. Our address is #470C Paseo Montejo (56A) & Calle 39. In addition, we are housed in a beautiful old colonial building with a front wall of glass, providing plenty of light.`,
    employees: [
      "61182b8b99a499a5d66532c3",
      "61182b94f86def2346625c05",
      "61182b9a478efeddd10f45c4",
      "61182ba21e201a95d1f1e29e",
    ],
    services: [
      "611842f29214f8380a72578c",
      "611842faa30f9552f3460454",
      "61184300c90009e553032280",
      "6118430991d86a99361dd68c",
    ],
    appointments: {
      active: [
        "61182bb2741675180fd4d175",
        "61182bb89c9f6219c048bfea",
        "61182bbe98388162b8eee5c4",
        "61182bc92b02d5b3539e02df",
      ],
      past: [
        "61182be891dd760b52a54960",
        "61182bed29008522418acd31",
        "61182bf4a60d52613fed197f",
        "61182bfbc88054c6fe6ee4c7",
        "61182c03f81a8e638cf3a47a",
        "61182c0d948f5348b72bec0b",
      ],
    },
    promotions: [
      "61182c0d948f5348b72bec0b",
      "61182c3408e6d7b40275ad18",
      "61182c3c4c3d842ded17991b",
      "61182c42d3538a9489508440",
    ],
    operatingHours: [
      {
        day: "Monday",
        start: "1629100800",
        end: "1629144000",
        isClosed: "false",
        breaks: [
          {
            start: "1629109800",
            end: "1629111600",
          },
          {
            start: "1629126000",
            end: "1629128700",
          },
        ],
      },
      {
        day: "Tuesday",
        start: "1629187200",
        end: "1629230400",
        isClosed: "false",
      },
      {
        day: "Wednesday",
        start: "1629273600",
        end: "1629316800",
        isClosed: "false",
      },
      {
        day: "Thursday",
        start: "1629360000",
        end: "1629403200",
        isClosed: "false",
      },
      {
        day: "Friday",
        start: "1629446400",
        end: "1629489600",
        isClosed: "false",
      },
      {
        day: "Saturday",
        isClosed: "true",
      },
      {
        day: "Sunday",
        isClosed: "true",
      },
    ],

    numEarnings: {
      perDay: "56",
      perWeek: "219",
      perMonth: "2139",
    },
    reviews: {
      rating: "4.5",
      reviews: [
        "61183a1f23505b76733a22e0",
        "61183a27d3427bb7b1fc0301",
        "61183aa93bafa5035d49e1db",
      ],
    },
    role: "SALON",
  });
  await salon.save();

  console.log("***Generated new SALON!");
  process.exit(0);
})();
