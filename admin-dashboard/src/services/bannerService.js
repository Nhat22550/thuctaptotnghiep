import api from './api';

const BACKEND_URL = 'http://localhost:8900';

// ─── LẤY TẤT CẢ BANNER (Admin) ──────────────────────────────────────────────
export const getBanners = async () => {
    const response = await api.get('/banners');
    return response.data;
};

// ─── LẤY BANNER ACTIVE (User Frontend) ───────────────────────────────────────
export const getActiveBanners = async () => {
    const response = await api.get('/banners/active');
    return response.data;
};

// ─── LẤY BANNER THEO ID ──────────────────────────────────────────────────────
export const getBannerById = async (id) => {
    const response = await api.get(`/banners/${id}`);
    return response.data;
};

// ─── THÊM BANNER (multipart) ─────────────────────────────────────────────────
export const createBanner = async (formData) => {
    const response = await api.post('/banners', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// ─── CẬP NHẬT BANNER (multipart) ─────────────────────────────────────────────
export const updateBanner = async (id, formData) => {
    const response = await api.put(`/banners/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// ─── XÓA BANNER ──────────────────────────────────────────────────────────────
export const deleteBanner = async (id) => {
    const response = await api.delete(`/banners/${id}`);
    return response.data;
};

// ─── HELPER: Tạo URL ảnh đầy đủ ──────────────────────────────────────────────
export const getBannerImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    // Nếu đã có domain đầy đủ → trả luôn
    if (imageUrl.startsWith('http')) return imageUrl;
    // Nối domain backend vào đường dẫn tương đối
    return BACKEND_URL + imageUrl;
};
