const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const { connect } = require("../index");
const { Promotion } = require("../models");

(async () => {
  await connect(process.env.MONGODB_URI);

  const promotion = new Promotion({
    photos: [
      "https://casa-s3-v1.s3.us-east-2.amazonaws.com/avatar/random_promotion_5.jpeg",
      "https://casa-s3-v1.s3.us-east-2.amazonaws.com/avatar/random_promotion_6.jpeg",
      "https://casa-s3-v1.s3.us-east-2.amazonaws.com/avatar/random_promotion2.jpeg",
    ],
    salonId: "611571df2ab73d1e4eadc0d9",
    promotionTitle: `10% OFF ALL WOMEN's HAIRCUTS & COLORING`,
    promotionDescription: `Until tomorrow night, all women's haircuts and coloring will be discounted!`,
    promotionNewPrice: 125,
    promotionOldPrice: 112.5,
    discount: "10",
    promotionListingDate: "1628902786",
    validUntil: "1629075586",
  });

  await promotion.save();

  const promotionTwo = new Promotion({
    photos: [
      "https://casa-s3-v1.s3.us-east-2.amazonaws.com/avatar/random_promotion_1.jpeg",
      "https://casa-s3-v1.s3.us-east-2.amazonaws.com/avatar/random_promotion_3.jpeg",
      "https://casa-s3-v1.s3.us-east-2.amazonaws.com/avatar/random_promotion_4.jpeg",
    ],
    salonId: "611571df2ab73d1e4eadc0d9",
    promotionTitle: `10% OFF ALL MEN's HAIRCUTS`,
    promotionDescription: `Until tomorrow night, all men's haircuts will be discounted!`,
    promotionNewPrice: 125,
    promotionOldPrice: 112.5,
    discount: "10",
    promotionListingDate: "1628902559",
    validUntil: "1629248159",
  });

  await promotionTwo.save();

  console.log("***Generated PROMOTIONS!");
  process.exit(0);
})();
