const admin = require("firebase-admin");
const serviceAccount = require("../../constants/firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotification = async (data) => {
  const { tokens, title, body, imageUrl } = data;

  await admin.messaging().sendMulticast({
    tokens,
    notification: {
      title,
      body,
      imageUrl,
    },
  });
};

sendNotification({
  tokens: [
    "eJySPaoPRqKiG_2cEh-mIU:APA91bELf0Xe4mZkfvPKPJ6bqmj6MJD4fEA7zjGxrbfGaYps3Kj6hKRBuqu8Fh1SEbI6AQyxT9Xl8lid4Ajpwl1xv0BnnC6Ok0AOeRLbaF_dYDERRfsQDkto8NiAaELWOfsVp9ghRWUK",
  ],
  title: "¡No Dejes Que Se Te Escape!",
  body: `"Chentao" tiene una promoción`,
});
