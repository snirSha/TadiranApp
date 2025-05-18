import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(fs.readFileSync("./src/config/serviceAccount.json", "utf8"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://tadirantask.firebaseio.com"
});

const db = admin.firestore();
export default db;