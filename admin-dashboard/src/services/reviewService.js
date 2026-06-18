import api from './api';

export const getReviews = async (productName = '') => {
  const url = productName ? `/review/recommendations?name=${productName}` : '/review/recommendations';
  const response = await api.get(url);
  return response.data;
};

export const getReviewsByProductId = async (productId) => {
  const response = await api.get(`/review/recommendations/product/${productId}`);
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await api.delete(`/review/recommendations/${id}`);
  return response.data;
};

export const createReview = async (userId, productId, rating, comment) => {
  const response = await api.post(`/review/${userId}/recommendations/${productId}?rating=${rating}&comment=${encodeURIComponent(comment)}`);
  return response.data;
};

export const replyReview = async (id, adminReply) => {
  const response = await api.put(`/review/recommendations/${id}/reply?adminReply=${encodeURIComponent(adminReply)}`);
  return response.data;
};
