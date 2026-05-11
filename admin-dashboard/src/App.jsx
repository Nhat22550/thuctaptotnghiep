import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- CART CONTEXT ---
import { CartProvider } from './context/CartContext';

// --- CÁC IMPORT CỦA ADMIN ---
import Layout from './components/Layout';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Products from './pages/Products';
import Users from './pages/Users';
import Orders from './pages/Orders';
import PaymentList from './pages/PaymentList';
import Banners from './pages/Banners';

// --- CÁC IMPORT CỦA USER ---
import UserLayout from './layouts/UserLayout';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import PaymentResult from './pages/PaymentResult';
import Profile from './pages/Profile';
import About from './pages/About';

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* =======================================
              MẶT TIỀN: DÀNH CHO KHÁCH MUA XE ĐIỆN
          ======================================= */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<HomePage />} />
            <Route path="product/:id" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="payment/return" element={<PaymentResult />} />
            <Route path="profile" element={<Profile />} />
            <Route path="about" element={<About />} />
          </Route>

          {/* TRANG ĐĂNG NHẬP VÀ KHÔI PHỤC MẬT KHẨU */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* =======================================
              HẬU CUNG: DÀNH CHO ADMIN
          ======================================= */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="categories" element={<Categories />} />
              <Route path="products" element={<Products />} />
              <Route path="users" element={<Users />} />
              <Route path="orders" element={<Orders />} />
              <Route path="payments" element={<PaymentList />} />
              <Route path="banners" element={<Banners />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;