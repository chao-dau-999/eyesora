import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from "../../../shared/axios/axiosClient.js";
import { Building2, Eye, SquarePen } from "lucide-react";
import FacilityActions from "../components/FacilityActions.jsx";
import FacilityDetailModal from "../components/FacilityDetailModal.jsx";
import Pagination from "../../../shared/components/Pagination.jsx";

const FacilitiesPage = () => {
    const navigate = useNavigate();
    const [facilities, setFacilities] = useState([]);
    const [modals, setModals] = useState({ detail: false });
    const [pageData, setPageData] = useState({ page: 0, totalPages: 0, totalElements: 0 });
    const [selected, setSelected] = useState(null);

    useEffect(() => { fetchData(0); }, []);

    const fetchData = async (page = 0) => {
        try {
            const res = await axiosClient.get(`/master-data/facilities?page=${page}&size=10`);
            setFacilities(res.data.content || []);
            setPageData({
                page: res.data.number ?? 0,
                totalPages: res.data.totalPages ?? 0,
                totalElements: res.data.totalElements ?? 0
            });
        } catch (error) {
            console.error("Lỗi:", error);
            setPageData({ page: 0, totalPages: 0, totalElements: 0 });
        }
    };

    return (
        <div className="p-6 bg-[#f5f7fa] h-full overflow-y-auto scrollbar-thin">
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Building2 className="text-blue-900" size={22} /> Quản lý cơ sở
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">Tổng số: {pageData.totalElements} cơ sở</p>
                </div>
                {/* Chuyển hướng sang trang Form */}
                <FacilityActions onAdd={() => navigate('/facilities/create')} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <tr>
                        <th className="px-8 py-5">STT</th>
                        <th className="px-8 py-5">Tên cơ sở</th>
                        <th className="px-8 py-5">Loại hình</th>
                        <th className="px-8 py-5 text-right">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                    {facilities.map((f, index) => (
                        <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-8 py-5 font-bold text-gray-500">{(pageData.page * 10) + index + 1}</td>
                            <td className="px-8 py-5 font-bold text-gray-900">{f.facilityName}</td>
                            <td className="px-8 py-5 font-bold text-blue-700">{f.facilityType}</td>
                            <td className="px-8 py-5 text-right flex justify-end gap-2">
                                <button onClick={async () => { const r = await axiosClient.get(`/master-data/facilities/${f.id}`); setSelected(r.data); setModals({ ...modals, detail: true }); }} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-blue-900 shadow-sm"><Eye size={16} /></button>
                                {/* Chuyển hướng sang trang chỉnh sửa */}
                                <button onClick={() => navigate(`/facilities/edit/${f.id}`)} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-blue-900 shadow-sm"><SquarePen size={16} /></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="flex items-center justify-between px-6 py-5 bg-white border-t border-gray-100">
                    <span className="text-xs font-black text-gray-400 uppercase">Trang {pageData.page + 1} / {pageData.totalPages || 1}</span>
                    <Pagination currentPage={pageData.page} totalPages={pageData.totalPages} onPageChange={fetchData} />
                </div>
            </div>

            {modals.detail && <FacilityDetailModal data={selected} onClose={() => setModals({ ...modals, detail: false })} />}
        </div>
    );
};
export default FacilitiesPage;