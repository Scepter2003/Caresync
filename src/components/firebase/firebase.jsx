import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAqJY3whh6108bqoVCKeoj6vWooMjp2ZxM",
  authDomain: "care-sync.firebaseapp.com",
  projectId: "care-sync",
  storageBucket: "care-sync.appspot.com",
  messagingSenderId: "450248297340",
  appId: "1:450248297340:web:b57e2e2b4fb1435177b2f9",
  measurementId: "G-6RBNMRWDFF"
};

export function generateRandomPassword() {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
const db = getFirestore(app);
export const db1 = getDatabase(app);
export {db};