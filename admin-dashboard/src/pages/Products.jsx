import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct, addProductWithImage, updateProductWithImage } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    description: '',
    category: '', // Actually needs Category object, but let's store category ID
    batteryCapacity: '',
    maxRange: '',
    topSpeed: '',
    color: '',
    motorPower: '',
    segment: '',
    imageUrl: '',
    imageFile: null
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedCategory = categories.find(c => c.id.toString() === formData.category.toString());

      if (formData.imageFile) {
        const fd = new FormData();
        fd.append('file', formData.imageFile);
        fd.append('productName', formData.productName);
        fd.append('price', formData.price);
        fd.append('description', formData.description || '');
        if (selectedCategory) fd.append('categoryId', selectedCategory.id);
        if (formData.batteryCapacity) fd.append('batteryCapacity', formData.batteryCapacity);
        if (formData.maxRange) fd.append('maxRange', formData.maxRange);
        if (formData.topSpeed) fd.append('topSpeed', formData.topSpeed);
        if (formData.color) fd.append('color', formData.color);
        if (formData.motorPower) fd.append('motorPower', formData.motorPower);
        if (formData.segment) fd.append('segment', formData.segment);

        if (editingProduct) {
          await updateProductWithImage(editingProduct.id, fd);
        } else {
          await addProductWithImage(fd);
        }
      } else {
        const payload = {
          ...formData,
          category: selectedCategory
        };

        if (editingProduct) {
          await updateProduct(editingProduct.id, payload);
        } else {
          await createProduct(payload);
        }
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Có lỗi xảy ra khi lưu sản phẩm!');
    }
  };

  const resetForm = () => {
    setFormData({
      productName: '',
      price: '',
      description: '',
      category: '',
      batteryCapacity: '',
      maxRange: '',
      topSpeed: '',
      color: '',
      motorPower: '',
      segment: '',
      imageUrl: '',
      imageFile: null
    });
    setImagePreview(null);
  }

  const handleEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      productName: prod.productName || '',
      price: prod.price || '',
      description: prod.description || '',
      category: prod.category ? prod.category.id : '',
      batteryCapacity: prod.batteryCapacity || '',
      maxRange: prod.maxRange || '',
      topSpeed: prod.topSpeed || '',
      color: prod.color || '',
      motorPower: prod.motorPower || '',
      segment: prod.segment || '',
      imageUrl: prod.imageUrl || '',
      imageFile: null
    });

    // Set preview format based on backend URL pattern
    const previewUrl = prod.imageUrl && prod.imageUrl.startsWith('/uploads/')
      ? `http://localhost:8810/api/products${prod.imageUrl}`
      : prod.imageUrl;
    setImagePreview(previewUrl || null);

    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Có lỗi xảy ra khi xóa sản phẩm!');
      }
    }
  };

  const openNewModal = () => {
    setEditingProduct(null);
    resetForm();
    if (categories.length > 0) {
      setFormData(prev => ({ ...prev, category: categories[0].id }));
    }
    setIsModalOpen(true);
  };

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Sản phẩm</h1>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Thêm Sản phẩm
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
                <th className="py-4 px-6 w-20">ID</th>
                <th className="py-4 px-6 w-24 text-center">Hình ảnh</th>
                <th className="py-4 px-6">Tên Xe</th>
                <th className="py-4 px-6">Danh mục</th>
                <th className="py-4 px-6">Giá (VNĐ)</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-gray-500">{prod.id}</td>
                  <td className="py-2 px-6">
                    <div className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
                      {prod.imageUrl ? (
                        <img
                          src={prod.imageUrl && prod.imageUrl.startsWith('/uploads/') ? `http://localhost:8810${prod.imageUrl}` : prod.imageUrl}
                          alt={prod.productName}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150?text=No+Image" }}
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-900">{prod.productName}</td>
                  <td className="py-4 px-6 text-gray-600">
                    <div className="flex flex-col gap-1">
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium w-fit">
                        DM: {prod.category ? prod.category.name : 'N/A'}
                      </span>
                      {prod.segment && (
                        <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium w-fit">
                          ĐK: {prod.segment}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-emerald-600">
                    {Number(prod.price).toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleEdit(prod)}
                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-800">
                {editingProduct ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm Mới'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 flex-1">
              <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên xe <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.productName}
                        onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Danh mục <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      >
                        <option value="" disabled>Chọn danh mục</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phân khúc (Mega Menu)
                      </label>
                      <select
                        value={formData.segment}
                        onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      >
                        <option value="">Không phân khúc</option>
                        <option value="Học sinh">Học sinh - 50cc</option>
                        <option value="Sinh viên">Sinh viên - Thời trang</option>
                        <option value="Thể thao">Thể thao - Cá tính</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giá (VNĐ) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hình ảnh sản phẩm (Upload)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setFormData({ ...formData, imageFile: file });
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {imagePreview && (
                        <div className="mt-3 relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pin (Ah)</label>
                        <input
                          type="text"
                          value={formData.batteryCapacity}
                          onChange={(e) => setFormData({ ...formData, batteryCapacity: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quãng đường (km)</label>
                        <input
                          type="text"
                          value={formData.maxRange}
                          onChange={(e) => setFormData({ ...formData, maxRange: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vận tốc tối đa (km/h)</label>
                        <input
                          type="number"
                          value={formData.topSpeed}
                          onChange={(e) => setFormData({ ...formData, topSpeed: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Động cơ (W)</label>
                        <input
                          type="number"
                          value={formData.motorPower}
                          onChange={(e) => setFormData({ ...formData, motorPower: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Màu sắc</label>
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0 bg-gray-50">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                form="product-form"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                {editingProduct ? 'Cập nhật Sản phẩm' : 'Thêm mới Sản phẩm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
