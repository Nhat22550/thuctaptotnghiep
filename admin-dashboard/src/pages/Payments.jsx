import React, { useState, useEffect } from 'react';
import { getPayments } from '../services/paymentService';
import { CreditCard, Calendar, DollarSign, Activity } from 'lucide-react';

const Payments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const data = await getPayments();
      setPayments(data);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'paid':
        return 'bg-emerald-50 text-emerald-600';
      case 'failed':
      case 'error':
        return 'bg-red-50 text-red-600';
      case 'pending':
      default:
        return 'bg-amber-50 text-amber-600';
    }
  };

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Thanh toán</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Tổng giao dịch</p>
            <h3 className="text-xl font-bold text-gray-900">{payments.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Thành công</p>
            <h3 className="text-xl font-bold text-gray-900">
              {payments.filter(p => ['success', 'completed', 'paid'].includes(p.status?.toLowerCase())).length}
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
                <th className="py-4 px-6 w-20">ID</th>
                <th className="py-4 px-6">Mã Đơn</th>
                <th className="py-4 px-6 text-right">Số tiền (VNĐ)</th>
                <th className="py-4 px-6">Phương thức</th>
                <th className="py-4 px-6">Ngày thanh toán</th>
                <th className="py-4 px-6">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-gray-500">#{payment.id}</td>
                  <td className="py-4 px-6 font-medium text-blue-600">
                    #{payment.orderId}
                  </td>
                  <td className="py-4 px-6 text-right font-semibold text-gray-900">
                    {Number(payment.amount).toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      Mặc định
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {payment.paymentDate ? new Date(payment.paymentDate).toLocaleString('vi-VN') : 'N/A'}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status || 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    Chưa có giao dịch thanh toán nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
