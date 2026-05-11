import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/accounts/registration', {
        userName: formData.username,
        userPassword: formData.password,
        active: 1,
        userDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phone
        }
      });

      if (response.status === 201) {
        navigate('/login');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Đăng ký thất bại. Tên đăng nhập hoặc email có thể đã tồn tại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full">
        <h1 className="text-4xl font-semibold text-slate-800 mb-10 text-center">Đăng Ký</h1>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-base"
                placeholder="Họ (Vd: Nguyễn)"
              />
            </div>
            <div>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-base"
                placeholder="Tên (Vd: Văn A)"
              />
            </div>
          </div>

          <div>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-base"
              placeholder="Tên đăng nhập"
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-base"
              placeholder="Email"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-base"
                placeholder="Mật khẩu"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-base"
                placeholder="Xác nhận MK"
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
            disabled={isLoading}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center text-base"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Đăng Ký'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500 mb-4">
          Đã có tài khoản?
        </div>
        
        <Link 
          to="/login" 
          className="block w-full border border-blue-500 text-blue-500 bg-transparent hover:bg-blue-50 font-medium py-3 px-4 rounded-md transition-colors duration-300 text-center text-base"
        >
          Đăng nhập
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Register;
