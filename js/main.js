// Main application initialization

// Initialize data on page load
document.addEventListener('DOMContentLoaded', function() {
  // Load data files (they initialize localStorage if needed)
  // Products, categories, and users are loaded via script tags
  
  // Update header based on login status
  updateHeader();
  
  // Update cart count
  updateCartCount();
  
  // Initialize page-specific functionality
  initializePage();
});

function updateHeader() {
  const user = getCurrentUser();
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const userInfo = document.getElementById('user-info');
  const adminLink = document.getElementById('admin-link');
  
  if (user) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
    if (userInfo) {
      userInfo.textContent = user.name;
      userInfo.style.display = 'inline-block';
    }
    if (adminLink && user.role === 'admin') {
      adminLink.style.display = 'inline-block';
    }
  } else {
    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (userInfo) userInfo.style.display = 'none';
    if (adminLink) adminLink.style.display = 'none';
  }
}

function initializePage() {
  const path = window.location.pathname;
  const filename = path.split('/').pop();
  
  switch(filename) {
    case 'index.html':
    case '':
      initializeHomePage();
      break;
    case 'product.html':
      initializeProductPage();
      break;
    case 'cart.html':
      initializeCartPage();
      break;
    case 'checkout.html':
      initializeCheckoutPage();
      break;
    case 'orders.html':
      initializeOrdersPage();
      break;
    case 'wishlist.html':
      initializeWishlistPage();
      break;
    case 'login.html':
      initializeLoginPage();
      break;
    case 'register.html':
      initializeRegisterPage();
      break;
  }
}

function initializeHomePage() {
  displayProducts();
  setupSearchAndFilter();
}

