// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhw7Dcy1epd2gIXaD7p72TWfls6XwiSt4",
  authDomain: "l3-course-materials.firebaseapp.com",
  projectId: "l3-course-materials",
  storageBucket: "l3-course-materials.firebasestorage.app",
  messagingSenderId: "556540148057",
  appId: "1:556540148057:web:e25246b60743ac74bbf448",
  measurementId: "G-2F936QGBVG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
