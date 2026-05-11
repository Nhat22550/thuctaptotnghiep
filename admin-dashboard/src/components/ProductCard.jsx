import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// ─── Resolve ảnh (logic dùng chung) ───────────────────────────────────────────
const resolveImage = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('/uploads/')) return `http://localhost:8810${imageUrl}`;
  return imageUrl;
};
const PLACEHOLDER = 'https://placehold.co/600x600/f8fafc/94a3b8?text=NHAT+EV';

const ProductCard = ({ product, onAddToCart, index = 0 }) => {
  const imgSrc = resolveImage(product.imageUrl) || PLACEHOLDER;
  const [imgError, setImgError] = React.useState(false);
  const [added, setAdded] = React.useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      className="h-full"
    >
      <div className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-slate-200 flex flex-col h-full">

        {/* ── Ảnh sản phẩm ── */}
        <div className="aspect-square bg-white overflow-hidden relative p-4 flex items-center justify-center">
          <img
            src={imgError ? PLACEHOLDER : imgSrc}
            alt={product.productName}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Cấp độ / Phân khúc (ví dụ) */}
          {product.category && (
            <span className="absolute top-4 left-4 bg-slate-100 text-slate-600 text-[11px] font-bold px-3 py-1 rounded-full">
              {product.category.name}
            </span>
          )}

          {/* Hover overlay actions */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/40 backdrop-blur-[2px]">
            <Link
              to={`/product/${product.id}`}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-lg"
            >
              <Eye className="w-4 h-4" />
              Chi tiết
            </Link>
          </div>
        </div>

        {/* ── Thông tin ── */}
        <div className="p-5 flex flex-col flex-1 border-t border-slate-50">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-medium text-slate-800 text-base mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {product.productName}
            </h3>
          </Link>
          <p className="text-slate-500 text-sm mb-5 line-clamp-2 flex-1">
            {product.description || 'Xe điện thiết kế sang trọng, tối giản.'}
          </p>

          <div className="flex items-center justify-between mt-auto pt-2">
            <div>
              <span className="text-xl font-black text-black">
                {Number(product.price).toLocaleString('vi-VN')}
              </span>
              <span className="text-slate-900 text-sm ml-0.5 font-bold">đ</span>
            </div>
            <button
              onClick={handleAdd}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-xs transition-all shadow-sm ${
                added
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
              }`}
              title="Mua ngay"
            >
              {added ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  ĐÃ THÊM
                </>
              ) : (
                <>
                  MUA NGAY
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
