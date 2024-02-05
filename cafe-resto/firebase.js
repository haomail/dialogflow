const admin = require("firebase-admin");
const serviceAccount = require("./firebase-admin-sdk-eatbuddy.json");

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Connected to DB");
} catch (error) {
  console.log("Error here" + error);
}

const db = admin.firestore();

module.exports = { admin, db };
