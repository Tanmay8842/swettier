import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwhQHRRLJcmfwp9a_Ig3Bimio-Vn-Ux74",
  authDomain: "shwetattire.firebaseapp.com",
  projectId: "shwetattire",
  storageBucket: "shwetattire.firebasestorage.app",
  messagingSenderId: "54784437530",
  appId: "1:54784437530:web:11b321e871a8b1a86410a3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// EXPORTS
export {
  db,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp
};
