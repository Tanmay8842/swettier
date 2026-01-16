// Utility functions for the application

// Get data from localStorage or return default
function getStorageData(key, defaultValue = []) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
}

// Save data to localStorage
function saveStorageData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Get current user from localStorage
function getCurrentUser() {
  return getStorageData('currentUser', null);
}

// Set current user in localStorage
function setCurrentUser(user) {
  if (user) {
    saveStorageData('currentUser', user);
  } else {
    localStorage.removeItem('currentUser');
  }
}

// Check if user is logged in
function isLoggedIn() {
  return getCurrentUser() !== null;
}

// Check if user is admin
function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Get all products
function getAllProducts() {
  return getStorageData('products', []);
}

// Get product by ID
function getProductById(id) {
  const products = getAllProducts();
  return products.find(p => p.id === parseInt(id));
}

// Update product
function updateProduct(productId, updates) {
  const products = getAllProducts();
  const index = products.findIndex(p => p.id === parseInt(productId));
  if (index !== -1) {
    products[index] = { ...products[index], ...updates };
    saveStorageData('products', products);
    return true;
  }
  return false;
}

// Add new product
function addProduct(product) {
  const products = getAllProducts();
  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
  const newProduct = { ...product, id: newId };
  products.push(newProduct);
  saveStorageData('products', products);
  return newProduct;
}

// Delete product
function deleteProduct(productId) {
  const products = getAllProducts();
  const filtered = products.filter(p => p.id !== parseInt(productId));
  saveStorageData('products', filtered);
  return filtered.length < products.length;
}

// Get all users
function getAllUsers() {
  return getStorageData('users', []);
}

// Get user by email
function getUserByEmail(email) {
  const users = getAllUsers();
  return users.find(u => u.email === email);
}

// Add new user
function addUser(user) {
  const users = getAllUsers();
  const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const newUser = { ...user, id: newId };
  users.push(newUser);
  saveStorageData('users', users);
  return newUser;
}

// Get all orders
function getAllOrders() {
  return getStorageData('orders', []);
}

// Get orders by user email
function getOrdersByUser(email) {
  const orders = getAllOrders();
  return orders.filter(o => o.userEmail === email);
}

// Add new order
function addOrder(order) {
  const orders = getAllOrders();
  const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
  const newOrder = { ...order, id: newId, createdAt: new Date().toISOString() };
  orders.push(newOrder);
  saveStorageData('orders', orders);
  
  // Update product stock
  order.items.forEach(item => {
    const product = getProductById(item.productId);
    if (product) {
      updateProduct(item.productId, { stock: product.stock - item.quantity });
    }
  });
  
  return newOrder;
}

// Update order status
function updateOrderStatus(orderId, status) {
  const orders = getAllOrders();
  const index = orders.findIndex(o => o.id === parseInt(orderId));
  if (index !== -1) {
    orders[index].status = status;
    saveStorageData('orders', orders);
    return true;
  }
  return false;
}

// Get cart from localStorage
function getCart() {
  return getStorageData('cart', []);
}

// Save cart to localStorage
function saveCart(cart) {
  saveStorageData('cart', cart);
}

// Get cart count
function getCartCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Get wishlist from localStorage
function getWishlist() {
  return getStorageData('wishlist', []);
}

// Save wishlist to localStorage
function saveWishlist(wishlist) {
  saveStorageData('wishlist', wishlist);
}

// Show notification
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => notification.classList.add('show'), 100);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Redirect to page
function redirectTo(url) {
  window.location.href = url;
}

// Protect admin routes
function protectAdminRoute() {
  if (!isLoggedIn() || !isAdmin()) {
    redirectTo('admin/admin-login.html');
    return false;
  }
  return true;
}

// Protect user routes
function protectUserRoute() {
  if (!isLoggedIn()) {
    redirectTo('login.html');
    return false;
  }
  return true;
}

