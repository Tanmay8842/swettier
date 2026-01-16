import { auth, onAuthStateChanged } from "./firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Not logged in → redirect
    window.location.href = "login.html";
  } else {
    // Logged in → allow page
    console.log("User authenticated:", user.email);
  }
});