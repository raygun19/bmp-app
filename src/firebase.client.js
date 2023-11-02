// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDu44FzNuhAY8tMIVRfle1XB1cwuIHBD_A",
  authDomain: "bravo-portal.firebaseapp.com",
  projectId: "bravo-portal",
  storageBucket: "bravo-portal.appspot.com",
  messagingSenderId: "873003320572",
  appId: "1:873003320572:web:31272d935cefe3da60c379",
  measurementId: "G-63NJ0DPJJ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);