import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import AuthLayout from '../layouts/AuthLayout';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await api.post('/auth/forgot-password', { email });

      if (response.status === 200 || response.status === 201) {
        setMessage(response.data.message || 'Yêu cầu khôi phục mật khẩu đã được gửi!');
      } else {
        setError(response.data.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.message || 'Lỗi kết nối tới máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-slate-800 mb-4 text-center">Quên Mật Khẩu</h1>
          <p className="text-gray-500 text-center text-sm">Nhập email của bạn để nhận link khôi phục mật khẩu.</p>
        </div>

        {message && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-md text-sm text-center">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-base"
              placeholder="Email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center text-base"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Gửi Yêu Cầu Khôi Phục'}
          </button>
        </form>

        <div className="mt-8">
          <Link 
            to="/login" 
            className="block w-full border border-blue-500 text-blue-500 bg-transparent hover:bg-blue-50 font-medium py-3 px-4 rounded-md transition-colors duration-300 text-center text-base"
          >
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
