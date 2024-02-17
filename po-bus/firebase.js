const admin = require("firebase-admin");
const serviceAccount = require("./firebase-admin-sdk-travelmate.json");

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    });
    console.log("Connected to Firebase");
} catch (error) {
    console.log("Error at" + error);
}

const db = admin.firestore();

module.exports = { admin, db };