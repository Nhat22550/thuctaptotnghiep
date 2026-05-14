import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Eye, EyeOff, Mail, KeyRound } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';

const Login = () => {
  // Common states
  const [loginMode, setLoginMode] = useState('password'); // 'password' or 'otp'
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Password mode states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // OTP mode states
  const [otpStep, setOtpStep] = useState(1); // 1: Email, 2: Code
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const navigate = useNavigate();

  // Handle Countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Handle Auth Success (reusable for both modes)
  const handleAuthSuccess = (response) => {
    const { token, role, username: responseUsername } = response.data;
    
    if (token) {
      localStorage.setItem('token', token);
      if (role) {
        localStorage.setItem('role', role);
      }
      if (responseUsername) {
        localStorage.setItem('username', responseUsername);
      }
    }
    
    setError('');
    
    // Redirect based on role
    if (role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  // Login via Password
  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setIsLoggingIn(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await api.post('/auth/login', {
        email: username,
        userName: username,
        password: password
      });

      if (response.status === 200) {
        handleAuthSuccess(response);
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.';
      setError(errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Send OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otpEmail) {
      setError('Vui lòng nhập email');
      return;
    }
    
    setIsSendingOtp(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await api.post('/auth/send-otp', { email: otpEmail });
      if (response.status === 200) {
        setSuccessMsg('Đã gửi mã OTP qua email của bạn.');
        setOtpStep(2);
        setCountdown(60); // Start 60s countdown
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      setError(err.response?.data?.message || 'Không thể gửi mã OTP. Vui lòng thử lại.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setError('Vui lòng nhập đủ 6 số OTP');
      return;
    }

    setIsVerifyingOtp(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await api.post('/auth/verify-otp', { 
        email: otpEmail, 
        otp: otpCode 
      });

      if (response.status === 200) {
        handleAuthSuccess(response);
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      setError(err.response?.data?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Switch tabs
  const handleTabChange = (mode) => {
    setLoginMode(mode);
    setError('');
    setSuccessMsg('');
  };

  return (
    <AuthLayout>
      <div className="w-full">
        <h1 className="text-4xl font-semibold text-slate-800 mb-8 text-center">Đăng nhập</h1>

        {/* Tabs */}
        <div className="flex mb-8 bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors flex justify-center items-center gap-2 ${
              loginMode === 'password' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTabChange('password')}
          >
            <KeyRound className="w-4 h-4" />
            Mật khẩu
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors flex justify-center items-center gap-2 ${
              loginMode === 'otp' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTabChange('otp')}
          >
            <Mail className="w-4 h-4" />
            Email OTP
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm text-center">
            {error}
          </div>
        )}
        
        {successMsg && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm text-center">
            {successMsg}
          </div>
        )}

        {/* PASSWORD LOGIN FLOW */}
        {loginMode === 'password' && (
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
              disabled={isLoggingIn}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center text-base"
            >
              {isLoggingIn ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Đăng nhập'}
            </button>
          </form>
        )}

        {/* OTP LOGIN FLOW */}
        {loginMode === 'otp' && (
          <div className="space-y-6">
            {otpStep === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <input
                    type="email"
                    required
                    value={otpEmail}
                    onChange={(e) => setOtpEmail(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-base"
                    placeholder="Nhập địa chỉ Email của bạn"
                  />
                  <p className="mt-2 text-sm text-gray-500 text-center">
                    Mã OTP 6 số sẽ được gửi đến email này.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center text-base"
                >
                  {isSendingOtp ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : 'Nhận mã OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="text-center text-sm text-gray-600 mb-2">
                  Đang xác thực cho: <strong>{otpEmail}</strong>
                  <button 
                    type="button" 
                    onClick={() => { setOtpStep(1); setOtpCode(''); setError(''); setSuccessMsg(''); }}
                    className="ml-2 text-blue-600 hover:underline"
                  >
                    Thay đổi
                  </button>
                </div>
                
                <div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-center text-2xl tracking-[0.5em] font-mono"
                    placeholder="000000"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifyingOtp || otpCode.length < 6}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center text-base"
                >
                  {isVerifyingOtp ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : 'Xác nhận Đăng nhập'}
                </button>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={countdown > 0 || isSendingOtp}
                    className="text-sm font-medium text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {countdown > 0 ? `Gửi lại mã (${countdown}s)` : 'Gửi lại mã OTP'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

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
