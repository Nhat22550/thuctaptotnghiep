import React, { useState, useEffect } from 'react';
import { getOrders } from '../services/orderService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { DollarSign, ShoppingBag, TrendingUp, Package } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tính toán thống kê
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  
  // Dữ liệu biểu đồ trạng thái đơn hàng
  const statusCounts = orders.reduce((acc, order) => {
    const status = order.orderStatus || 'PENDING';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status]
  }));

  // Dữ liệu biểu đồ doanh thu 7 ngày gần nhất (giả định theo createdAt)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const revenueByDay = last7Days.reduce((acc, date) => {
    acc[date] = 0;
    return acc;
  }, {});

  orders.forEach(order => {
    if (order.createdAt) {
      const date = order.createdAt.split('T')[0];
      if (revenueByDay[date] !== undefined) {
        revenueByDay[date] += (order.totalAmount || 0);
      }
    }
  });

  const revenueData = last7Days.map(date => ({
    date: date.substring(5), // Hiển thị MM-DD
    revenue: revenueByDay[date]
  }));

  if (loading) {
    return <div className="text-center py-10">Đang tải dữ liệu thống kê...</div>;
  }

  return (
    <div className="pb-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Tổng quan Hệ thống</h1>
      
      {/* Cards thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Tổng doanh thu</p>
            <p className="text-2xl font-bold text-gray-800">{totalRevenue.toLocaleString('vi-VN')} đ</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Tổng số đơn hàng</p>
            <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Biểu đồ doanh thu */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Doanh thu 7 ngày gần nhất
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `${(value/1000000).toFixed(1)}M`} />
                <Tooltip 
                  formatter={(value) => [`${value.toLocaleString('vi-VN')} đ`, 'Doanh thu']}
                  labelFormatter={(label) => `Ngày: ${label}`}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ trạng thái */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-green-500" />
            Đơn hàng theo trạng thái
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
