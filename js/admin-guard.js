
import { auth, onAuthStateChanged } from "./firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user || user.email !== "admin@shwetattire.com") {
    window.location.href = "../login.html";
  }
});
