const API_BASE = "http://127.0.0.1:8000/api";

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products/`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return await res.json();
}

export async function fetchProductById(id) {
  const res = await fetch(`${API_BASE}/products/${id}/`);
  if (!res.ok) throw new Error("Product not found");
  return await res.json();
}
