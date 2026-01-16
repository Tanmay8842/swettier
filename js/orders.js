// Order management functions
// TODO: Replace with Django API calls
// fetch("http://127.0.0.1:8000/api/orders/", { method: 'POST', ... })

function placeOrder() {
  const user = getCurrentUser();
  if (!user) {
    showNotification('Please login to place an order', 'error');
    redirectTo('login.html');
    return false;
  }
  
  const cart = getCart();
  if (cart.length === 0) {
    showNotification('Your cart is empty', 'error');
    return false;
  }
  
  // Validate stock before placing order
  for (const item of cart) {
    const product = getProductById(item.productId);
    if (!product || product.stock < item.quantity) {
      showNotification(`${product ? product.name : 'Product'} is out of stock`, 'error');
      return false;
    }
  }
  
  const totalAmount = getCartTotal();
  const order = {
    userEmail: user.email,
    items: cart.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price
    })),
    totalAmount: totalAmount,
    status: 'Pending'
  };
  
  const newOrder = addOrder(order);
  clearCart();
  showNotification('Order placed successfully!', 'success');
  redirectTo('orders.html');
  return newOrder;
}

function getUserOrders() {
  const user = getCurrentUser();
  if (!user) return [];
  return getOrdersByUser(user.email);
}

function getAllOrdersForAdmin() {
  return getAllOrders();
}

function updateOrderStatusForAdmin(orderId, newStatus) {
  const success = updateOrderStatus(orderId, newStatus);
  if (success) {
    showNotification('Order status updated', 'success');
  } else {
    showNotification('Failed to update order status', 'error');
  }
  return success;
}

