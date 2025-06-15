var admin = require("firebase-admin");

var serviceAccount = require("../../cinema-book-5d937-firebase-adminsdk-j5wi7-9f67da28b5.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://cinema-book-5d937.appspot.com",
});

const bucket = admin.storage().bucket();

module.exports = bucket;
