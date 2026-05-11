import React, { useState, useEffect } from 'react';
import { getBanners, createBanner, updateBanner, deleteBanner, getBannerImageUrl } from '../services/bannerService';
import { Image, Plus, Pencil, Trash2, X, Eye, EyeOff, GripVertical } from 'lucide-react';

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '', subtitle: '', linkUrl: '', displayOrder: 0, active: true,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ─── FETCH BANNERS ──────────────────────────────────────────────────────
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await getBanners();
      setBanners(data);
    } catch (error) {
      console.error('Lỗi khi tải banner:', error);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  // ─── OPEN MODAL ─────────────────────────────────────────────────────────
  const openCreateModal = () => {
    setEditingBanner(null);
    setFormData({ title: '', subtitle: '', linkUrl: '', displayOrder: 0, active: true });
    setSelectedFile(null);
    setPreviewUrl('');
    setShowModal(true);
  };

  const openEditModal = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      linkUrl: banner.linkUrl || '',
      displayOrder: banner.displayOrder || 0,
      active: banner.active !== false,
    });
    setSelectedFile(null);
    setPreviewUrl(getBannerImageUrl(banner.imageUrl));
    setShowModal(true);
  };

  // ─── FILE SELECT & PREVIEW ─────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ─── SUBMIT ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      if (selectedFile) data.append('file', selectedFile);
      data.append('title', formData.title);
      if (formData.subtitle) data.append('subtitle', formData.subtitle);
      if (formData.linkUrl) data.append('linkUrl', formData.linkUrl);
      data.append('displayOrder', formData.displayOrder);
      data.append('active', formData.active);

      if (editingBanner) {
        await updateBanner(editingBanner.id, data);
      } else {
        await createBanner(data);
      }

      setShowModal(false);
      fetchBanners();
    } catch (error) {
      console.error('Lỗi khi lưu banner:', error);
      alert('Lỗi khi lưu banner!');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── DELETE ─────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa banner này?')) return;
    try {
      await deleteBanner(id);
      fetchBanners();
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      alert('Lỗi khi xóa banner!');
    }
  };

  // ─── RENDER ─────────────────────────────────────────────────────────────
  return (
    <div className="flex-1">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Banner</h1>
          <p className="text-gray-500 mt-1">Quản lý hình ảnh hiển thị trên trang chủ</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Thêm Banner
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400">Chưa có banner nào</h3>
          <p className="text-gray-400 mt-1">Hãy thêm banner đầu tiên cho trang chủ</p>
        </div>
      ) : (
        /* Banner Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                {banner.imageUrl ? (
                  <img
                    src={getBannerImageUrl(banner.imageUrl)}
                    alt={banner.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-12 h-12 text-gray-300" />
                  </div>
                )}

                {/* Status badge */}
                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${
                  banner.active
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-400 text-white'
                }`}>
                  {banner.active ? (
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Active</span>
                  ) : (
                    <span className="flex items-center gap-1"><EyeOff className="w-3 h-3" /> Hidden</span>
                  )}
                </div>

                {/* Order badge */}
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <GripVertical className="w-3 h-3" />
                  #{banner.displayOrder}
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">{banner.title || '(Chưa có tiêu đề)'}</h3>
                <p className="text-gray-400 text-sm truncate">{banner.subtitle || '—'}</p>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                  <button
                    onClick={() => openEditModal(banner)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors"
                  >
                    <Pencil className="w-4 h-4" /> Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="flex items-center justify-center gap-1.5 bg-red-50 text-red-500 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══ MODAL CREATE/EDIT ═══ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                {editingBanner ? 'Sửa Banner' : 'Thêm Banner Mới'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ảnh Banner *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 border border-gray-200 rounded-lg cursor-pointer"
                  required={!editingBanner}
                />
                {/* Preview */}
                {previewUrl && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-gray-200">
                    <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tiêu đề *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                  placeholder="VD: Xe Điện Mùa Hè 2026"
                  required
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phụ đề</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                  placeholder="VD: Giảm giá đến 30%"
                />
              </div>

              {/* Link URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Link URL</label>
                <input
                  type="text"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                  placeholder="VD: /product/1"
                />
              </div>

              {/* Display Order + Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Thứ tự hiển thị</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
                  <select
                    value={formData.active ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, active: e.target.value === 'true' })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="true">🟢 Active</option>
                    <option value="false">⚫ Hidden</option>
                  </select>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Đang lưu...' : editingBanner ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banners;
