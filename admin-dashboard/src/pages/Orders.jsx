import React, { useState, useEffect } from 'react';
import { getOrders, createOrder, updateOrder, deleteOrder } from '../services/orderService';
import { getUsers } from '../services/userService';
import { getProducts } from '../services/productService';
import { Plus, Edit2, Trash2, X, ShoppingCart } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  
  const [formData, setFormData] = useState({
    userId: '',
    productId: '',
    quantity: 1,
    status: 'Pending'
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchAdditionalData = async () => {
    try {
      const [usersData, productsData] = await Promise.all([
        getUsers(),
        getProducts()
      ]);
      setUsers(usersData);
      setProducts(productsData);
    } catch (error) {
      console.error('Failed to fetch users or products:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        userId: Number(formData.userId),
        productId: Number(formData.productId),
        quantity: Number(formData.quantity)
      };

      if (editingOrder) {
        // If editing is supported by backend, adjust payload if necessary
        await updateOrder(editingOrder.id, { ...payload, status: formData.status });
      } else {
        await createOrder(payload);
      }
      
      setIsModalOpen(false);
      setEditingOrder(null);
      resetForm();
      fetchOrders();
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Có lỗi xảy ra khi lưu đơn hàng!');
    }
  };

  const resetForm = () => {
    setFormData({
      userId: '',
      productId: '',
      quantity: 1,
      status: 'Pending'
    });
  };

  const handleEdit = async (order) => {
    await fetchAdditionalData();
    setEditingOrder(order);
    
    // Attempt to pre-fill based on order data (if items mapping exists)
    // Adjust based on actual backend response structure
    const Item = order.items && order.items.length > 0 ? order.items[0] : null;

    setFormData({
      userId: order.user?.id || '',
      productId: Item?.productId || '', 
      quantity: Item?.quantity || 1,
      status: order.status || 'Pending'
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      try {
        await deleteOrder(id);
        fetchOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Có lỗi xảy ra khi xóa đơn hàng!');
      }
    }
  };

  const openNewModal = async () => {
    await fetchAdditionalData();
    setEditingOrder(null);
    resetForm();
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-emerald-50 text-emerald-600';
      case 'cancelled':
        return 'bg-red-50 text-red-600';
      case 'pending':
      default:
        return 'bg-amber-50 text-amber-600';
    }
  };

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Đơn hàng</h1>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Thêm Đơn hàng
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
                <th className="py-4 px-6 w-20">ID</th>
                <th className="py-4 px-6">Khách hàng</th>
                <th className="py-4 px-6">Sản phẩm</th>
                <th className="py-4 px-6 text-center">Số lượng</th>
                <th className="py-4 px-6">Trạng thái</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-gray-500">#{order.id}</td>
                  <td className="py-4 px-6 font-medium text-gray-900">
                    {order.user?.userName || order.receiverName || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {order.items && order.items.length > 0 
                      ? `${order.items[0].productName || 'Sản phẩm'} ${order.items.length > 1 ? `(+${order.items.length - 1})` : ''}` 
                      : 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-center text-gray-600">
                    {order.items && order.items.length > 0 ? order.items[0].quantity : 1}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleEdit(order)}
                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    Chưa có đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-800">
                {editingOrder ? 'Sửa Đơn hàng' : 'Thêm Đơn hàng Mới'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 flex-1">
              <form id="order-form" onSubmit={handleSubmit} className="space-y-6">
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Khách Hàng <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="" disabled>-- Chọn Khách Hàng --</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.userDetails ? `${user.userDetails.firstName} ${user.userDetails.lastName}` : user.userName} 
                        ({user.userDetails?.email || user.userName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xe Điện (Sản phẩm) <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="" disabled>-- Chọn Sản Phẩm --</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.productName} - {Number(product.price).toLocaleString()} VNĐ
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {editingOrder && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                )}

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
                form="order-form"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                {editingOrder ? 'Cập nhật Đơn hàng' : 'Thêm mới Đơn hàng'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
