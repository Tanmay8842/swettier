const API_BASE_URL = "http://127.0.0.1:8000/api";

// Get all products
async function fetchProducts() {
  const response = await fetch(`${API_BASE_URL}/products/`);
  if (!response.ok) throw new Error("Failed to load products");
  return await response.json();
}

// Get single product


export async function fetchProductById(id) {
  const res = await fetch(`http://127.0.0.1:8000/api/products/${id}/`);
  if (!res.ok) return null;
  return await res.json();
}
