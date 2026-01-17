import { auth, onAuthStateChanged } from "./firebase-auth.js";

export function requireAuth(redirect = "login.html") {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = redirect;
      } else {
        resolve(user);
      }
    });
  });
}
