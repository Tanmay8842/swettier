// Authentication functions
// TODO: Replace with Django authentication API calls

function login(email, password) {
  const users = getAllUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Remove password before storing
    const { password: _, ...userWithoutPassword } = user;
    setCurrentUser(userWithoutPassword);
    return { success: true, user: userWithoutPassword };
  }
  
  return { success: false, message: 'Invalid email or password' };
}

function register(name, email, password) {
  const users = getAllUsers();
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'Email already registered' };
  }
  
  // Create new user
  const newUser = addUser({
    name,
    email,
    password, // In production, hash this password
    role: 'user'
  });
  
  // Auto login after registration
  const { password: _, ...userWithoutPassword } = newUser;
  setCurrentUser(userWithoutPassword);
  
  return { success: true, user: userWithoutPassword };
}

function logout() {
  setCurrentUser(null);
  redirectTo('index.html');
}

import { auth, onAuthStateChanged } from "./firebase-auth.js";

export function protectUserRoute() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "login.html";
    }
  });

  return true;
}
