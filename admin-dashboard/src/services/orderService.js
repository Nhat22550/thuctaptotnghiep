import api from './api';

export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const getOrdersByUserId = async (userId) => {
  const response = await api.get(`/orders/user/${userId}`);
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const createOrder = async (order) => {
  const response = await api.post('/orders', order);
  return response.data;
};

export const updateOrder = async (id, order) => {
  const response = await api.put(`/orders/${id}`, order);
  return response.data;
};

// Force Vite HMR reload
export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/orders/${id}/status`, null, { params: { status } });
  return response.data;
};

export const downloadInvoice = async (id) => {
  const response = await api.get(`/orders/${id}/invoice`, { responseType: 'blob' });
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};
