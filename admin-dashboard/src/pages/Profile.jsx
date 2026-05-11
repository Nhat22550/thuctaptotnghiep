import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { User, Mail, Phone, MapPin, Save, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
    const [profile, setProfile] = useState({
        userName: '',
        fullName: '',
        email: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/auth/me');
            setProfile(response.data);
        } catch (error) {
            console.error('Lỗi khi tải hồ sơ:', error);
            setMessage({ type: 'error', text: 'Không thể tải thông tin hồ sơ.' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            await api.put('/auth/update', {
                fullName: profile.fullName,
                phone: profile.phone,
                address: profile.address
            });
            setMessage({ type: 'success', text: 'Cập nhật hồ sơ thành công!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error('Lỗi khi cập nhật hồ sơ:', error);
            setMessage({ type: 'error', text: 'Cập nhật thất bại. Vui lòng thử lại.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
        >
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                {/* Header Decoration */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                    <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-2xl shadow-lg">
                        <div className="w-24 h-24 bg-slate-100 rounded-xl flex items-center justify-center text-blue-600">
                            <User size={48} strokeWidth={1.5} />
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-8 px-8">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h1 className="text-2xl font-black text-slate-900">{profile.fullName || 'Người dùng mới'}</h1>
                            <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-1">
                                <ShieldCheck size={14} className="text-blue-500" />
                                @{profile.userName}
                            </p>
                        </div>
                        <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                            Thành viên chính thức
                        </div>
                    </div>

                    {message.text && (
                        <div className={`mb-6 p-4 rounded-2xl text-sm font-medium ${
                            message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Họ và Tên</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="text" 
                                        value={profile.fullName || ''}
                                        onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-700 font-medium"
                                        placeholder="Nhập họ tên đầy đủ"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="email" 
                                        value={profile.email || ''}
                                        disabled
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-100 border-transparent text-slate-400 cursor-not-allowed font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Số điện thoại</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="text" 
                                        value={profile.phone || ''}
                                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-700 font-medium"
                                        placeholder="Nhập số điện thoại"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Địa chỉ</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="text" 
                                        value={profile.address || ''}
                                        onChange={(e) => setProfile({...profile, address: e.target.value})}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-700 font-medium"
                                        placeholder="Nhập địa chỉ của bạn"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit"
                                disabled={saving}
                                className="w-full md:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {saving ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Lưu thay đổi
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;
