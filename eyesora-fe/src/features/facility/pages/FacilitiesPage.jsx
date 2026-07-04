import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from "../../../shared/axios/axiosClient.js";
import { Building2 } from "lucide-react";
import FacilityActions from "../components/FacilityActions.jsx";
import FacilityDetailModal from "../components/FacilityDetailModal.jsx";
import Pagination from "../../../shared/components/Pagination.jsx";
import FacilityTable from "../components/FacilityTable.jsx";

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

    const handleView = async (id) => {
        const r = await axiosClient.get(`/master-data/facilities/${id}`);
        setSelected(r.data);
        setModals({ detail: true });
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
                <FacilityActions onAdd={() => navigate('/facilities/create')} />
            </div>

            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <FacilityTable
                    facilities={facilities}
                    page={pageData.page}
                    onEdit={(id) => navigate(`/facilities/edit/${id}`)}
                    onView={handleView}
                />
            </div>

            <div className="flex items-center justify-between px-6 py-5 bg-white border-t border-gray-100 rounded-b-2xl">
                <span className="text-xs font-black text-gray-400 uppercase">Trang {pageData.page + 1} / {pageData.totalPages || 1}</span>
                <Pagination currentPage={pageData.page} totalPages={pageData.totalPages} onPageChange={fetchData} />
            </div>

            {modals.detail && <FacilityDetailModal data={selected} onClose={() => setModals({ detail: false })} />}
        </div>
    );
};

export default FacilitiesPage;