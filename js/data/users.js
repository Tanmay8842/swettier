// Static user data
// TODO: Replace this static data with Django API call
// fetch("http://127.0.0.1:8000/api/users/")

const USERS_DATA = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@shwetattire.com",
    password: "admin123", // In production, this should be hashed
    role: "admin"
  },
  {
    id: 2,
    name: "Test User",
    email: "user@test.com",
    password: "user123", // In production, this should be hashed
    role: "user"
  }
];

// Initialize users in localStorage if not present
if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify(USERS_DATA));
}

