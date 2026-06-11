import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';

const API_URL = '/discounts';

const Discounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrderAmount: '',
    startDate: '',
    endDate: '',
    active: true
  });

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await api.get(API_URL);
      setDiscounts(response.data);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`${API_URL}/${formData.id}`, formData);
      } else {
        await api.post(API_URL, formData);
      }
      setShowModal(false);
      fetchDiscounts();
      setFormData({
        id: null,
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        minOrderAmount: '',
        startDate: '',
        endDate: '',
        active: true
      });
    } catch (error) {
      console.error('Error saving discount:', error);
      alert('Có lỗi xảy ra khi lưu mã giảm giá');
    }
  };

  const handleEdit = (discount) => {
    setFormData({
      ...discount,
      minOrderAmount: discount.minOrderAmount || '',
      startDate: discount.startDate || '',
      endDate: discount.endDate || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) {
      try {
        await api.delete(`${API_URL}/${id}`);
        fetchDiscounts();
      } catch (error) {
        console.error('Error deleting discount:', error);
        alert('Có lỗi xảy ra khi xóa mã giảm giá');
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Quản lý Mã giảm giá</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm mã mới
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
              <th className="p-4 font-semibold">Mã</th>
              <th className="p-4 font-semibold">Loại</th>
              <th className="p-4 font-semibold">Giá trị</th>
              <th className="p-4 font-semibold">Tối thiểu</th>
              <th className="p-4 font-semibold">Ngày bắt đầu</th>
              <th className="p-4 font-semibold">Ngày kết thúc</th>
              <th className="p-4 font-semibold">Trạng thái</th>
              <th className="p-4 font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {discounts.map((discount) => (
              <tr key={discount.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300">
                <td className="p-4 font-medium">{discount.code}</td>
                <td className="p-4">{discount.discountType === 'PERCENTAGE' ? 'Phần trăm' : 'Cố định'}</td>
                <td className="p-4">
                  {discount.discountType === 'PERCENTAGE' 
                    ? `${discount.discountValue}%` 
                    : `${Number(discount.discountValue).toLocaleString()}đ`}
                </td>
                <td className="p-4">{discount.minOrderAmount ? `${Number(discount.minOrderAmount).toLocaleString()}đ` : 'Không'}</td>
                <td className="p-4">{discount.startDate || '-'}</td>
                <td className="p-4">{discount.endDate || '-'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${discount.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {discount.active ? 'Hoạt động' : 'Vô hiệu'}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => handleEdit(discount)} className="p-1 text-blue-600 hover:text-blue-800">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(discount.id)} className="p-1 text-red-600 hover:text-red-800">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              {formData.id ? 'Sửa Mã giảm giá' : 'Thêm Mã giảm giá'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mã giảm giá</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Loại</label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="PERCENTAGE">Phần trăm (%)</option>
                    <option value="FIXED">Cố định (VND)</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Giá trị</label>
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Đơn hàng tối thiểu (Tùy chọn)</label>
                <input
                  type="number"
                  name="minOrderAmount"
                  value={formData.minOrderAmount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Từ ngày</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Đến ngày</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                  id="activeCheckbox"
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="activeCheckbox" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Hoạt động
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discounts;
