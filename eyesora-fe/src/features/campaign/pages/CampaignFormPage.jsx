import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from "lucide-react";
import axiosClient from "../../../shared/axios/axiosClient.js";

const CampaignFormPage = () => {
    const navigate = useNavigate();
    const [facilities, setFacilities] = useState([]);
    const [orgs, setOrgs] = useState([]);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        title: '', year: '', startDate: '', managerName: '', orgId: '', targetId: ''
    });

    useEffect(() => {
        fetchMasterData();
    }, []);

    const fetchMasterData = async () => {
        try {
            const res = await axiosClient.get("/master-data/facilities?size=100");
            const all = res.data.content || [];
            setFacilities(all.filter(f => f.facilityType === 'SCHOOL'));
            setOrgs(all.filter(f => f.facilityType !== 'SCHOOL'));
        } catch (error) { console.error("Error:", error); }
    };

    const handleChange = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));
    const getId = (item) => item.id || item.facilityId || item.classId;

    const inputStyle = `w-full border border-gray-200 bg-white p-3 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all text-sm outline-none`;
    const labelStyle = `text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block ml-1`;

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setErrors({});
            await axiosClient.post("/campaigns", formData);
            navigate('/campaigns');
        } catch (err) {
            setErrors(err.response?.data || { server: "Có lỗi xảy ra" });
        }
    };

    return (
        <div className="p-6 bg-[#f5f7fa] h-full overflow-y-auto scrollbar-thin">
            <div className="flex items-center gap-3 mb-6 w-full">
                <button onClick={() => navigate('/campaigns')} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-blue-900 shadow-sm transition-colors flex items-center">
                    <ArrowLeft size={18}/>
                </button>
                <div>
                    <h1 className="text-lg font-bold text-gray-900">Tạo mới chiến dịch khám</h1>
                    <p className="text-xs text-gray-500">Thiết lập thông tin chiến dịch mới</p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full p-6 md:p-8">
                {errors.server && <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-bold flex items-center gap-2"><AlertCircle size={16}/>{errors.server}</div>}

                <form onSubmit={handleSave} className="space-y-5 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelStyle}>Tên chiến dịch (*)</label>
                            <input className={inputStyle} value={formData.title} onChange={e => handleChange('title', e.target.value)} placeholder="Nhập tên chiến dịch" />
                        </div>
                        <div>
                            <label className={labelStyle}>Năm (*)</label>
                            <input className={inputStyle} value={formData.year} onChange={e => handleChange('year', e.target.value)} placeholder="Ví dụ: 2026" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelStyle}>Ngày bắt đầu (*)</label>
                            <input type="date" className={inputStyle} value={formData.startDate} onChange={e => handleChange('startDate', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelStyle}>Người quản lý (*)</label>
                            <input className={inputStyle} value={formData.managerName} onChange={e => handleChange('managerName', e.target.value)} placeholder="Nhập tên người quản lý" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelStyle}>Đơn vị tổ chức (*)</label>
                            <select className={inputStyle} value={formData.orgId} onChange={e => handleChange('orgId', e.target.value)}>
                                <option value="">-- Chọn đơn vị --</option>
                                {orgs.map(o => <option key={getId(o)} value={getId(o)}>{o.facilityName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelStyle}>Trường học mục tiêu (*)</label>
                            <select className={inputStyle} value={formData.targetId} onChange={e => handleChange('targetId', e.target.value)}>
                                <option value="">-- Chọn trường học --</option>
                                {facilities.map(f => <option key={getId(f)} value={getId(f)}>{f.facilityName}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-8 w-full">
                        <button type="button" onClick={() => navigate('/campaigns')} className="px-6 py-2.5 border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all rounded-xl text-sm">Hủy bỏ</button>
                        <button type="submit" className="px-8 py-2.5 bg-blue-900 text-white font-bold hover:bg-blue-800 transition-all rounded-xl text-sm shadow-sm">Lưu chiến dịch</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CampaignFormPage;