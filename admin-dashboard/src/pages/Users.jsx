import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/userService';
import { Plus, Edit2, Trash2, X, Users as UsersIcon } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const [formData, setFormData] = useState({
    userName: '',
    userPassword: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    roleId: 2, // Default role ID (assuming 2 is customer/user)
    active: 1
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        userName: formData.userName,
        userPassword: formData.userPassword,
        active: formData.active,
        userDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
        },
        role: {
          id: formData.roleId
        }
      };

      if (editingUser) {
        await updateUser(editingUser.id, payload);
      } else {
        await createUser(payload);
      }
      
      setIsModalOpen(false);
      setEditingUser(null);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Có lỗi xảy ra khi lưu người dùng!');
    }
  };

  const resetForm = () => {
    setFormData({
      userName: '',
      userPassword: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      roleId: 2,
      active: 1
    });
  }

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      userName: user.userName || '',
      userPassword: '', // Don't show password on edit usually, but backend might require it or handle it
      firstName: user.userDetails?.firstName || '',
      lastName: user.userDetails?.lastName || '',
      email: user.userDetails?.email || '',
      phoneNumber: user.userDetails?.phoneNumber || '',
      roleId: user.role?.id || 2,
      active: user.active ?? 1
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Có lỗi xảy ra khi xóa người dùng!');
      }
    }
  };

  const openNewModal = () => {
    setEditingUser(null);
    resetForm();
    setIsModalOpen(true);
  };

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Người dùng</h1>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Thêm Người dùng
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
                <th className="py-4 px-6 w-20">ID</th>
                <th className="py-4 px-6 w-24 text-center">Avatar</th>
                <th className="py-4 px-6">Tên</th>
                <th className="py-4 px-6">Tài khoản</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Vai trò</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-gray-500">{user.id}</td>
                  <td className="py-2 px-6">
                    <div className="w-12 h-12 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center bg-blue-50 text-blue-500">
                      <UsersIcon className="w-6 h-6" />
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-900">
                    {user.userDetails ? `${user.userDetails.firstName} ${user.userDetails.lastName}` : 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-gray-600">{user.userName}</td>
                  <td className="py-4 px-6 text-gray-600">
                    {user.userDetails?.email || 'N/A'}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium">
                      {user.role ? user.role.roleName : 'User'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500">
                    Chưa có người dùng nào.
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
                {editingUser ? 'Sửa Người dùng' : 'Thêm Người dùng Mới'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 flex-1">
              <form id="user-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tài khoản <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.userName}
                        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                        disabled={!!editingUser}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                      />
                    </div>
                    
                    {!editingUser && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mật khẩu <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          required={!editingUser}
                          value={formData.userPassword}
                          onChange={(e) => setFormData({ ...formData, userPassword: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Họ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                      <input
                        type="text"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                      <select
                        value={formData.roleId}
                        onChange={(e) => setFormData({ ...formData, roleId: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      >
                        <option value={1}>Admin</option>
                        <option value={2}>User</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                      <select
                        value={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      >
                        <option value={1}>Hoạt động</option>
                        <option value={0}>Khóa</option>
                      </select>
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
                form="user-form"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                {editingUser ? 'Cập nhật Người dùng' : 'Thêm Người dùng'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
