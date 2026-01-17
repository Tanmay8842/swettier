import { auth, onAuthStateChanged } from "./firebase-auth.js";

window.currentUser = null;

onAuthStateChanged(auth, (user) => {
  window.currentUser = user;
});
