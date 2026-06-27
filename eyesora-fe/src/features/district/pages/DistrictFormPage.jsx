import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from "lucide-react";
import axiosClient from "../../../shared/axios/axiosClient.js";

const DistrictFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    const [formData, setFormData] = useState({ districtName: '' });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            axiosClient.get(`/master-data/districts/${id}`).then(r => setFormData(r.data));
        }
    }, [id, isEditMode]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.districtName.trim()) {
            setError("Tên quận/huyện không được để trống");
            return;
        }
        try {
            if (isEditMode) await axiosClient.put(`/master-data/districts/${id}`, formData);
            else await axiosClient.post("/master-data/districts", formData);
            navigate('/districts');
        } catch (err) { setError("Có lỗi xảy ra khi lưu dữ liệu"); }
    };

    return (
        <div className="p-6 bg-[#f5f7fa] h-full overflow-y-auto scrollbar-thin">
            <div className="flex items-center gap-3 mb-6 w-full">
                <button onClick={() => navigate('/districts')} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-blue-900 shadow-sm transition-colors flex items-center">
                    <ArrowLeft size={18}/>
                </button>
                <div>
                    <h1 className="text-lg font-bold text-gray-900">{isEditMode ? "Chỉnh sửa Quận/Huyện" : "Thêm mới Quận/Huyện"}</h1>
                    <p className="text-xs text-gray-500">Quản lý danh mục địa chính</p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full max-w-xl p-6 md:p-8">
                {error && <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-bold flex items-center gap-2"><AlertCircle size={16}/>{error}</div>}

                <form onSubmit={handleSave} className="space-y-5">
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block ml-1">Tên Quận/Huyện (*)</label>
                        <input
                            className="w-full border border-gray-200 bg-white p-3 rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 outline-none text-sm transition-all"
                            value={formData.districtName}
                            onChange={e => setFormData({ districtName: e.target.value })}
                            placeholder="Nhập tên quận/huyện"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-8">
                        <button type="button" onClick={() => navigate('/districts')} className="px-6 py-2.5 border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all rounded-xl text-sm">Hủy bỏ</button>
                        <button type="submit" className="px-8 py-2.5 bg-blue-900 text-white font-bold hover:bg-blue-800 transition-all rounded-xl text-sm shadow-sm">Lưu dữ liệu</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default DistrictFormPage;