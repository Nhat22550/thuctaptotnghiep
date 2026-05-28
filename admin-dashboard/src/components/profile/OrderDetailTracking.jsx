import React, { useState, useEffect } from 'react';
import { getOrderById } from '../../services/orderService';
import { ArrowLeft, MapPin, Phone, User, Package, Clock, CheckCircle2, Truck } from 'lucide-react';

const OrderDetailTracking = ({ orderId, onBack }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const data = await getOrderById(orderId);
            setOrder(data);
        } catch (error) {
            console.error('Lỗi khi tải chi tiết đơn hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
    };

    // Xác định Step hiện tại
    const getActiveStep = () => {
        if (!order) return 0;
        if (order.status === 'PENDING') return 1;
        if (order.status === 'PAID' && order.deliveryStatus === 'WAITING_PAYMENT') return 2;
        if (order.deliveryStatus === 'SHIPPING') return 3;
        if (order.status === 'COMPLETED' || order.deliveryStatus === 'DELIVERED') return 4;
        return 0;
    };

    const activeStep = getActiveStep();

    const steps = [
        { id: 1, label: 'Chờ thanh toán', icon: Clock },
        { id: 2, label: 'Đã thanh toán', icon: CheckCircle2, subtitle: 'VNPay' },
        { id: 3, label: 'Đang chuẩn bị & Giao', icon: Truck },
        { id: 4, label: 'Thành công', icon: Package }
    ];

    if (loading || !order) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors"
            >
                <ArrowLeft size={20} />
                Quay lại danh sách
            </button>

            {/* Stepper */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-black text-slate-900 mb-8">
                    Trạng thái đơn hàng <span className="text-blue-600">#{order.id}</span>
                </h2>
                
                <div className="relative">
                    {/* Progress Bar Background */}
                    <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-100 -translate-y-1/2 rounded-full hidden md:block"></div>
                    
                    {/* Active Progress Bar */}
                    <div 
                        className="absolute top-1/2 left-0 h-1.5 bg-blue-500 -translate-y-1/2 rounded-full hidden md:block transition-all duration-500"
                        style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
                    ></div>

                    <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-0 relative z-10">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = activeStep >= step.id;
                            const isCurrent = activeStep === step.id;

                            return (
                                <div key={step.id} className="flex md:flex-col items-center md:items-center gap-4 md:gap-3 flex-1">
                                    {/* Icon Circle */}
                                    <div className={`
                                        w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300
                                        ${isActive ? 'bg-blue-600 border-white text-white shadow-lg shadow-blue-500/30' : 'bg-slate-50 border-slate-100 text-slate-400'}
                                        ${isCurrent ? 'ring-4 ring-blue-100' : ''}
                                    `}>
                                        <Icon size={20} />
                                    </div>
                                    
                                    {/* Label */}
                                    <div className="text-left md:text-center">
                                        <p className={`font-bold text-sm ${isActive ? 'text-blue-900' : 'text-slate-500'}`}>
                                            {step.label}
                                        </p>
                                        {step.subtitle && (
                                            <p className="text-xs font-bold text-blue-500 mt-0.5">{step.subtitle}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Thông tin giao hàng */}
                <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-fit">
                    <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                        <MapPin className="text-blue-600" size={20} />
                        Thông tin nhận hàng
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <User size={18} className="text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Người nhận</p>
                                <p className="font-medium text-slate-800">{order.receiverName || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone size={18} className="text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Số điện thoại</p>
                                <p className="font-medium text-slate-800">{order.phoneNumber || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin size={18} className="text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Địa chỉ giao hàng</p>
                                <p className="font-medium text-slate-800">{order.shippingAddress || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                        <Package className="text-blue-600" size={20} />
                        Sản phẩm đã đặt
                    </h3>
                    
                    <div className="divide-y divide-slate-100">
                        {order.items && order.items.length > 0 ? (
                            order.items.map((item, idx) => (
                                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                                    <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0">
                                        <img 
                                            src={item.product?.image || '/placeholder-bike.png'} 
                                            alt="product" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {e.target.src = 'https://via.placeholder.com/150'}}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-900 truncate">
                                            {item.product?.productName || `Sản phẩm`}
                                        </h4>
                                        <p className="text-sm font-medium text-slate-500 mt-1">
                                            {formatCurrency(item.product?.price || 0)} <span className="mx-1">x</span> {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-blue-600">
                                            {formatCurrency(item.subTotal || 0)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 text-sm text-center py-4">Không có chi tiết sản phẩm.</p>
                        )}
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                        <span className="font-bold text-slate-500">Tổng cộng:</span>
                        <span className="text-xl font-black text-blue-600">{formatCurrency(order.total)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailTracking;
