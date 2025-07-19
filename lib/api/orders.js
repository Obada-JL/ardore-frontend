const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.ardoreperfume.com';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
};

// Create a new order
export const createOrder = async (orderData) => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData),
  });
  return handleResponse(response);
};

// Get user's orders
export const getUserOrders = async () => {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Get single order by ID
export const getOrderById = async (orderId) => {
  const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return handleResponse(response);
};

// Get order statistics (admin only)
export const getOrderStats = async () => {
  const response = await fetch(`${API_BASE_URL}/api/orders/stats`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Delete order (admin only)
export const deleteOrder = async (orderId) => {
  const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Get products for order creation
export const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Discount API functions
export const validateDiscountCode = async (discountCode, orderAmount, productIds = []) => {
  const response = await fetch(`${API_BASE_URL}/api/discounts/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code: discountCode,
      orderAmount,
      productIds
    }),
  });
  return handleResponse(response);
};

export const applyDiscountCode = async (discountCode, userId, orderAmount, discountAmount) => {
  const response = await fetch(`${API_BASE_URL}/api/discounts/apply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code: discountCode,
      userId,
      orderAmount,
      discountAmount
    }),
  });
  return handleResponse(response);
};

export const getActiveDiscounts = async () => {
  const response = await fetch(`${API_BASE_URL}/api/discounts/active`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(response);
};

// Get user's orders count
export const getUserOrdersCount = async () => {
  const response = await fetch(`${API_BASE_URL}/api/orders/count`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}; 