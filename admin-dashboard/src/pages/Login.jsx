import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Sử dụng axiosClient (api.js) để đi qua Gateway (port 8900)
      const response = await api.post('/auth/login', {
        email: username,
        userName: username,
        password: password
      });

      if (response.status === 200) {
        const { token, role, username } = response.data;
        
        if (token) {
          localStorage.setItem('token', token);
          if (role) {
            localStorage.setItem('role', role);
          }
          if (username) {
            localStorage.setItem('username', username);
          }
        }
        
        setError('');
        
        // Redirect based on role
        if (role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full">
        <h1 className="text-4xl font-semibold text-slate-800 mb-10 text-center">Đăng nhập</h1>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-base"
              placeholder="Tên đăng nhập hoặc Email"
            />
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>

          <div className="flex items-center justify-between pt-1 pb-2">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-sm"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500">
                Ghi nhớ tài khoản
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="text-gray-500 hover:text-gray-700 transition-colors">
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center text-base"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Đăng nhập'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500 mb-4">
          Chưa có tài khoản?
        </div>
        
        <Link 
          to="/register" 
          className="block w-full border border-blue-500 text-blue-500 bg-transparent hover:bg-blue-50 font-medium py-3 px-4 rounded-md transition-colors duration-300 text-center text-base"
        >
          Đăng ký
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
