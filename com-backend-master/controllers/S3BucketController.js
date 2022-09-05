/** Dependencies */
const _ = require("lodash");
const AWS = require("aws-sdk");
const { ROLES } = require("../constants");

// Configure AWS with your access and secret key.
const { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_REGION } = process.env;
const S3_BUCKET = "comundo-v1";

// Configure AWS to use promise
AWS.config.setPromisesDependency(require("bluebird"));
AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

// Create an s3 instance
const s3 = new AWS.S3();

const uploadPhoto = async (photo, bucketName, fileName) => {
  const base64Data = new Buffer.from(
    photo.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  // Getting the file type, ie: jpeg, png or gif
  const type = photo.split(";")[0].split("/")[1];

  const params = {
    Bucket: `${S3_BUCKET}/${bucketName}`,
    Key: `${fileName}.${type}`, // type is not required
    Body: base64Data,
    ACL: "public-read",
    ContentEncoding: "base64", // required
    ContentType: `image/${type}`, // required. Notice the back ticks
  };

  const { Location } = await s3.upload(params).promise();
  return Location;
};

const uploadProfilePhoto = async (req, res, roleType) => {
  const id = req.reqData.id;

  try {
    if (roleType === "salon") {
      const photos = req.reqData.photos;

      return Promise.all(
        photos.map(async (photo) => {
          const filename = Date.now();
          const Location = await uploadPhoto(
            photo,
            `${roleType}/${id}`,
            `${filename}`
          );
          return Location;
        })
      );
    } else {
      const photo = req.reqData.photo;
      const filename = Date.now();
      const Location = await uploadPhoto(
        photo,
        `${roleType}/${id}`,
        `${filename}`
      );
      return Location;
    }
  } catch (e) {
    return res.status(422).json({ message: e.message });
  }
};

const uploadPromotionPhotos = (req, res) => {
  const { photos, id } = req.reqData;

  try {
    return Promise.all(
      photos.map(async (photo, index) => {
        const filename = Date.now();
        const Location = await uploadPhoto(
          photo,
          `promotion/${id}`,
          `${filename}-${index}`
        );
        return Location;
      })
    );
  } catch (e) {
    return res.status(422).json({ message: e.message });
  }
};

module.exports = {
  uploadProfilePhoto,
  uploadPromotionPhotos,
};
