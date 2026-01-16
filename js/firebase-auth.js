// js/firebase-auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

// Firebase configuration (YOUR CONFIG)
const firebaseConfig = {
  apiKey: "AIzaSyAwhQHRRLJcmfwp9a_Ig3Bimio-Vn-Ux74",
  authDomain: "shwetattire.firebaseapp.com",
  projectId: "shwetattire",
  storageBucket: "shwetattire.firebasestorage.app",
  messagingSenderId: "54784437530",
  appId: "1:54784437530:web:11b321e871a8b1a86410a3",
  measurementId: "G-6736835S46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// EXPORT everything we need
export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};
