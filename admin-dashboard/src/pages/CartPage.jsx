import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowLeft,
  User, Phone, MapPin, CreditCard, CheckCircle, Bike, ChevronRight,
  Shield, AlertCircle, Wallet, Zap
} from 'lucide-react';
import {  AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import api from '../services/api';

// ─── Error Toast ──────────────────────────────────────────────────────────────
const ErrorToast = ({ show, message }) => (
  <div
    className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-red-500 text-white px-5 py-3.5 rounded-2xl shadow-xl transition-all duration-500 max-w-md ${
      show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
    }`}
  >
    <AlertCircle className="w-5 h-5 flex-shrink-0" />
    <span className="font-medium text-sm">{message}</span>
  </div>
);

// ─── Order Success Screen ─────────────────────────────────────────────────────
const OrderSuccess = ({ order, onContinue }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4"
  >
    <div className="w-24 h-24 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
      <CheckCircle className="w-14 h-14 text-blue-500" strokeWidth={1.5} />
    </div>
    <h1 className="text-3xl font-black text-slate-900 mb-2">Đặt xe thành công! 🎉</h1>
    <p className="text-slate-500 mb-6 max-w-md leading-relaxed">
      Cảm ơn bạn đã tin tưởng <strong className="text-blue-600">NHẬT</strong>. Đơn hàng của bạn đã
      được ghi nhận và sẽ được xử lý sớm nhất.
    </p>

    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 w-full max-w-sm text-left mb-8 space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-slate-500">Mã đơn</span>
        <span className="font-bold text-blue-600">#{order.id}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-slate-500">Người nhận</span>
        <span className="font-medium text-slate-900">{order.receiverName}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-slate-500">Thanh toán</span>
        <span className="font-medium text-slate-900">{order.paymentMethod === 'VNPAY' ? 'VNPAY' : 'Tiền mặt (COD)'}</span>
      </div>
      <hr className="border-slate-100" />
      <div className="flex justify-between">
        <span className="text-slate-500 text-sm">Tổng tiền</span>
        <span className="font-black text-blue-600 text-lg">
          {Number(order.totalAmount).toLocaleString('vi-VN')}đ
        </span>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={onContinue}
        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-md shadow-blue-500/20"
      >
        Tiếp tục mua sắm
      </button>
      <Link
        to="/"
        className="inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 px-8 py-3.5 rounded-full font-medium transition-colors bg-white"
      >
        <ArrowLeft className="w-4 h-4" /> Về trang chủ
      </Link>
    </div>
  </motion.div>
);

// ─── Cart Item Row ────────────────────────────────────────────────────────────
const CartItem = ({ item, onIncrease, onDecrease, onRemove, index }) => {
  const baseUrl = import.meta.env.VITE_IMAGE_URL || 'http://localhost:8810';
  const imgSrc =
    item.imageUrl && item.imageUrl.startsWith('/uploads/')
      ? `${baseUrl}${item.imageUrl}`
      : item.imageUrl || 'https://placehold.co/200x200/f8fafc/94a3b8?text=EV';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 py-5 border-b border-slate-100 last:border-0"
    >
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100 p-1">
        <img src={imgSrc} alt={item.productName} className="w-full h-full object-contain" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-800 text-base line-clamp-1 hover:text-blue-600 transition-colors cursor-pointer">{item.productName}</h3>
        {item.category && (
          <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md inline-block mt-1">{item.category.name}</span>
        )}
        <p className="text-blue-600 font-bold mt-1.5 text-sm">{Number(item.price).toLocaleString('vi-VN')}đ</p>
      </div>

      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white flex-shrink-0 shadow-sm">
        <button onClick={() => onDecrease(item.id)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-colors">
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-9 text-center text-sm font-bold text-slate-800">{item.quantity}</span>
        <button onClick={() => onIncrease(item)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-colors">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="font-black text-slate-900 min-w-[100px] text-right flex-shrink-0">
        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
      </p>

      <button
        onClick={() => onRemove(item.id)}
        className="ml-2 text-slate-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// ─── VNPAY Logo ───────────────────────────────────────────────────────────────
const VNPayLogo = () => (
  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-red-500 rounded-xl flex items-center justify-center text-white font-black text-[9px] leading-none shadow-md shadow-blue-500/20">
    VN<br />PAY
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN CART PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const CartPage = () => {
  const { cartItems, addToCart, decreaseQty, removeFromCart, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorToast, setErrorToast] = useState({ show: false, message: '' });

  const [form, setForm] = useState({
    receiverName: '',
    phone: '',
    address: '',
    note: '',
    paymentMethod: 'COD',
  });

  const [errors, setErrors] = useState({});

  const showError = (message) => {
    setErrorToast({ show: true, message });
    setTimeout(() => setErrorToast({ show: false, message: '' }), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.receiverName.trim()) newErrors.receiverName = 'Vui lòng nhập tên người nhận';
    if (!form.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^(0|\+84)\d{9}$/.test(form.phone.replace(/\s/g, '')))
      newErrors.phone = 'Số điện thoại không hợp lệ';
    if (!form.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ giao xe';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      // ═══ Tạo Order trước (cho cả VNPAY và COD/BANK) ═══
      const orderPayload = {
        receiverName: form.receiverName,
        shippingAddress: form.address,
        phoneNumber: form.phone,
        total: Math.round(totalPrice),
        paymentMethod: form.paymentMethod,
      };

      // Thêm userId nếu đang đăng nhập
      const userId = localStorage.getItem('userId');
      if (userId) orderPayload.userId = userId;

      const orderRes = await api.post('/orders', orderPayload);
      const order = orderRes.data;
      console.log('[CartPage] Order created:', order);

      if (form.paymentMethod === 'VNPAY') {
        // ═══ VNPAY: Redirect sang cổng thanh toán ═══
        const response = await api.get('/payment/create_url', {
          params: { amount: Math.round(totalPrice), orderId: order.id },
        });
        if (response.data && response.data.url) {
          // KHÔNG clear giỏ hàng ở đây — sẽ xử lý ở PaymentResult
          window.location.href = response.data.url;
          return;
        } else {
          throw new Error('Không nhận được URL thanh toán từ VNPAY');
        }
      }

      // ═══ COD / BANK: Đặt hàng xong ngay ═══
      setPlacedOrder({
        id: order.id,
        receiverName: form.receiverName,
        phone: form.phone,
        address: form.address,
        paymentMethod: form.paymentMethod,
        totalAmount: totalPrice,
      });
      clearCart();
      setOrderSuccess(true);
    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error);
      showError(
        form.paymentMethod === 'VNPAY'
          ? 'Không thể kết nối cổng VNPAY. Vui lòng thử lại!'
          : 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!'
      );
      setSubmitting(false);
    }
  };

  const handleContinueShopping = () => {
    setOrderSuccess(false);
    setPlacedOrder(null);
    navigate('/');
  };

  const getSubmitButtonContent = () => {
    if (submitting) {
      return (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          {form.paymentMethod === 'VNPAY' ? 'Đang kết nối VNPAY...' : 'Đang xử lý...'}
        </>
      );
    }
    if (form.paymentMethod === 'VNPAY') {
      return (
        <>
          <Wallet className="w-5 h-5" />
          Thanh toán qua VNPAY
          <ChevronRight className="w-5 h-5" />
        </>
      );
    }
    return (
      <>
        <CheckCircle className="w-5 h-5" />
        Xác nhận Đặt xe
        <ChevronRight className="w-5 h-5" />
      </>
    );
  };

  // Success
  if (orderSuccess && placedOrder) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <OrderSuccess order={placedOrder} onContinue={handleContinueShopping} />
      </div>
    );
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4"
      >
        <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <ShoppingCart className="w-10 h-10 text-slate-300" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Giỏ hàng trống</h2>
        <p className="text-slate-500 mb-8">Bạn chưa thêm chiếc xe điện nào vào giỏ hàng.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-md shadow-blue-500/20 hover:scale-105"
        >
          <Zap className="w-4 h-4" />
          Khám phá ngay
        </Link>
      </motion.div>
    );
  }

  // Payment methods
  const paymentMethods = [
    {
      value: 'COD',
      label: 'Tiền mặt (COD)',
      sub: 'Trả khi nhận xe',
      icon: <Wallet className="w-5 h-5" />,
    },
    {
      value: 'BANK',
      label: 'Chuyển khoản',
      sub: 'Ngân hàng / QR',
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      value: 'VNPAY',
      label: 'VNPAY',
      sub: 'Ví điện tử / ATM / Visa',
      icon: <VNPayLogo />,
      featured: true,
    },
  ];

  // ─── Input class helper ─────────────────────────────────────────────────────
  const inputClass = (fieldName) =>
    `w-full px-4 py-3 rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-all border bg-white ${
      errors[fieldName]
        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
        : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
    }`;

  // ─── MAIN UI ───────────────────────────────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Giỏ hàng</h1>
          <p className="text-slate-500 mt-1 text-sm">{cartItems.length} loại xe điện đang chờ bạn</p>
        </div>
        <Link to="/" className="hidden sm:inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Tiếp tục mua sắm
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ── Left ── */}
        <div className="lg:col-span-3 space-y-6">
          {/* Cart items */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-slate-800 text-lg">
                Sản phẩm ({cartItems.reduce((s, i) => s + i.quantity, 0)})
              </h2>
              <button
                onClick={clearCart}
                className="text-xs text-slate-400 hover:text-red-500 font-medium flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Xóa tất cả
              </button>
            </div>
            {cartItems.map((item, index) => (
              <CartItem
                key={item.id}
                item={item}
                index={index}
                onIncrease={addToCart}
                onDecrease={decreaseQty}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          {/* Checkout form */}
          <form id="checkout-form" onSubmit={handleSubmit}>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
              <h2 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-3">
                Thông tin giao xe
              </h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <User className="w-4 h-4 inline mr-1.5 text-blue-500" />
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input type="text" name="receiverName" value={form.receiverName} onChange={handleChange}
                  placeholder="Nguyễn Văn A" className={inputClass('receiverName')} />
                {errors.receiverName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.receiverName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <Phone className="w-4 h-4 inline mr-1.5 text-blue-500" />
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange}
                  placeholder="0901 234 567" className={inputClass('phone')} />
                {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <MapPin className="w-4 h-4 inline mr-1.5 text-blue-500" />
                  Địa chỉ giao xe <span className="text-red-500">*</span>
                </label>
                <textarea name="address" value={form.address} onChange={handleChange}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" rows={3}
                  className={`${inputClass('address')} resize-none`} />
                {errors.address && <p className="text-red-500 text-xs mt-1 font-medium">{errors.address}</p>}
              </div>

              {/* Payment methods */}
              <div className="pt-2">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  <CreditCard className="w-4 h-4 inline mr-1.5 text-blue-500" />
                  Phương thức thanh toán
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {paymentMethods.map((method) => {
                    const isSelected = form.paymentMethod === method.value;
                    return (
                      <label
                        key={method.value}
                        className={`relative flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50/50 shadow-sm ring-1 ring-blue-500/20' 
                            : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100/50'
                        }`}
                      >
                        <input type="radio" name="paymentMethod" value={method.value}
                          checked={isSelected} onChange={handleChange} className="sr-only" />

                        {method.featured ? method.icon : (
                          <div className={`mt-0.5 transition-colors ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>
                            {method.icon}
                          </div>
                        )}

                        <div className="flex-1">
                          <span className={`font-semibold text-sm block ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
                            {method.label}
                          </span>
                          <span className={`text-xs mt-0.5 block ${isSelected ? 'text-blue-600/70' : 'text-slate-500'}`}>{method.sub}</span>
                        </div>

                        {isSelected && <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />}

                        {method.featured && (
                          <span className="absolute -top-2.5 right-3 bg-gradient-to-r from-blue-600 to-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            Phổ biến
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>

                {form.paymentMethod === 'VNPAY' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 flex items-start gap-2.5 bg-blue-50 border border-blue-100 text-blue-800 px-4 py-3 rounded-xl text-sm"
                  >
                    <Shield className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
                    <div>
                      <p className="font-semibold">Thanh toán an toàn qua VNPAY</p>
                      <p className="text-blue-600/80 text-xs mt-0.5">
                        Bạn sẽ được chuyển hướng sang cổng thanh toán. Hỗ trợ thẻ ATM, Visa, MasterCard, ứng dụng ngân hàng.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Note */}
              <div className="pt-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Ghi chú cho đơn hàng</label>
                <textarea name="note" value={form.note} onChange={handleChange}
                  placeholder="Yêu cầu đặc biệt (không bắt buộc)..." rows={2}
                  className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all resize-none" />
              </div>
            </div>
          </form>
        </div>

        {/* ── Right: Order summary ── */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sticky top-24 shadow-sm">
            <h2 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-3 mb-4">
              Tóm tắt đơn hàng
            </h2>

            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-600 flex-1 line-clamp-1 pr-2">
                    {item.productName}
                    <span className="text-slate-400 ml-1">×{item.quantity}</span>
                  </span>
                  <span className="font-bold text-slate-900 flex-shrink-0">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              ))}
            </div>

            <hr className="border-slate-100 mb-4" />

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Tạm tính</span>
                <span className="font-medium text-slate-800">{totalPrice.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between text-sm text-blue-600">
                <span>Phí vận chuyển</span>
                <span className="font-bold">Miễn phí</span>
              </div>
              <hr className="border-slate-100" />
              <div className="flex justify-between font-black text-xl pt-1">
                <span className="text-slate-900">Tổng cộng</span>
                <span className="text-blue-700 font-black">{totalPrice.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            {/* Selected method summary */}
            <div className="flex items-center justify-center gap-2 bg-slate-50 rounded-xl px-4 py-3 mb-5 border border-slate-100">
              <span className="text-sm text-slate-500">Thanh toán bằng:</span>
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                {form.paymentMethod === 'VNPAY' ? <><Shield className="w-4 h-4 text-blue-600"/> VNPAY</> :
                 form.paymentMethod === 'BANK' ? <><CreditCard className="w-4 h-4 text-blue-600"/> Chuyển khoản</> : 
                 <><Wallet className="w-4 h-4 text-blue-600"/> Tiền mặt</>}
              </span>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={submitting}
              className={`w-full flex items-center justify-center gap-2.5 text-white py-4 px-6 rounded-full font-bold text-base transition-all duration-300 hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-md ${
                form.paymentMethod === 'VNPAY'
                  ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 shadow-blue-500/20'
                  : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 shadow-blue-500/20'
              }`}
            >
              {getSubmitButtonContent()}
            </button>

            <p className="text-xs text-slate-500 text-center mt-4">
              Đặt hàng đồng nghĩa bạn đồng ý với <strong className="text-blue-600 hover:underline cursor-pointer">chính sách</strong> của NHẬT.
            </p>
          </div>
        </div>
      </div>

      <ErrorToast show={errorToast.show} message={errorToast.message} />
    </motion.div>
  );
};

export default CartPage;
