import api from './api';

// ─── LẤY DANH SÁCH SẢN PHẨM (hỗ trợ lọc theo khoảng giá) ──────────────────
export const getProducts = async (minPrice = null, maxPrice = null) => {
    const params = {};
    if (minPrice !== null) params.minPrice = minPrice;
    if (maxPrice !== null) params.maxPrice = maxPrice;

    const response = await api.get('/products', { params });
    // Hỗ trợ cả trường hợp Backend trả về trực tiếp mảng hoặc bọc trong object (data/content)
    if (response.data && Array.isArray(response.data)) {
        return response.data;
    }
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
    }
    if (response.data && response.data.content && Array.isArray(response.data.content)) {
        return response.data.content;
    }
    return response.data || [];
};

// ─── LẤY CHI TIẾT 1 SẢN PHẨM THEO ID ────────────────────────────────────────
export const getProductById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

// ─── THÊM SẢN PHẨM (JSON) ────────────────────────────────────────────────────
export const createProduct = async (product) => {
    const response = await api.post('/products', product);
    return response.data;
};

// ─── THÊM SẢN PHẨM KÈM ẢNH (multipart) ──────────────────────────────────────
export const addProductWithImage = async (formData) => {
    const response = await api.post('/products/add-with-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// ─── CẬP NHẬT SẢN PHẨM KÈM ẢNH (multipart) ─────────────────────────────────
export const updateProductWithImage = async (id, formData) => {
    const response = await api.put(`/products/${id}/with-image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// ─── CẬP NHẬT SẢN PHẨM (JSON) ───────────────────────────────────────────────
export const updateProduct = async (id, product) => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
};

// ─── XÓA SẢN PHẨM ────────────────────────────────────────────────────────────
export const deleteProduct = async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
};
