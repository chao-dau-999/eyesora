import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from "lucide-react";
import axiosClient from "../../../shared/axios/axiosClient.js";

const ClassFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({ className: '', grade: '', facilityId: '', schoolYear: '' });
    const [facilities, setFacilities] = useState([]);
    const [errors, setErrors] = useState({});
    const [pageLoading, setPageLoading] = useState(isEditMode);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fRes = await axiosClient.get("/master-data/facilities?size=100");
                const facilityList = fRes.data.content || [];
                setFacilities(facilityList);

                if (isEditMode) {
                    const res = await axiosClient.get(`/master-data/classes/${id}`);
                    const c = res.data;

                    const matchedFacility = facilityList.find(f => f.facilityName === c.facilityName);

                    setFormData({
                        className: c.className || '',
                        grade: String(c.grade || ''),
                        facilityId: matchedFacility ? String(matchedFacility.id) : '',
                        schoolYear: c.schoolYear || ''
                    });
                }
            } catch (err) {
                console.error("Lỗi:", err);
            } finally {
                setPageLoading(false);
            }
        };
        fetchData();
    }, [id, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        let newErrors = {};
        if (!formData.className.trim()) newErrors.className = "Class Name is required";
        if (!formData.grade.trim()) newErrors.grade = "Grade Level is required";
        if (!formData.facilityId) newErrors.facilityId = "Facility is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const payload = { ...formData, grade: parseInt(formData.grade) };
            if (isEditMode) await axiosClient.put(`/master-data/classes/${id}`, payload);
            else await axiosClient.post("/master-data/classes", payload);
            navigate('/classes');
        } catch (err) {
            setErrors(err.response?.data || { server: "Lưu thất bại" });
        }
    };

    const inputStyle = `w-full border border-gray-200 bg-white p-3 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all text-sm outline-none`;
    const labelStyle = `text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block`;

    if (pageLoading) return <div className="p-6 text-center text-gray-500">Đang tải...</div>;

    return (
        <div className="p-6 bg-[#f5f7fa] h-full overflow-y-auto scrollbar-thin">
            <div className="flex items-center gap-3 mb-6 w-full">
                <button onClick={() => navigate('/classes')} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-blue-900 shadow-sm transition-colors cursor-pointer">
                    <ArrowLeft size={18}/>
                </button>
                <div>
                    <h1 className="text-lg font-bold text-gray-900">
                        {isEditMode ? "Chỉnh sửa thông tin lớp" : "Thêm mới lớp học"}
                    </h1>
                    <p className="text-xs text-gray-500">Quản lý và cập nhật thông tin lớp học trong hệ thống</p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full p-6 md:p-8">
                {errors.server && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-bold flex items-center gap-2">
                        <AlertCircle size={16}/> {errors.server}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelStyle}>Tên lớp (*)</label>
                            <input className={inputStyle} value={formData.className} onChange={e => setFormData({...formData, className: e.target.value})} placeholder="Ví dụ: 10A1" />
                            {errors.className && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.className}</p>}
                        </div>
                        <div>
                            <label className={labelStyle}>Khối (*)</label>
                            <input type="number" className={inputStyle} value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} placeholder="Ví dụ: 10" />
                            {errors.grade && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.grade}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelStyle}>Năm học</label>
                            <input className={inputStyle} value={formData.schoolYear} onChange={e => setFormData({...formData, schoolYear: e.target.value})} placeholder="Ví dụ: 2025-2026" />
                        </div>
                        <div>
                            <label className={labelStyle}>Cơ sở (*)</label>
                            <select className={inputStyle} value={formData.facilityId} onChange={e => setFormData({...formData, facilityId: e.target.value})}>
                                <option value="">Chọn cơ sở...</option>
                                {facilities.map(f => <option key={f.id} value={String(f.id)}>{f.facilityName}</option>)}
                            </select>
                            {errors.facilityId && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.facilityId}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-8">
                        <button type="button" onClick={() => navigate('/classes')} className="px-6 py-2.5 border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all rounded-xl text-sm">
                            Hủy bỏ
                        </button>
                        <button type="submit" className="px-8 py-2.5 bg-blue-900 text-white font-bold hover:bg-blue-800 transition-all rounded-xl text-sm shadow-sm">
                            Lưu thông tin
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default ClassFormPage;