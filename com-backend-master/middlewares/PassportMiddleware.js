/**
 * @description Uses passport.js to authenticate a user
 */

/** Dependencies */
const mongoose = require("mongoose");
const passport = require("passport");
const passportJWT = require("passport-jwt");

const { Client, Owner, Stylist } = require("../database/models");

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is required");
}

const ObjectId = mongoose.Types.ObjectId;

/** Setup JSON Webtoken Strategy */
passport.use(
  "jwt-header",
  new passportJWT.Strategy(
    {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (jwtPayload, done) => {
      let user;
      try {
        if (jwtPayload.clientId) {
          user = await Client.findOne({ _id: jwtPayload.clientId });
        } else if (jwtPayload.ownerId) {
          user = (await Owner.aggregate([
            {
              $match: { _id: ObjectId(jwtPayload.ownerId) },
            },
            {
              $lookup: {
                from: "salons",
                localField: "_id",
                foreignField: "ownerId",
                as: "salons",
              },
            },
            {
              $addFields: {
                salonIDs: {
                  $map: {
                    input: "$salons",
                    as: "salon",
                    in: { $toString: "$$salon._id" },
                  },
                },
              },
            },
          ]))[0];
        } else if (jwtPayload.stylistId) {
          user = await Stylist.findOne({
            _id: jwtPayload.stylistId,
            deleted: { $ne: true },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

/** Define how Passport should serialize a user */
passport.serializeUser((user, done) => {
  done(null, user);
});

/** Define how Passport should deserialize a user */
passport.deserializeUser((user, done) => {
  done(null, user);
});

/**
 * Initialize Passport on Express application
 *
 * @param {Express} app The main Express app.
 */
const initialize = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
};

module.exports.initialize = initialize;
