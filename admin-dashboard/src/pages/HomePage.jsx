import React, { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../services/productService';
import { getActiveBanners, getBannerImageUrl } from '../services/bannerService';
import { ShoppingCart, Zap, ArrowRight, ChevronLeft, ChevronRight, Filter, X, SlidersHorizontal } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ show, productName }) => (
  <div
    className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-blue-500 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-blue-500/30 transition-all duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
  >
    <ShoppingCart className="w-5 h-5 flex-shrink-0" />
    <span className="font-medium text-sm">Đã thêm <strong>"{productName}"</strong> vào giỏ!</span>
  </div>
);

const PRICE_FILTERS = [
  { label: 'Tất cả', min: null, max: null },
  { label: 'Dưới 15 triệu', min: 0, max: 15000000 },
  { label: '15 - 30 triệu', min: 15000000, max: 30000000 },
  { label: 'Trên 30 triệu', min: 30000000, max: 100000000 },
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { addToCart } = useCart();
  const [toast, setToast] = useState({ show: false, name: '' });
  const [priceRange, setPriceRange] = useState({ min: null, max: null });
  // Thêm state cho bộ lọc nâng cao
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [speedFilter, setSpeedFilter] = useState('');

  const normalizeText = (text) => text.toLowerCase().replace(/[- ]/g, '');

  const categories = Array.from(
    new Set(products.map(p => p.category?.name).filter(Boolean))
  );

  let resultProducts = products.filter((product) => {
    // 1. Search name
    const normalizedProductName = normalizeText(product.productName || '');
    const normalizedSearchQuery = normalizeText(searchQuery);
    if (!normalizedProductName.includes(normalizedSearchQuery)) return false;

    // 2. Category
    if (selectedCategory && product.category?.name !== selectedCategory) return false;

    // 3. Speed
    if (speedFilter === 'under_50' && (product.topSpeed == null || product.topSpeed >= 50)) return false;
    if (speedFilter === 'over_50' && (product.topSpeed == null || product.topSpeed < 50)) return false;

    return true;
  });

  // 4. Sắp xếp
  if (sortOrder === 'price_asc') {
    resultProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'price_desc') {
    resultProducts.sort((a, b) => b.price - a.price);
  } else if (sortOrder === 'name_asc') {
    resultProducts.sort((a, b) => (a.productName || '').localeCompare(b.productName || ''));
  } else if (sortOrder === 'name_desc') {
    resultProducts.sort((a, b) => (b.productName || '').localeCompare(a.productName || ''));
  }

  const filteredProducts = resultProducts;

  // ─── FETCH DATA ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, bannersData] = await Promise.all([
          getProducts(priceRange.min, priceRange.max),
          getActiveBanners(),
        ]);
        setProducts(productsData);
        setBanners(bannersData || []);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        setProducts([]);
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [priceRange]);

  // ─── AUTO SLIDE ─────────────────────────────────────────────────────────
  const nextBanner = useCallback(() => {
    if (banners.length > 1) {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }
  }, [banners.length]);

  const prevBanner = useCallback(() => {
    if (banners.length > 1) {
      setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
    }
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(nextBanner, 5000);
    return () => clearInterval(timer);
  }, [banners.length, nextBanner]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setToast({ show: true, name: product.productName });
    setTimeout(() => setToast({ show: false, name: '' }), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Đang tải cửa hàng...</p>
      </div>
    );
  }

  // ─── Lấy banner hiện tại (nếu có) ──────────────────────────────────────
  const activeBanner = banners.length > 0 ? banners[currentBanner] : null;

  return (
    <div>
      {/* ═══ HERO BANNER ═══ */}
      {!searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl mb-12 overflow-hidden border border-white/5"
          style={{ minHeight: '380px' }}
        >
          {/* ── BANNER IMAGE (nếu có banner từ API) ── */}
          {activeBanner ? (
            <>
              {/* Background image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentBanner}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0"
                >
                  <img
                    src={getBannerImageUrl(activeBanner.imageUrl)}
                    alt={activeBanner.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Dark overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 via-slate-900/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-slate-900/20" />
                </motion.div>
              </AnimatePresence>

              {/* Text content overlay */}
              <div className="relative z-10 px-8 py-14 max-w-xl">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 mb-4"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white fill-white" />
                  </div>
                  <span className="text-blue-400 text-xs font-bold uppercase tracking-[0.2em]">NHẬT — Xe Điện 2026</span>
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentBanner}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight drop-shadow-lg">
                      {activeBanner.title}
                    </h1>
                    {activeBanner.subtitle && (
                      <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6 max-w-md drop-shadow-md">
                        {activeBanner.subtitle}
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <a
                    href={activeBanner.linkUrl || '#products'}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
                  >
                    Xem bộ sưu tập
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </motion.div>
              </div>

              {/* Navigation arrows */}
              {banners.length > 1 && (
                <>
                  <button
                    onClick={prevBanner}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 border border-white/10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextBanner}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 border border-white/10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Dots indicator */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {banners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentBanner(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${idx === currentBanner
                            ? 'w-8 bg-blue-400 shadow-lg shadow-blue-400/40'
                            : 'w-2 bg-white/40 hover:bg-white/60'
                          }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            /* ── FALLBACK: Hero mặc định (không có banner từ DB) ── */
            <>
              {/* Decorative elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10 px-8 py-14 max-w-xl">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 mb-4"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white fill-white" />
                  </div>
                  <span className="text-blue-400 text-xs font-bold uppercase tracking-[0.2em]">NHẬT — Xe Điện 2026</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight"
                >
                  Di Chuyển<br />
                  <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                    Không Giới Hạn
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-400 text-base leading-relaxed mb-6 max-w-md"
                >
                  Khám phá bộ sưu tập xe điện cao cấp với công nghệ tiên tiến nhất.
                  Tiết kiệm năng lượng, thân thiện môi trường.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <a
                    href="#products"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
                  >
                    Xem bộ sưu tập
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </motion.div>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* ═══ SECTION HEADER ═══ */}
      <div id="products" className="mb-6">
        <div className="flex justify-between items-end mb-5">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              {searchQuery ? 'Kết quả tìm kiếm' : 'Bộ sưu tập xe điện'}
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              {searchQuery
                ? `Tìm thấy ${filteredProducts.length} kết quả cho "${searchQuery}"`
                : `${filteredProducts.length} mẫu xe đang có sẵn`}
            </p>
          </div>
          {/* Nút bật/tắt bộ lọc nâng cao */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
              showFilters 
                ? 'bg-slate-800 text-white hover:bg-slate-700' 
                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">{showFilters ? 'Đóng bộ lọc' : 'Lọc nâng cao'}</span>
          </button>
        </div>

        {/* ─── FILTER PANEL (COLLAPSIBLE) ─── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* 1. Lọc theo giá (từ PRICE_FILTERS cũ) */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Khoảng giá</label>
                    <div className="flex flex-col gap-2">
                      {PRICE_FILTERS.map((filter) => {
                        const isActive = priceRange.min === filter.min && priceRange.max === filter.max;
                        return (
                          <button
                            key={filter.label}
                            onClick={() => setPriceRange({ min: filter.min, max: filter.max })}
                            className={`text-left px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                              isActive
                                ? 'bg-blue-50 border-blue-500 text-blue-700'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/50'
                            }`}
                          >
                            {filter.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Lọc theo Danh mục */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Danh mục xe</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                    >
                      <option value="">Tất cả danh mục</option>
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* 3. Lọc theo Tốc độ */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tốc độ tối đa</label>
                    <select
                      value={speedFilter}
                      onChange={(e) => setSpeedFilter(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                    >
                      <option value="">Tất cả tốc độ</option>
                      <option value="under_50">Dưới 50 km/h</option>
                      <option value="over_50">Từ 50 km/h trở lên</option>
                    </select>
                  </div>

                  {/* 4. Sắp xếp */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sắp xếp theo</label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                    >
                      <option value="">Mặc định (Mới nhất)</option>
                      <option value="price_asc">Giá: Thấp đến Cao</option>
                      <option value="price_desc">Giá: Cao đến Thấp</option>
                      <option value="name_asc">Tên: A - Z</option>
                      <option value="name_desc">Tên: Z - A</option>
                    </select>
                  </div>
                </div>

                {/* Nút xóa bộ lọc */}
                {(selectedCategory || sortOrder || speedFilter || priceRange.min !== null) && (
                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => {
                        setSelectedCategory('');
                        setSortOrder('');
                        setSpeedFilter('');
                        setPriceRange({ min: null, max: null });
                      }}
                      className="text-sm font-semibold text-red-500 hover:text-red-600 flex items-center gap-1.5 px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Xóa tất cả bộ lọc
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── BỘ LỌC THEO GIÁ (NHANH) - ẨN NẾU ĐÃ MỞ BỘ LỌC NÂNG CAO ─── */}
        {!searchQuery && !showFilters && (
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="flex items-center text-sm font-semibold text-slate-500 mr-1">
              Lọc nhanh giá:
            </span>
            {PRICE_FILTERS.map((filter) => {
              const isActive = priceRange.min === filter.min && priceRange.max === filter.max;
              return (
                <button
                  key={filter.label}
                  onClick={() => setPriceRange({ min: filter.min, max: filter.max })}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/30 scale-105'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ═══ EMPTY STATE ═══ */}
      {filteredProducts.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Không tìm thấy xe điện nào</h3>
          <p className="text-slate-500 mb-6">
            {searchQuery ? `Không có kết quả cho "${searchQuery}".` : 'Chưa có sản phẩm nào.'}
          </p>
          {searchQuery && (
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              Xem tất cả sản phẩm
            </Link>
          )}
        </motion.div>
      )}

      {/* ═══ PRODUCT GRID ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            index={index}
          />
        ))}
      </div>

      <Toast show={toast.show} productName={toast.name} />
    </div>
  );
};

export default HomePage;