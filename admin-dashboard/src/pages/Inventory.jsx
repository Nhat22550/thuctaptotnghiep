import React, { useState, useEffect } from 'react';
import { getProducts, addStock, deductStock } from '../services/productService';
import { Package, Plus, Minus, X, AlertCircle } from 'lucide-react';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionType, setActionType] = useState('add'); // 'add' or 'deduct'
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product, type) => {
    setSelectedProduct(product);
    setActionType(type);
    setQuantity(1);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || quantity <= 0) return;

    try {
      if (actionType === 'add') {
        await addStock(selectedProduct.id, quantity);
      } else {
        await deductStock(selectedProduct.id, quantity);
      }
      setIsModalOpen(false);
      fetchProducts(); // Refresh table
    } catch (error) {
      console.error('Error updating stock:', error);
      alert(error.response?.data || 'Có lỗi xảy ra khi cập nhật tồn kho!');
    }
  };

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Package className="w-8 h-8 text-blue-600" /> Quản lý Tồn kho
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
                <th className="py-4 px-6 w-20">ID</th>
                <th className="py-4 px-6 w-24 text-center">Hình ảnh</th>
                <th className="py-4 px-6">Tên Xe</th>
                <th className="py-4 px-6 text-center">Số lượng hiện tại</th>
                <th className="py-4 px-6 text-center">Trạng thái</th>
                <th className="py-4 px-6 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : products.map((prod) => (
                <tr key={prod.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-gray-500">{prod.id}</td>
                  <td className="py-2 px-6">
                    <div className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
                      {prod.imageUrl ? (
                        <img
                          src={prod.imageUrl && prod.imageUrl.startsWith('/uploads/') ? `${import.meta.env.VITE_IMAGE_URL || 'http://localhost:8810'}${prod.imageUrl}` : prod.imageUrl}
                          alt={prod.productName}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150?text=No+Image" }}
                        />
                      ) : (
                        <div className="text-xs text-gray-400">No Img</div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-900">{prod.productName}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`text-lg font-bold ${prod.stock <= 0 ? 'text-red-500' : 'text-blue-600'}`}>
                      {prod.stock || 0}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {prod.stock > 0 ? (
                      <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
                        Còn hàng
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold flex items-center gap-1 justify-center mx-auto w-fit">
                        <AlertCircle className="w-3 h-3" /> Hết hàng
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(prod, 'add')}
                        className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-lg transition-colors font-medium"
                        title="Nhập thêm hàng"
                      >
                        <Plus className="w-4 h-4" /> Nhập thêm
                      </button>
                      <button
                        onClick={() => handleOpenModal(prod, 'deduct')}
                        className="flex items-center gap-1 text-sm bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-2 rounded-lg transition-colors font-medium"
                        title="Trừ hao hụt/hư hỏng"
                      >
                        <Minus className="w-4 h-4" /> Trừ hao hụt
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    Chưa có sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
              <h2 className={`text-lg font-bold flex items-center gap-2 ${actionType === 'add' ? 'text-blue-600' : 'text-red-600'}`}>
                {actionType === 'add' ? <Plus className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
                {actionType === 'add' ? 'Nhập thêm tồn kho' : 'Trừ tồn kho (Hao hụt)'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Sản phẩm: <span className="font-bold text-gray-900">{selectedProduct.productName}</span><br/>
                Tồn kho hiện tại: <span className="font-bold">{selectedProduct.stock || 0}</span>
              </p>
              <form onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng cần {actionType === 'add' ? 'nhập' : 'trừ'}:
                </label>
                <input
                  type="number"
                  min="1"
                  max={actionType === 'deduct' ? (selectedProduct.stock || 0) : undefined}
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg font-bold"
                />
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    Hủy
                  </button>
                  <button type="submit" className={`px-5 py-2 text-white font-medium rounded-lg transition-colors ${actionType === 'add' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}>
                    Xác nhận
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
