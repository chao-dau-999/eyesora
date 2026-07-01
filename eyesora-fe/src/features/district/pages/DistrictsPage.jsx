import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from "../../../shared/axios/axiosClient.js";
import { MapPin, SquarePen } from "lucide-react";
import AddressActions from "../../../shared/components/AddressActions.jsx";
import Pagination from "../../../shared/components/Pagination.jsx";

const DistrictsPage = () => {
    const navigate = useNavigate();
    const [districts, setDistricts] = useState([]);
    const [pageData, setPageData] = useState({ page: 0, totalPages: 0, totalElements: 0 });

    const fetchDistricts = async (page = 0) => {
        try {
            const res = await axiosClient.get(`/master-data/districts?page=${page}&size=10`);
            const data = res.data;

            setDistricts(data.content || []);
            setPageData({
                page: data.number ?? 0,
                totalPages: data.totalPages ?? 0,
                totalElements: data.totalElements ?? 0
            });
        } catch (error) {
            console.error("Lỗi:", error);
        }
    };

    useEffect(() => { fetchDistricts(); }, []);

    return (
        <div className="p-6 bg-[#f5f7fa] h-full overflow-y-auto scrollbar-thin">
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <MapPin className="text-blue-900"/> Quản lý Quận/Huyện
                    </h2>
                    <p className="text-gray-500 text-xs mt-1">Tổng số: {pageData.totalElements} quận/huyện</p>
                </div>
                <AddressActions onAdd={() => navigate('/districts/create')} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <tr>
                        <th className="px-8 py-5">STT</th>
                        <th className="px-8 py-5">Tên Quận/Huyện</th>
                        <th className="px-8 py-5 text-right">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                    {districts.map((d, index) => (
                        <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-8 py-5 font-bold text-gray-500 text-sm">{(pageData.page * 10) + index + 1}</td>
                            <td className="px-8 py-5 font-bold text-gray-900 text-sm">{d.districtName}</td>
                            <td className="px-8 py-5 text-right">
                                <button onClick={() => navigate(`/districts/edit/${d.id}`)} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-blue-900 shadow-sm transition-all">
                                    <SquarePen size={16}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="flex items-center justify-between px-6 py-5 bg-white border-t border-gray-100">
                    <span className="text-xs font-black text-gray-400 uppercase">Trang {pageData.page + 1} / {pageData.totalPages || 1}</span>
                    <Pagination currentPage={pageData.page} totalPages={pageData.totalPages} onPageChange={fetchDistricts} />
                </div>
            </div>
        </div>
    );
};
export default DistrictsPage;