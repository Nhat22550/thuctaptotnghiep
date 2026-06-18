import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, List, Users, ClipboardList, CreditCard, Image, Package, MessageCircle } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col transition-all duration-300">
      <div className="p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingBag className="w-8 h-8 text-blue-400" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            EV Admin
          </span>
        </h1>
      </div>
      <nav className="flex-1 mt-6">
        <ul className="space-y-2 px-4">
          <li>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5" />
              Tổng quan
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-800 hover:text-white`
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home w-5 h-5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Về Trang chủ
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/categories"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <List className="w-5 h-5" />
              Quản lý Danh mục
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <ShoppingBag className="w-5 h-5" />
              Quản lý Sản phẩm
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/inventory"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <Package className="w-5 h-5" />
              Quản lý tồn kho
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <Users className="w-5 h-5" />
              Quản lý Người dùng
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <ClipboardList className="w-5 h-5" />
              Quản lý Đơn hàng
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/payments"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <CreditCard className="w-5 h-5" />
              Quản lý Thanh toán
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/banners"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <Image className="w-5 h-5" />
              Quản lý Banner
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/discounts"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <ClipboardList className="w-5 h-5" />
              Quản lý Mã giảm giá
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/reviews"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <MessageCircle className="w-5 h-5" />
              Đánh giá & Bình luận
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
