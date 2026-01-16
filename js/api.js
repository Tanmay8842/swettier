const API_BASE_URL = "http://127.0.0.1:8000/api";

// Get all products
async function fetchProducts() {
  const response = await fetch(`${API_BASE_URL}/products/`);
  if (!response.ok) throw new Error("Failed to load products");
  return await response.json();
}

// Get single product
async function fetchProductById(id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}/`);
  if (!response.ok) throw new Error("Failed to load product");
  return await response.json();
}
