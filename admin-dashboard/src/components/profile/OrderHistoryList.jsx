import React, { useState, useEffect } from 'react';
import { Package, Search, Eye, Calendar, DollarSign, CreditCard } from 'lucide-react';
import { getOrdersByUserId } from '../../services/orderService';

const OrderHistoryList = ({ userId, onViewDetails }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            fetchOrders();
        }
    }, [userId]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getOrdersByUserId(userId);
            setOrders(data);
        } catch (error) {
            console.error('Lỗi khi tải lịch sử đơn hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'PAID':
            case 'COMPLETED':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'CANCELLED':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const formatStatus = (status) => {
        switch (status) {
            case 'PENDING': return 'Chờ thanh toán';
            case 'PAID': return 'Đã thanh toán';
            case 'COMPLETED': return 'Hoàn thành';
            case 'CANCELLED': return 'Đã hủy';
            default: return status;
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <Package size={48} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Chưa có đơn hàng nào</h3>
                <p className="text-slate-500 max-w-md">Bạn chưa thực hiện giao dịch nào trên hệ thống. Hãy mua sắm để theo dõi đơn hàng tại đây nhé.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <Package className="text-blue-600" />
                Đơn hàng của bạn
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all group">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-slate-900">#{order.id}</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                        {formatStatus(order.status)}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 font-medium">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar size={16} className="text-slate-400" />
                                        {order.orderedDate ? new Date(order.orderedDate).toLocaleDateString('vi-VN') : 'N/A'}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <DollarSign size={16} className="text-slate-400" />
                                        {formatCurrency(order.total)}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <CreditCard size={16} className="text-slate-400" />
                                        {order.status === 'PENDING' ? 'COD / VNPay' : 'Đã thanh toán'}
                                    </span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => onViewDetails(order.id)}
                                className="w-full md:w-auto px-5 py-2.5 bg-blue-50 text-blue-600 font-bold rounded-xl flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white transition-colors"
                            >
                                <Eye size={18} />
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistoryList;