function displayProducts(searchTerm = '', categoryFilter = '') {
  let products = getAllProducts();
  
  // Apply search filter
  if (searchTerm) {
    products = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Apply category filter
  if (categoryFilter) {
    products = products.filter(p => p.category === categoryFilter);
  }
  
  const productsContainer = document.getElementById('products-container');
  if (!productsContainer) return;
  
  if (products.length === 0) {
    productsContainer.innerHTML = '<p class="no-products">No products found</p>';
    return;
  }
  
  productsContainer.innerHTML = products.map(product => `
    <div class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x400?text=Product+Image'">
        ${product.stock < 5 ? '<span class="low-stock-badge">Low Stock</span>' : ''}
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-category">${product.category}</p>
        <p class="product-description">${product.description.substring(0, 100)}...</p>
        <div class="product-footer">
          <span class="product-price">${formatCurrency(product.price)}</span>
          <div class="product-actions">
            <a href="product.html?id=${product.id}" class="btn btn-primary">View Details</a>
            <button onclick="addToCart(${product.id})" class="btn btn-secondary">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function setupSearchAndFilter() {
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const category = categoryFilter ? categoryFilter.value : '';
      displayProducts(e.target.value, category);
    });
  }
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', (e) => {
      const search = searchInput ? searchInput.value : '';
      displayProducts(search, e.target.value);
    });
  }
}

function initializeProductPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (!productId) {
    redirectTo('index.html');
    return;
  }
  
  const product = getProductById(productId);
  if (!product) {
    redirectTo('index.html');
    return;
  }
  
  displayProductDetails(product);
}

function displayProductDetails(product) {
  const container = document.getElementById('product-details');
  if (!container) return;
  
  container.innerHTML = `
    <div class="product-detail-image">
      <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/500x600?text=Product+Image'">
    </div>
    <div class="product-detail-info">
      <h1>${product.name}</h1>
      <p class="product-category">${product.category}</p>
      <p class="product-price-large">${formatCurrency(product.price)}</p>
      <p class="product-description-full">${product.description}</p>
      <div class="product-stock">
        <strong>Stock:</strong> ${product.stock} ${product.stock < 5 ? '<span class="low-stock">(Low Stock)</span>' : ''}
      </div>
      <div class="product-actions-large">
        <button onclick="addToCart(${product.id})" class="btn btn-primary btn-large" ${product.stock === 0 ? 'disabled' : ''}>
          ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
        <button onclick="addToWishlist(${product.id})" class="btn btn-secondary btn-large">Add to Wishlist</button>
      </div>
    </div>
  `;
}

function initializeCartPage() {
  displayCart();
}

function displayCart() {
  const cart = getCart();
  const container = document.getElementById('cart-container');
  const totalContainer = document.getElementById('cart-total');
  
  if (!container) return;
  
  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-cart">Your cart is empty. <a href="index.html">Continue Shopping</a></p>';
    if (totalContainer) totalContainer.innerHTML = '';
    return;
  }
  
  container.innerHTML = cart.map(item => {
    const product = getProductById(item.productId);
    if (!product) return '';
    
    return `
      <div class="cart-item">
        <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/100x100?text=Product'">
        <div class="cart-item-info">
          <h3>${product.name}</h3>
          <p>${product.category}</p>
          <p class="cart-item-price">${formatCurrency(item.price)}</p>
        </div>
        <div class="cart-item-quantity">
          <button onclick="updateCartQuantity(${item.productId}, ${item.quantity - 1})">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateCartQuantity(${item.productId}, ${item.quantity + 1})">+</button>
        </div>
        <div class="cart-item-total">
          ${formatCurrency(item.price * item.quantity)}
        </div>
        <button onclick="removeFromCart(${item.productId})" class="btn-remove">Remove</button>
      </div>
    `;
  }).join('');
  
  if (totalContainer) {
    const total = getCartTotal();
    totalContainer.innerHTML = `
      <div class="cart-summary">
        <h3>Order Summary</h3>
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>${formatCurrency(total)}</span>
        </div>
        <div class="summary-row">
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div class="summary-row total">
          <span>Total:</span>
          <span>${formatCurrency(total)}</span>
        </div>
        <a href="checkout.html" class="btn btn-primary btn-large btn-block">Proceed to Checkout</a>
      </div>
    `;
  }
}

// Make displayCart globally accessible
window.displayCart = displayCart;

function initializeCheckoutPage() {
  if (!protectUserRoute()) return;
  
  const user = getCurrentUser();
  const cart = getCart();
  
  if (cart.length === 0) {
    showNotification('Your cart is empty', 'error');
    redirectTo('cart.html');
    return;
  }
  
  displayCheckout(user, cart);
}

function displayCheckout(user, cart) {
  const container = document.getElementById('checkout-container');
  if (!container) return;
  
  const total = getCartTotal();
  
  container.innerHTML = `
    <div class="checkout-section">
      <h2>Shipping Information</h2>
      <div class="checkout-info">
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Address:</strong> [Address will be collected in future implementation]</p>
      </div>
    </div>
    <div class="checkout-section">
      <h2>Order Summary</h2>
      <div class="checkout-items">
        ${cart.map(item => {
          const product = getProductById(item.productId);
          return product ? `
            <div class="checkout-item">
              <span>${product.name} x ${item.quantity}</span>
              <span>${formatCurrency(item.price * item.quantity)}</span>
            </div>
          ` : '';
        }).join('')}
      </div>
      <div class="checkout-total">
        <strong>Total: ${formatCurrency(total)}</strong>
      </div>
    </div>
    <div class="checkout-actions">
      <button onclick="placeOrder()" class="btn btn-primary btn-large">Place Order</button>
      <a href="cart.html" class="btn btn-secondary">Back to Cart</a>
    </div>
  `;
}

function initializeOrdersPage() {
  if (!protectUserRoute()) return;
  
  displayUserOrders();
}

function displayUserOrders() {
  const orders = getUserOrders();
  const container = document.getElementById('orders-container');
  
  if (!container) return;
  
  if (orders.length === 0) {
    container.innerHTML = '<p class="no-orders">You have no orders yet. <a href="index.html">Start Shopping</a></p>';
    return;
  }
  
  container.innerHTML = orders.map(order => {
    const statusClass = order.status.toLowerCase().replace(' ', '-');
    return `
      <div class="order-card">
        <div class="order-header">
          <div>
            <h3>Order #${order.id}</h3>
            <p class="order-date">Placed on ${formatDate(order.createdAt)}</p>
          </div>
          <span class="order-status status-${statusClass}">${order.status}</span>
        </div>
        <div class="order-items">
          ${order.items.map(item => {
            const product = getProductById(item.productId);
            return product ? `
              <div class="order-item">
                <span>${product.name} x ${item.quantity}</span>
                <span>${formatCurrency(item.price * item.quantity)}</span>
              </div>
            ` : '';
          }).join('')}
        </div>
        <div class="order-footer">
          <strong>Total: ${formatCurrency(order.totalAmount)}</strong>
        </div>
      </div>
    `;
  }).join('');
}

function initializeWishlistPage() {
  if (!protectUserRoute()) return;
  
  displayWishlist();
}

function displayWishlist() {
  const wishlist = getWishlist();
  const container = document.getElementById('wishlist-container');
  
  if (!container) return;
  
  if (wishlist.length === 0) {
    container.innerHTML = '<p class="empty-wishlist">Your wishlist is empty. <a href="index.html">Browse Products</a></p>';
    return;
  }
  
  const products = wishlist.map(id => getProductById(id)).filter(p => p);
  
  container.innerHTML = products.map(product => `
    <div class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x400?text=Product+Image'">
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-category">${product.category}</p>
        <p class="product-price">${formatCurrency(product.price)}</p>
        <div class="product-actions">
          <a href="product.html?id=${product.id}" class="btn btn-primary">View Details</a>
          <button onclick="addToCart(${product.id})" class="btn btn-secondary">Add to Cart</button>
          <button onclick="removeFromWishlist(${product.id})" class="btn btn-danger">Remove</button>
        </div>
      </div>
    </div>
  `).join('');
}

function initializeLoginPage() {
  const form = document.getElementById('login-form');
  if (form) {
    form.addEventListener('submit', handleLogin);
  }
}

function initializeRegisterPage() {
  const form = document.getElementById('register-form');
  if (form) {
    form.addEventListener('submit', handleRegister);
  }
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  const result = login(email, password);
  if (result.success) {
    showNotification('Login successful!', 'success');
    if (result.user.role === 'admin') {
      redirectTo('admin/dashboard.html');
    } else {
      redirectTo('index.html');
    }
  } else {
    showNotification(result.message, 'error');
  }
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  
  if (password !== confirmPassword) {
    showNotification('Passwords do not match', 'error');
    return;
  }
  
  const result = register(name, email, password);
  if (result.success) {
    showNotification('Registration successful!', 'success');
    redirectTo('index.html');
  } else {
    showNotification(result.message, 'error');
  }
}

// Wishlist functions
function addToWishlist(productId) {
  if (!isLoggedIn()) {
    showNotification('Please login to add items to wishlist', 'error');
    redirectTo('login.html');
    return;
  }
  
  const wishlist = getWishlist();
  if (!wishlist.includes(parseInt(productId))) {
    wishlist.push(parseInt(productId));
    saveWishlist(wishlist);
    showNotification('Added to wishlist', 'success');
  } else {
    showNotification('Already in wishlist', 'info');
  }
}

document.addEventListener("DOMContentLoaded", loadProducts);

async function loadProducts() {
  const container = document.getElementById("products-container");
  if (!container) return;

  try {
    const products = await fetchProducts();

    if (products.length === 0) {
      container.innerHTML = "<p>No products available</p>";
      return;
    }

    container.innerHTML = products.map(product => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>₹${product.price}</p>
        <a href="product.html?id=${product.id}" class="btn">
          View Product
        </a>
      </div>
    `).join("");

  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Failed to load products</p>";
  }
}


function removeFromWishlist(productId) {
  const wishlist = getWishlist();
  const filtered = wishlist.filter(id => id !== parseInt(productId));
  saveWishlist(filtered);
  displayWishlist();
  showNotification('Removed from wishlist', 'success');
}

// Make functions globally accessible
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;
window.logout = logout;
window.placeOrder = placeOrder;

