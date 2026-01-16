

// Cart management functions
async function addToCart(productId) {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/products/cart/${productId}/`
    );

    if (!response.ok) {
      throw new Error("Product not found");
    }

    const product = await response.json();

    let cart = getCart();

    const existing = cart.find(item => item.productId === product.id);

    if (existing) {
      if (existing.quantity < product.stock) {
        existing.quantity += 1;
      } else {
        showNotification("No more stock available", "error");
        return;
      }
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,   // 🔐 BACKEND PRICE
        image: product.image,
        quantity: 1
      });
    }

    saveCart(cart);
    updateCartCount();
    showNotification("Added to cart", "success");

  } catch (error) {
    console.error(error);
    showNotification("Failed to add product", "error");
  }
}


function removeFromCart(productId) {
  const cart = getCart();
  const filtered = cart.filter(item => item.productId !== parseInt(productId));
  saveCart(filtered);
  updateCartCount();
  showNotification('Product removed from cart', 'success');
  // Refresh cart display if on cart page
  if (window.displayCart) window.displayCart();
}

function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(item => item.productId === parseInt(productId));
  const product = getProductById(productId);
  
  if (!item || !product) return false;
  
  if (quantity <= 0) {
    removeFromCart(productId);
    // Refresh cart display if on cart page
    if (window.displayCart) window.displayCart();
    return true;
  }
  
  if (quantity > product.stock) {
    showNotification('Insufficient stock available', 'error');
    return false;
  }
  
  item.quantity = quantity;
  saveCart(cart);
  updateCartCount();
  // Refresh cart display if on cart page
  if (window.displayCart) window.displayCart();
  return true;
}

function clearCart() {
  saveCart([]);
  updateCartCount();
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => {
    const product = getProductById(item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
}

function updateCartCount() {
  const count = getCartCount();
  const cartCountElements = document.querySelectorAll('.cart-count');
  cartCountElements.forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'inline-block' : 'none';
  });
}

// Make cart functions globally accessible
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;

