// Static category data
// TODO: Replace this static data with Django API call
// fetch("http://127.0.0.1:8000/api/categories/")

const CATEGORIES_DATA = [
  { id: 1, name: "Sarees", icon: "👗" },
  { id: 2, name: "Lehengas", icon: "✨" },
  { id: 3, name: "Kurtis", icon: "👕" },
  { id: 4, name: "Suits", icon: "👔" },
  { id: 5, name: "Gowns", icon: "👠" }
];

// Initialize categories in localStorage if not present
if (!localStorage.getItem('categories')) {
  localStorage.setItem('categories', JSON.stringify(CATEGORIES_DATA));
}

