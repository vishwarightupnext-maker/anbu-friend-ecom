// API Helper for Backend Communication

const BASE_URL = import.meta.env.VITE_API_URL || 'https://anbu-friend-ecom.onrender.com/api';

export const fetchProducts = async (category = '') => {
  try {
    const url = category ? `${BASE_URL}/products?category=${encodeURIComponent(category)}` : `${BASE_URL}/products`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  } catch (err) {
    console.error('API Error fetchProducts:', err);
    throw err;
  }
};

export const fetchProductById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return await res.json();
  } catch (err) {
    console.error('API Error fetchProductById:', err);
    throw err;
  }
};

export const createDigitalProduct = async (productData) => {
  try {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error('Failed to create digital product');
    return await res.json();
  } catch (err) {
    console.error('API Error createDigitalProduct:', err);
    throw err;
  }
};

export const getPaymentConfig = async () => {
  try {
    const res = await fetch(`${BASE_URL}/payment/config`);
    if (!res.ok) throw new Error('Failed to get payment config');
    return await res.json();
  } catch (err) {
    return { keyId: '', isSimulated: true };
  }
};

export const createPaymentOrder = async ({ amount, customerDetails, orderItems }) => {
  try {
    const res = await fetch(`${BASE_URL}/payment/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, customerDetails, orderItems }),
    });
    if (!res.ok) throw new Error('Failed to initiate payment');
    return await res.json();
  } catch (err) {
    console.error('API Error createPaymentOrder:', err);
    throw err;
  }
};

export const verifyPayment = async (verificationData) => {
  try {
    const res = await fetch(`${BASE_URL}/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(verificationData),
    });
    if (!res.ok) throw new Error('Payment verification failed');
    return await res.json();
  } catch (err) {
    console.error('API Error verifyPayment:', err);
    throw err;
  }
};

export const fetchOrders = async () => {
  try {
    const res = await fetch(`${BASE_URL}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json();
  } catch (err) {
    console.error('API Error fetchOrders:', err);
    return [];
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return await res.json();
  } catch (err) {
    console.error('API Error updateProduct:', err);
    throw err;
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return await res.json();
  } catch (err) {
    console.error('API Error deleteProduct:', err);
    throw err;
  }
};

export const uploadToCloudinary = async (fileData, fileType, fileName) => {
  try {
    const res = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: fileData, fileType, fileName }),
    });
    if (!res.ok) throw new Error('Cloudinary direct upload failed');
    return await res.json();
  } catch (err) {
    console.error('API Error uploadToCloudinary:', err);
    throw err;
  }
};

export const adminLogin = async (username, password) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Invalid admin credentials');
    return data;
  } catch (err) {
    console.error('API Error adminLogin:', err);
    throw err;
  }
};

export const getDownloadUrl = (productId) => {
  return `${BASE_URL}/products/${productId}/download`;
};
