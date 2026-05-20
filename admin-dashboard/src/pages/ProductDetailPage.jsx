import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingCart, ArrowLeft, Zap, Battery, Gauge, Bike,
  Star, Shield, CheckCircle, Plus, Minus, Clock, Weight,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getProductById } from '../services/productService';
import { useCart } from '../context/CartContext';

const FALLBACK = 'Đang cập nhật...';

const resolveImage = (imageUrl) => {
  if (!imageUrl) return null;
  const baseUrl = import.meta.env.VITE_IMAGE_URL || 'http://localhost:8810';
  if (imageUrl.startsWith('/uploads/')) return `${baseUrl}${imageUrl}`;
  return imageUrl;
};
const PLACEHOLDER_IMG = 'https://placehold.co/800x800/1e293b/94a3b8?text=NHAT+EV';

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ show, message }) => (
  <div
    className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-blue-500 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-blue-500/30 transition-all duration-500 ${
      show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
    }`}
  >
    <CheckCircle className="w-5 h-5 flex-shrink-0" />
    <span className="font-medium text-sm">{message}</span>
  </div>
);

// ─── Spec Card ────────────────────────────────────────────────────────────────
const SpecCard = ({ icon: Icon, label, value, color }) => {
  const isUnavailable = value === FALLBACK;
  return (
    <div className={`bg-white backdrop-blur-sm border rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all ${
      isUnavailable ? 'border-amber-500/20' : 'border-slate-100'
    }`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className={`font-bold text-base mt-0.5 ${isUnavailable ? 'text-amber-500 italic' : 'text-slate-800'}`}>
          {value}
        </p>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setImgError(false);
      setQuantity(1);
      try {
        const data = await getProductById(id);
        if (!data || !data.id) {
          setError('Không tìm thấy xe điện này.');
          setProduct(null);
        } else {
          console.log('[ProductDetail] Dữ liệu từ API:', data);
          setProduct(data);
        }
      } catch (err) {
        console.error('Lỗi:', err);
        setError(err.response?.status === 404 ? 'Sản phẩm không tồn tại.' : 'Không thể kết nối máy chủ.');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) addToCart(product);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Đang tải thông tin xe...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center px-4">
        <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
          <AlertCircle className="w-12 h-12 text-red-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Không tìm thấy sản phẩm</h2>
          <p className="text-slate-500 mt-2 max-w-md">{error}</p>
        </div>
        <Link to="/" className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  const resolvedImg = resolveImage(product.imageUrl);
  const imgSrc = imgError ? PLACEHOLDER_IMG : (resolvedImg || PLACEHOLDER_IMG);

  const specs = [
    { icon: Battery, label: 'Pin / Ắc quy',      value: product.batteryCapacity || FALLBACK,                                  color: 'bg-amber-500/10 text-amber-600' },
    { icon: Gauge,   label: 'Vận tốc tối đa',    value: product.topSpeed != null ? `${product.topSpeed} km/h` : FALLBACK,     color: 'bg-blue-500/10 text-blue-600' },
    { icon: Zap,     label: 'Quãng đường tối đa', value: product.maxRange || product.max_range || FALLBACK,                    color: 'bg-blue-500/10 text-blue-600' },
    { icon: Bike,    label: 'Công suất động cơ',  value: product.motorPower != null ? `${product.motorPower} W` : FALLBACK,    color: 'bg-purple-500/10 text-purple-600' },
    { icon: Clock,   label: 'Thời gian sạc',      value: product.chargeTime || product.charge_time || FALLBACK,                color: 'bg-sky-500/10 text-sky-600' },
    { icon: Weight,  label: 'Trọng lượng',         value: product.weight != null ? `${product.weight} kg` : FALLBACK,          color: 'bg-orange-500/10 text-orange-600' },
    { icon: Shield,  label: 'Bảo hành',            value: product.warranty || '2 năm chính hãng',                              color: 'bg-rose-500/10 text-rose-600' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link to="/" className="hover:text-blue-400 transition-colors">Trang chủ</Link>
        <span className="text-gray-700">/</span>
        {product.category && (
          <>
            <span className="hover:text-blue-400 cursor-pointer">{product.category.name}</span>
            <span className="text-gray-700">/</span>
          </>
        )}
        <span className="text-slate-800 font-medium line-clamp-1">{product.productName}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* ── Left: Image ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-100 aspect-square shadow-md">
            {product.category && (
              <span className="absolute top-5 left-5 z-10 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-blue-500/30">
                {product.category.name}
              </span>
            )}
            <img
              src={imgSrc}
              alt={product.productName}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              onError={() => setImgError(true)}
            />
          </div>
        </motion.div>

        {/* ── Right: Info ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col"
        >
          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-4 h-4 ${s <= 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-700 fill-gray-700'}`} />
            ))}
            <span className="text-sm text-gray-500 ml-1">(128 đánh giá)</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight mb-4">
            {product.productName}
          </h1>

          <p className="text-slate-600 leading-relaxed mb-6">
            {product.description || 'Xe máy điện chất lượng cao, thiết kế hiện đại.'}
          </p>

          {/* Price */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-6">
            <p className="text-sm text-slate-500 mb-1">Giá bán lẻ</p>
            <div className="flex items-end gap-3 flex-wrap">
              <span className="text-4xl font-black text-blue-400">
                {Number(product.price).toLocaleString('vi-VN')}đ
              </span>
              <span className="text-slate-400 line-through text-lg mb-1">
                {Math.round(Number(product.price) * 1.1).toLocaleString('vi-VN')}đ
              </span>
              <span className="bg-red-500/10 text-red-400 text-xs font-bold px-2 py-1 rounded-full border border-red-500/20 mb-1">
                -10%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">* Giá bao gồm VAT. Miễn phí giao xe toàn quốc.</p>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-slate-600">Số lượng:</span>
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-bold text-slate-800">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg"
            >
              <ShoppingCart className="w-6 h-6" />
              Thêm vào giỏ
            </button>
            <Link to="/cart" onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg"
            >
              Mua ngay
            </Link>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {['Chính hãng 100%', 'Bảo hành 2 năm', 'Giao xe tận nơi', 'Hỗ trợ trả góp'].map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-full">
                <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                {b}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Specs ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-blue-500 rounded-full" />
          <h2 className="text-2xl font-black text-slate-800">Thông số kỹ thuật</h2>
        </div>

        {specs.filter((s) => s.value === FALLBACK).length >= 3 && (
          <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 text-amber-600 px-4 py-3 rounded-xl mb-4 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>Một số thông số sẽ được cập nhật sớm!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {specs.map((spec, i) => (
            <motion.div key={spec.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
              <SpecCard {...spec} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Description ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-blue-500 rounded-full" />
          <h2 className="text-2xl font-black text-slate-800">Mô tả chi tiết</h2>
        </div>
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-8 text-slate-600 leading-loose space-y-4">
          <p>
            <strong className="text-slate-800">NHẬT</strong> tự hào giới thiệu{' '}
            <strong className="text-blue-400">{product.productName}</strong> — dòng xe điện hàng đầu Việt Nam.
          </p>
          {product.description && <p>{product.description}</p>}
          <p>
            Động cơ BLDC không chổi than giúp vận hành hiệu quả, tiêu thụ ít điện năng.
            Pin lithium ion LFP với hệ thống BMS thông minh bảo vệ trước quá tải, quá nhiệt.
          </p>
        </div>
      </motion.section>

      <Toast show={toast} message={`Đã thêm "${product.productName}" vào giỏ hàng!`} />
    </motion.div>
  );
};

export default ProductDetailPage;
