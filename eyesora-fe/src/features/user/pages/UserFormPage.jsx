import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from "lucide-react";
import axiosClient from "../../../shared/axios/axiosClient.js";

const UserFormPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '', password: '', email: '', fullName: '', facilityId: '', roleNames: []
    });
    const [options, setOptions] = useState({ facilities: [] });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const res = await axiosClient.get('/master-data/facilities?size=999');
                setOptions({ facilities: res.data.content || res.data || [] });
            } catch (err) {
                console.error("Lỗi tải cơ sở:", err);
            }
        };
        fetchFacilities();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            await axiosClient.post('/admin/users/create', formData);
            navigate('/users');
        } catch (err) {
            setErrors({ server: err.response?.data || "Có lỗi xảy ra khi tạo tài khoản." });
        }
    };

    const inputStyle = `w-full border border-gray-200 bg-white p-3 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all text-sm outline-none`;
    const labelStyle = `text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block`;

    return (
        <div className="p-6 bg-[#f5f7fa] h-full overflow-y-auto scrollbar-thin">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate('/users')} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-blue-900 shadow-sm transition-colors">
                    <ArrowLeft size={18}/>
                </button>
                <div>
                    <h1 className="text-lg font-bold text-gray-900">Tạo tài khoản cán bộ/bác sĩ</h1>
                    <p className="text-xs text-gray-500">Phân quyền và chỉ định cơ sở quản lý</p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 max-w-2xl">
                {errors.server && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-bold flex items-center gap-2">
                        <AlertCircle size={16}/> {errors.server}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelStyle}>Tên đăng nhập (*)</label>
                            <input className={inputStyle} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="Nhập username" required />
                        </div>
                        <div>
                            <label className={labelStyle}>Mật khẩu (*)</label>
                            <input className={inputStyle} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="********" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelStyle}>Họ và Tên (*)</label>
                            <input className={inputStyle} value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required />
                        </div>
                        <div>
                            <label className={labelStyle}>Email (*)</label>
                            <input className={inputStyle} type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelStyle}>Vai trò (*)</label>
                            <select className={inputStyle} onChange={e => setFormData({...formData, roleNames: [e.target.value]})}>
                                <option value="DOCTOR">Bác sĩ</option>
                                <option value="STAFF">Cán bộ</option>
                                <option value="ADMIN">Quản trị viên</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelStyle}>Cơ sở (Facility)</label>
                            <select className={inputStyle} value={formData.facilityId} onChange={e => setFormData({...formData, facilityId: e.target.value})}>
                                <option value="">Chọn cơ sở...</option>
                                {options.facilities.map(f => <option key={f.id} value={f.id}>{f.facilityName}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-8">
                        <button type="button" onClick={() => navigate('/users')} className="px-6 py-2.5 border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 rounded-xl text-sm">Hủy bỏ</button>
                        <button type="submit" className="px-8 py-2.5 bg-blue-900 text-white font-bold hover:bg-blue-800 rounded-xl text-sm shadow-sm">Tạo tài khoản</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default UserFormPage;