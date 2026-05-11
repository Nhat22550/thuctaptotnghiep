import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { verifyVnpayReturn } from '../services/paymentService';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('processing'); // 'success', 'failed', 'processing'
  const [backendData, setBackendData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const calledRef = useRef(false); // Tránh gọi API 2 lần (React StrictMode)
  
  useEffect(() => {
    // Nếu không có tham số VNPay → redirect về trang chủ
    const responseCode = searchParams.get('vnp_ResponseCode');
    if (!responseCode) {
      navigate('/');
      return;
    }

    // Tránh gọi 2 lần trong StrictMode
    if (calledRef.current) return;
    calledRef.current = true;

    // Lấy toàn bộ query string và gửi về Backend để xác thực chữ ký
    const queryString = location.search.startsWith('?')
      ? location.search.substring(1)
      : location.search;

    const verifyPayment = async () => {
      try {
        console.log('[PaymentResult] Gửi xác thực về Backend...');
        const data = await verifyVnpayReturn(queryString);
        console.log('[PaymentResult] Kết quả từ Backend:', data);

        setBackendData(data);

        if (data.status === 'OK') {
          // Backend xác nhận: chữ ký hợp lệ + responseCode = 00
          clearCart();
          setStatus('success');
        } else {
          // Backend trả về FAILED hoặc INVALID_SIGNATURE
          setStatus('failed');
          setErrorMsg(data.message || 'Giao dịch không thành công.');
        }
      } catch (err) {
        console.error('[PaymentResult] Lỗi gọi API xác thực:', err);
        setStatus('failed');
        setErrorMsg(
          err.response?.data?.message
            || 'Không thể kết nối máy chủ để xác thực giao dịch. Vui lòng liên hệ CSKH.'
        );
      }
    };

    verifyPayment();
  }, [searchParams, location.search, clearCart, navigate]);

  if (status === 'processing') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-10 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-slate-100 p-10 max-w-md w-full text-center relative overflow-hidden"
      >
        {status === 'success' ? (
          <>
            {/* Success UI */}
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>
            
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-100 shadow-sm">
              <CheckCircle className="w-12 h-12 text-blue-500" strokeWidth={2} />
            </div>
            
            <h1 className="text-2xl font-bold text-slate-800 mb-3">Thanh toán thành công!</h1>
            
            <p className="text-slate-500 mb-8 leading-relaxed">
              Cảm ơn bạn đã tin tưởng <strong className="text-blue-600 font-bold">NHẬT EV</strong>. Đơn hàng của bạn đã được thanh toán và đang được xử lý.
            </p>
            
            <div className="bg-slate-50 rounded-xl p-4 mb-8 text-left border border-slate-100">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">Mã giao dịch:</span>
                <span className="font-semibold text-slate-800">{backendData?.transactionNo || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">Mã đơn hàng:</span>
                <span className="font-semibold text-slate-800">{backendData?.txnRef || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Số tiền:</span>
                <span className="font-bold text-blue-600">
                  {backendData?.amount 
                    ? (Number(backendData.amount) / 100).toLocaleString('vi-VN') + 'đ'
                    : 'N/A'}
                </span>
              </div>
            </div>
            
            <Link 
              to="/" 
              className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-full transition-colors shadow-md shadow-blue-500/20"
            >
              Về trang chủ
            </Link>
          </>
        ) : (
          <>
            {/* Failed UI */}
            <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
            
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100 shadow-sm">
              <XCircle className="w-12 h-12 text-red-500" strokeWidth={2} />
            </div>
            
            <h1 className="text-2xl font-bold text-slate-800 mb-3">Thanh toán thất bại hoặc đã bị hủy</h1>
            
            <p className="text-slate-500 mb-8 leading-relaxed">
              {errorMsg || 'Giao dịch VNPAY không thành công. Vui lòng kiểm tra lại số dư hoặc thử lại sau.'} <br className="hidden sm:block"/>
              <strong className="text-slate-700 mt-2 block">Giỏ hàng của bạn vẫn được giữ nguyên.</strong>
            </p>
            
            <Link 
              to="/cart" 
              className="inline-block w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 px-6 rounded-full transition-colors shadow-md shadow-red-500/20 mb-3"
            >
              Quay lại giỏ hàng
            </Link>
            
            <Link 
              to="/" 
              className="inline-block w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-6 rounded-full transition-colors"
            >
              Về trang chủ
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentResult;
