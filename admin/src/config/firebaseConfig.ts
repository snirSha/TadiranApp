import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
//Future fix - firebase configuration for updating the warranty list from backend to admin and from admin to backend
const firebaseConfig = {
    apiKey: "AIzaSyB3cdO1s0J_qHtJdUMo0I0VjR2KLEIHPUo",
    authDomain: "tadirantask.firebaseapp.com",
    projectId: "tadirantask",
    storageBucket: "tadirantask.appspot.com",
    messagingSenderId: "407914889240",
    appId: "1:407914889240:web:a373d377587cbcab5ec36d",
    measurementId: "G-GC2KZHRTFP"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
