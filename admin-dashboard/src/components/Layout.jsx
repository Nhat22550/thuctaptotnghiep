import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
