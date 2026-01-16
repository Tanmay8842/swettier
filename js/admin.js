/* ================================
   FIRESTORE IMPORT (NEW)
================================ */

import {
  db,
  collection,
  addDoc,
  serverTimestamp
} from "./firebase-db.js";

/* ================================
   ADMIN DASHBOARD
================================ */

function initializeAdminDashboard() {
  displayAdminStats();
}

function displayAdminStats() {
  const orders = getAllOrders();
  const users = getAllUsers();
  const products = getAllProducts();

  const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;
  const totalUsers = users.filter(u => u.role === 'user').length;
  const lowStockProducts = products.filter(p => p.stock < 5);

  const statsContainer = document.getElementById('admin-stats');
  if (!statsContainer) return;

  statsContainer.innerHTML = `
    <div class="stat-card">
      <div class="stat-icon">💰</div>
      <div class="stat-info">
        <h3>Total Sales</h3>
        <p class="stat-value">${formatCurrency(totalSales)}</p>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">📦</div>
      <div class="stat-info">
        <h3>Total Orders</h3>
        <p class="stat-value">${totalOrders}</p>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">👥</div>
      <div class="stat-info">
        <h3>Total Users</h3>
        <p class="stat-value">${totalUsers}</p>
      </div>
    </div>
    <div class="stat-card ${lowStockProducts.length > 0 ? 'stat-warning' : ''}">
      <div class="stat-icon">⚠️</div>
      <div class="stat-info">
        <h3>Low Stock Items</h3>
        <p class="stat-value">${lowStockProducts.length}</p>
      </div>
    </div>
  `;

  if (lowStockProducts.length > 0) {
    displayLowStockAlert(lowStockProducts);
  }
}

function displayLowStockAlert(products) {
  const alertContainer = document.getElementById('low-stock-alert');
  if (!alertContainer) return;

  alertContainer.innerHTML = `
    <div class="alert alert-warning">
      <h3>⚠️ Low Stock Alert</h3>
      <ul>
        ${products.map(p => `<li>${p.name} - Only ${p.stock} left</li>`).join('')}
      </ul>
    </div>
  `;
}

/* ================================
   PRODUCTS
================================ */

function initializeAdminProducts() {
  displayAdminProducts();
}

function displayAdminProducts() {
  const products = getAllProducts();
  const container = document.getElementById('admin-products-container');
  if (!container) return;

  container.innerHTML = products.map(product => `
    <div class="admin-product-card">
      <div class="admin-product-image">
        <img src="${product.image}" alt="${product.name}"
             onerror="this.src='https://via.placeholder.com/150x200?text=Product'">
      </div>
      <div class="admin-product-info">
        <h3>${product.name}</h3>
        <p><strong>Category:</strong> ${product.category}</p>
        <p><strong>Price:</strong> ${formatCurrency(product.price)}</p>
        <p><strong>Stock:</strong>
          <span class="${product.stock < 5 ? 'low-stock-text' : ''}">
            ${product.stock}
          </span>
        </p>
      </div>
      <div class="admin-product-actions">
        <button onclick="editProduct(${product.id})" class="btn btn-primary">Edit</button>
        <button onclick="deleteProductAdmin(${product.id})" class="btn btn-danger">Delete</button>
      </div>
    </div>
  `).join('');
}

function editProduct(productId) {
  window.location.href = `add-product.html?id=${productId}`;
}

function deleteProductAdmin(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  const success = deleteProduct(productId);
  if (success) {
    showNotification('Product deleted successfully', 'success');
    displayAdminProducts();
  } else {
    showNotification('Failed to delete product', 'error');
  }
}

/* ================================
   ADD / EDIT PRODUCT
================================ */

function initializeAddProduct() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (productId) {
    const product = getProductById(productId);
    if (product) {
      populateProductForm(product);
    }
  }

  const form = document.getElementById('product-form');
  if (form) {
    form.addEventListener('submit', handleProductSubmit);
  }
}

function populateProductForm(product) {
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-description').value = product.description;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-stock').value = product.stock;
  document.getElementById('product-category').value = product.category;
  document.getElementById('product-image').value = product.image;
}

/* ================================
   🔥 FIRESTORE ADD PRODUCT (NEW)
================================ */

async function addProduct(productData) {
  try {
    await addDoc(collection(db, "products"), {
      ...productData,
      createdAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Firestore error:", error);
    return false;
  }
}

function handleProductSubmit(e) {
  e.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  const productData = {
    name: document.getElementById('product-name').value,
    description: document.getElementById('product-description').value,
    price: parseFloat(document.getElementById('product-price').value),
    stock: parseInt(document.getElementById('product-stock').value),
    category: document.getElementById('product-category').value,
    image: document.getElementById('product-image').value
  };

  if (productId) {
    updateProduct(productId, productData);
    showNotification('Product updated successfully', 'success');
  } else {
    addProduct(productData);
    showNotification('Product added successfully', 'success');
  }

  window.location.href = 'products.html';
}

/* ================================
   ORDERS
================================ */

function initializeAdminOrders() {
  displayAdminOrders();
}

function displayAdminOrders() {
  const orders = getAllOrders();
  const container = document.getElementById('admin-orders-container');
  if (!container) return;

  if (orders.length === 0) {
    container.innerHTML = '<p class="no-orders">No orders yet</p>';
    return;
  }

  container.innerHTML = orders.map(order => `
    <div class="admin-order-card">
      <h3>Order #${order.id}</h3>
      <p><strong>Status:</strong> ${order.status}</p>
      <select onchange="updateOrderStatusAdmin(${order.id}, this.value)">
        ${['Pending','Packed','Shipped','Delivered'].map(s =>
          `<option value="${s}" ${s === order.status ? 'selected' : ''}>${s}</option>`
        ).join('')}
      </select>
      <strong>Total: ${formatCurrency(order.totalAmount)}</strong>
    </div>
  `).join('');
}

function updateOrderStatusAdmin(orderId, newStatus) {
  updateOrderStatusForAdmin(orderId, newStatus);
  displayAdminOrders();
}

/* ================================
   ANALYTICS
================================ */

function initializeAdminAnalytics() {
  displayAdminAnalytics();
}

function displayAdminAnalytics() {
  const orders = getAllOrders();
  const users = getAllUsers();
  const products = getAllProducts();

  const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  const container = document.getElementById('analytics-container');
  if (!container) return;

  container.innerHTML = `
    <div class="analytics-card">Total Sales: ${formatCurrency(totalSales)}</div>
    <div class="analytics-card">Total Orders: ${orders.length}</div>
    <div class="analytics-card">Total Users: ${users.length}</div>
    <div class="analytics-card">Total Products: ${products.length}</div>
  `;
}

/* ================================
   GLOBAL EXPORTS
================================ */

window.editProduct = editProduct;
window.deleteProductAdmin = deleteProductAdmin;
window.updateOrderStatusAdmin = updateOrderStatusAdmin;
