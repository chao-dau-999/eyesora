import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from "lucide-react";
import axiosClient from "../../../shared/axios/axiosClient.js";

const FacilityFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        facilityName: '', facilityType: 'CLINIC', address: '', phone: '', wardId: '', districtId: ''
    });
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        axiosClient.get("/master-data/districts?size=100").then(r => setDistricts(r.data.content || []));
        if (isEditMode) {
            axiosClient.get(`/master-data/facilities/${id}`).then(r => {
                setFormData(r.data);
                if (r.data.districtId) fetchWards(r.data.districtId);
            });
        }
    }, [id, isEditMode]);

    const fetchWards = async (dId) => {
        const res = await axiosClient.get(`/master-data/wards?districtId=${dId}&size=100`);
        setWards(res.data.content || []);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) await axiosClient.put(`/master-data/facilities/${id}`, formData);
            else await axiosClient.post("/master-data/facilities", formData);
            navigate('/facilities');
        } catch (err) {
            setErrors(err.response?.data || { server: "Có lỗi xảy ra" });
        }
    };

    const inputStyle = `w-full border border-gray-200 bg-white p-3 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all text-sm outline-none`;
    const labelStyle = `text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block ml-1`;

    return (
        <div className="p-6 bg-[#f5f7fa] h-full overflow-y-auto scrollbar-thin">
            <div className="flex items-center gap-3 mb-6 w-full">
                <button onClick={() => navigate('/facilities')} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-blue-900 shadow-sm transition-colors flex items-center">
                    <ArrowLeft size={18}/>
                </button>
                <div>
                    <h1 className="text-lg font-bold text-gray-900">{isEditMode ? "Chỉnh sửa cơ sở" : "Thêm mới cơ sở"}</h1>
                    <p className="text-xs text-gray-500">Quản lý thông tin chi tiết của cơ sở y tế/trường học</p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full p-6 md:p-8">
                {errors.server && <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-bold flex items-center gap-2"><AlertCircle size={16}/>{errors.server}</div>}

                <form onSubmit={handleSave} className="space-y-5 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelStyle}>Tên cơ sở (*)</label>
                            <input className={inputStyle} value={formData.facilityName} onChange={e => setFormData({...formData, facilityName: e.target.value})} placeholder="Nhập tên cơ sở" />
                        </div>
                        <div>
                            <label className={labelStyle}>Loại hình (*)</label>
                            <select className={inputStyle} value={formData.facilityType} onChange={e => setFormData({...formData, facilityType: e.target.value})}>
                                <option value="CLINIC">Phòng khám</option>
                                <option value="HOSPITAL">Bệnh viện</option>
                                <option value="SCHOOL">Trường học</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelStyle}>Quận/Huyện (*)</label>
                            <select className={inputStyle} value={formData.districtId} onChange={e => { setFormData({...formData, districtId: e.target.value, wardId: ''}); fetchWards(e.target.value); }}>
                                <option value="">Chọn Quận/Huyện</option>
                                {districts.map(d => <option key={d.id} value={d.id}>{d.districtName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelStyle}>Phường/Xã (*)</label>
                            <select className={inputStyle} value={formData.wardId} onChange={e => setFormData({...formData, wardId: e.target.value})}>
                                <option value="">Chọn Phường/Xã</option>
                                {wards.map(w => <option key={w.id} value={w.id}>{w.wardName}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={labelStyle}>Số điện thoại (*)</label>
                        <input
                            className={inputStyle}
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                            placeholder="Nhập số điện thoại (10-11 số)"
                        />
                        {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                        <label className={labelStyle}>Địa chỉ</label>
                        <input className={inputStyle} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Số nhà, đường..." />
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-8 w-full">
                        <button type="button" onClick={() => navigate('/facilities')} className="px-6 py-2.5 border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all rounded-xl text-sm">Hủy bỏ</button>
                        <button type="submit" className="px-8 py-2.5 bg-blue-900 text-white font-bold hover:bg-blue-800 transition-all rounded-xl text-sm shadow-sm">Lưu cơ sở</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default FacilityFormPage;