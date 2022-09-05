const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const { connect } = require("../index");
const { Client } = require("../models");

(async () => {
  await connect(process.env.MONGODB_URI);

  const client = new Client({
    firstName: "Customer",
    lastName: "Customer",
    phoneNumber: {
      formatted: "+16502570295",
      nonFormatted: "6502570295",
    },
    role: "CUSTOMER",
  });
  await client.save();

  console.log("***Created three test accounts for Client");
  process.exit(0);
})();
