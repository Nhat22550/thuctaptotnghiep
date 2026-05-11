import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (!token) {
      setError('Đường dẫn không hợp lệ hoặc đã hết hạn.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });

      if (response.status === 200 || response.status === 201) {
        setMessage('Đặt lại mật khẩu thành công! Chuyển hướng đến đăng nhập...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.data.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.response?.data?.message || 'Lỗi kết nối tới máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout>
        <div className="w-full text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-2 text-center">Đường dẫn không hợp lệ</h2>
          <p className="text-gray-500 mb-8 text-center text-sm">Thiếu token xác thực. Vui lòng kiểm tra lại đường dẫn trong email của bạn.</p>
          <Link 
            to="/login" 
            className="block w-full border border-blue-500 text-blue-500 bg-transparent hover:bg-blue-50 font-medium py-3 px-4 rounded-md transition-colors duration-300 text-center text-base"
          >
            Về trang đăng nhập
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="w-full">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-slate-800 mb-4 text-center">Đặt Lại Mật Khẩu</h1>
          <p className="text-gray-500 text-center text-sm">Vui lòng nhập mật khẩu mới của bạn.</p>
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-base"
                placeholder="Mật khẩu mới"
                required
                minLength="6"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-base"
                placeholder="Xác nhận mật khẩu mới"
                required
                minLength="6"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || message !== ''}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center text-base"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Đổi Mật Khẩu'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
