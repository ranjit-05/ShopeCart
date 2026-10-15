import axios from 'axios';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://shopkart-api-nqn1.onrender.com' : 'http://localhost:5000'),
  withCredentials: true,
});

export const getWishlist = () => api.get('/wishlist');
export const getWishlistCount = () => api.get('/wishlist/count');
export const toggleWishlistItem = (productId) => api.patch(`/wishlist/${productId}/toggle`);
export const removeWishlistItem = (productId) => api.delete(`/wishlist/${productId}`);

export const fetchCartApi = () => api.get('/cart');
export const addToCartApi = (productId) => api.post(`/cart/${productId}`);
export const updateQuantityApi = (productId, quantity) => api.patch(`/cart/${productId}`, { quantity });
export const removeFromCartApi = (productId) => api.delete(`/cart/${productId}`);

export const createPaymentOrderApi = (shippingAddress) => api.post('/orders/create-payment-order', { shippingAddress });
export const verifyPaymentApi = (paymentData) => api.post('/orders/verify-payment', paymentData);
export const paymentFailedApi = (data) => api.post('/orders/payment-failed', data);
export const getOrdersApi = () => api.get('/orders');
export const getOrderByIdApi = (id) => api.get(`/orders/${id}`);
export const updateOrderStatusApi = (id, status) => api.patch(`/orders/${id}/status`, { status });

export default api;
