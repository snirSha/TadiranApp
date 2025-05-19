import admin from "firebase-admin";
import dotenv from 'dotenv';
dotenv.config();

//For updating admin and mobile records when there is a change
const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://tadirantask.firebaseio.com"
});

const db = admin.firestore();
export default db;