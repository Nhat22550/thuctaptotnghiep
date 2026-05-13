import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User, Zap, Menu, X, Moon, Sun, ChevronDown, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '../services/productService'; // Add this
import ChatBox from '../components/ChatBox';

const UserLayout = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Mega Menu State
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const menuTimerRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);

    // Fetch products for Mega Menu
    const fetchMegaMenuProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products for mega menu", error);
      }
    };
    fetchMegaMenuProducts();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/');
    }
    setMobileMenuOpen(false);
  };

  // Mega Menu Hover Logic
  const handleMouseEnter = () => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    setMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    menuTimerRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 300); // 300ms delay to allow moving mouse into the menu
  };

  // Get products per segment (max 3 per column)
  const hocSinhProducts = products.filter(p => p.segment === 'Học sinh').slice(0, 3);
  const sinhVienProducts = products.filter(p => p.segment === 'Sinh viên').slice(0, 3);
  const theThaoProducts = products.filter(p => p.segment === 'Thể thao').slice(0, 3);

  // Fallback image handling
  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('/uploads/')) return `http://localhost:8810${url}`;
    return url;
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  // --- MEGA MENU COMPONENT ---
  const MegaMenu = () => {
    return (
      <AnimatePresence>
        {megaMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`absolute top-full left-0 w-[800px] -ml-[200px] pt-4 z-50`}
          >
            <div className={`p-6 rounded-2xl shadow-2xl border backdrop-blur-xl ${darkMode ? 'bg-slate-900/90 border-white/10' : 'bg-white/95 border-gray-200'
              }`}>
              <div className="grid grid-cols-3 gap-8">
                {/* Cột 1: Học sinh */}
                <div>
                  <h3 className={`text-sm tracking-wider font-bold uppercase mb-4 pb-2 border-b ${darkMode ? 'text-blue-400 border-white/10' : 'text-blue-600 border-gray-200'
                    }`}>Học sinh (Dưới 50cc)</h3>
                  <div className="space-y-4">
                    {hocSinhProducts.length > 0 ? hocSinhProducts.map(p => (
                      <Link key={p.id} to={`/?search=${p.productName}`} className="group flex items-center gap-3" onClick={() => setMegaMenuOpen(false)}>
                        <div className={`w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center p-1 transition-transform group-hover:scale-110 ${darkMode ? 'bg-white/5' : 'bg-gray-100'
                          }`}>
                          <img src={getImageUrl(p.imageUrl)} alt={p.productName} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <h4 className={`text-sm font-semibold transition-colors group-hover:text-blue-500 line-clamp-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'
                            }`}>{p.productName}</h4>
                          <p className={`text-xs mt-0.5 ${darkMode ? 'text-blue-400/80' : 'text-blue-600/80'}`}>
                            {Number(p.price).toLocaleString()}đ
                          </p>
                        </div>
                      </Link>
                    )) : <p className="text-gray-500 text-sm">Đang cập nhật...</p>}
                  </div>
                </div>

                {/* Cột 2: Sinh viên */}
                <div>
                  <h3 className={`text-sm tracking-wider font-bold uppercase mb-4 pb-2 border-b ${darkMode ? 'text-blue-400 border-white/10' : 'text-blue-600 border-gray-200'
                    }`}>Sinh viên - Thời trang</h3>
                  <div className="space-y-4">
                    {sinhVienProducts.length > 0 ? sinhVienProducts.map(p => (
                      <Link key={p.id} to={`/?search=${p.productName}`} className="group flex items-center gap-3" onClick={() => setMegaMenuOpen(false)}>
                        <div className={`w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center p-1 transition-transform group-hover:scale-110 ${darkMode ? 'bg-white/5' : 'bg-gray-100'
                          }`}>
                          <img src={getImageUrl(p.imageUrl)} alt={p.productName} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <h4 className={`text-sm font-semibold transition-colors group-hover:text-blue-500 line-clamp-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'
                            }`}>{p.productName}</h4>
                          <p className={`text-xs mt-0.5 ${darkMode ? 'text-blue-400/80' : 'text-blue-600/80'}`}>
                            {Number(p.price).toLocaleString()}đ
                          </p>
                        </div>
                      </Link>
                    )) : <p className="text-gray-500 text-sm">Đang cập nhật...</p>}
                  </div>
                </div>

                {/* Cột 3: Thể thao */}
                <div>
                  <h3 className={`text-sm tracking-wider font-bold uppercase mb-4 pb-2 border-b ${darkMode ? 'text-blue-400 border-white/10' : 'text-blue-600 border-gray-200'
                    }`}>Thể thao - Cá tính</h3>
                  <div className="space-y-4">
                    {theThaoProducts.length > 0 ? theThaoProducts.map(p => (
                      <Link key={p.id} to={`/?search=${p.productName}`} className="group flex items-center gap-3" onClick={() => setMegaMenuOpen(false)}>
                        <div className={`w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center p-1 transition-transform group-hover:scale-110 ${darkMode ? 'bg-white/5' : 'bg-gray-100'
                          }`}>
                          <img src={getImageUrl(p.imageUrl)} alt={p.productName} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <h4 className={`text-sm font-semibold transition-colors group-hover:text-blue-500 line-clamp-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'
                            }`}>{p.productName}</h4>
                          <p className={`text-xs mt-0.5 ${darkMode ? 'text-blue-400/80' : 'text-blue-600/80'}`}>
                            {Number(p.price).toLocaleString()}đ
                          </p>
                        </div>
                      </Link>
                    )) : <p className="text-gray-500 text-sm">Đang cập nhật...</p>}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-white text-slate-900">

      {/* ═══ HEADER — Glassmorphism Navbar ═══ */}
      <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm'
          : 'bg-white/70 backdrop-blur-md border-b border-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 relative">

            {/* ── Logo "NHẬT" ── */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
              <span className="text-2xl font-black tracking-tight text-blue-600">
                NHẬT<span className="text-blue-400">.</span>
              </span>
            </Link>

            {/* ── Nav Links (desktop) ── */}
            <nav className="hidden md:flex items-center gap-2 ml-4">
              {/* SẢN PHẨM (MEGA MENU) */}
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to="/"
                  className="flex items-center gap-1 relative px-4 py-2 text-sm font-medium rounded-lg transition-colors text-slate-800 hover:text-blue-500"
                >
                  Sản phẩm
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${megaMenuOpen ? 'rotate-180' : ''}`} />

                  {location.pathname === '/' && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                    />
                  )}
                </Link>
                <MegaMenu />
              </div>

              {/* GIỚI THIỆU */}
              <Link
                to="/about"
                className="relative px-4 py-2 text-sm font-medium rounded-lg transition-colors text-slate-800 hover:text-blue-500"
              >
                Giới thiệu
                {location.pathname === '/about' && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                  />
                )}
              </Link>
            </nav>

            {/* ── Search (desktop) ── */}
            <div className="hidden md:flex flex-1 max-w-sm mx-6">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm xe điện..."
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl text-sm transition-all outline-none bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors text-slate-400 hover:text-blue-500">
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* ── Right actions (desktop) ── */}
            <div className="hidden md:flex items-center gap-2">
              {localStorage.getItem('role') === 'ADMIN' && (
                <Link 
                  to="/admin"
                  className="p-2 rounded-xl flex items-center gap-1.5 transition-all text-sm font-bold text-blue-600 hover:bg-blue-50 bg-blue-50/50"
                  title="Trang quản trị"
                >
                  <Zap className="w-4 h-4 fill-blue-600" />
                  <span>Quản trị</span>
                </Link>
              )}
              <Link
                to="/cart"
                className="relative p-2 rounded-xl flex items-center gap-1.5 transition-all text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-100"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40 border border-white"
                  >
                    {totalItems > 9 ? '9+' : totalItems}
                  </motion.span>
                )}
              </Link>

              {localStorage.getItem('token') ? (
                <div className="flex items-center gap-2 ml-2">
                  <Link 
                    to="/profile"
                    className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl transition-all hover:bg-slate-100 group"
                    title="Xem hồ sơ cá nhân"
                  >
                    <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col items-start leading-tight">
                      <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold group-hover:text-blue-400">Thành viên</span>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600">Chào, {localStorage.getItem('username')}</span>
                    </div>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-xl transition-all text-slate-700 hover:text-blue-600 hover:bg-slate-100">
                    <User className="w-5 h-5" />
                  </button>
                  <Link 
                    to="/login"
                    className="ml-2 px-5 py-2 rounded-full border border-blue-500 text-blue-500 font-medium text-sm hover:bg-blue-500 hover:text-white transition-all shadow-sm hover:shadow-blue-500/20"
                  >
                    Đăng nhập
                  </Link>
                </div>
              )}
            </div>

            {/* ── Mobile buttons ── */}
            <div className="flex md:hidden items-center gap-3">
              <Link to="/cart" className="relative p-2 text-slate-700">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-blue-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-700">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile search & nav */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden border-t border-white/5 pb-4"
              >
                <form onSubmit={handleSearch} className="relative mt-3">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm xe điện..."
                    className="w-full pl-4 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/50"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <Search className="w-4 h-4" />
                  </button>
                </form>
                <div className="flex flex-col gap-1 mt-3">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Sản phẩm
                  </Link>
                  {localStorage.getItem('role') === 'ADMIN' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-2.5 text-sm font-bold text-blue-500 hover:bg-blue-50/10 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4 fill-blue-500" />
                      Trang quản trị
                    </Link>
                  )}
                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Giỏ hàng / Phụ kiện
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full z-0 relative">
        <Outlet />
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className={`py-14 border-t transition-colors duration-300 ${darkMode ? 'bg-slate-950 border-white/5 text-gray-500' : 'bg-slate-900 border-slate-800 text-slate-400'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Zap className="w-5 h-5 text-white fill-white" />
                </div>
                <span className="text-2xl font-black text-white">NHẬT<span className="text-blue-500">.</span></span>
              </div>
              <p className="text-sm leading-relaxed">
                Hệ thống phân phối xe điện cao cấp hàng đầu Việt Nam.
                Mang đến trải nghiệm di chuyển xanh, hiện đại và bền vững.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Danh mục</h3>
              <ul className="space-y-2.5 text-sm">
                {['Xe Máy Điện', 'Xe Đạp Điện', 'Phụ Kiện', 'Khuyến Mãi'].map((l) => (
                  <li key={l}>
                    <Link to="/" className="hover:text-blue-400 transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Liên hệ</h3>
              <ul className="space-y-2.5 text-sm">
                <li>📍 123 Đường Điện Biên, Q.1, TP.HCM</li>
                <li>📞 1800 1234 (miễn phí)</li>
                <li>✉️ support@nhat.vn</li>
                <li>⏰ 8:00 – 20:00, T2 – CN</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 text-center text-sm">
            <p>© 2026 <strong className="text-white">NHẬT</strong> — Xe Điện Tương Lai. Phục vụ với 100% đam mê ⚡</p>
          </div>
        </div>
      </footer>

      {/* ═══ CHATBOT UI ═══ */}
      <ChatBox />
    </div>
  );
};

export default UserLayout;