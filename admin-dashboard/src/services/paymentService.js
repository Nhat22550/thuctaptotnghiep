import api from './api';

export const getPayments = async () => {
  const response = await api.get('/payments');
  return response.data;
};

export const getPaymentById = async (id) => {
  const response = await api.get(`/payments/${id}`);
  return response.data;
};

export const createPayment = async (payment) => {
  const response = await api.post('/payments', payment);
  return response.data;
};

export const updatePayment = async (id, payment) => {
  const response = await api.put(`/payments/${id}`, payment);
  return response.data;
};

export const deletePayment = async (id) => {
  const response = await api.delete(`/payments/${id}`);
  return response.data;
};

// ─── XÁC THỰC KẾT QUẢ THANH TOÁN VNPAY ──────────────────────────────────────
// queryString: chuỗi query từ URL VNPay trả về (ví dụ: "vnp_Amount=...&vnp_ResponseCode=00&...")
export const verifyVnpayReturn = async (queryString) => {
  const response = await api.get(`/payment/vnpay_return?${queryString}`);
  return response.data;
};
