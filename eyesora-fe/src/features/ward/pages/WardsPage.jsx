import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from "../../../shared/axios/axiosClient.js";
import { Building, SquarePen, Plus } from "lucide-react";
import Pagination from "../../../shared/components/Pagination.jsx";

const WardsPage = () => {
    const navigate = useNavigate();
    const [wards, setWards] = useState([]);
    const [pageData, setPageData] = useState({ page: 0, totalPages: 0, totalElements: 0 });

    const fetchWards = async (page = 0) => {
        try {
            const res = await axiosClient.get(`/master-data/wards?page=${page}&size=10`);
            setWards(res.data.content || []);
            setPageData({
                page: res.data.number ?? 0,
                totalPages: res.data.totalPages ?? 0,
                totalElements: res.data.totalElements ?? 0
            });
        } catch (error) { console.error("Lỗi:", error); }
    };

    useEffect(() => { fetchWards(); }, []);

    return (
        <div className="p-6 bg-[#f5f7fa] h-full overflow-y-auto scrollbar-thin">
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Building className="text-blue-900"/> Quản lý Phường/Xã
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Tổng số: {pageData.totalElements} phường/xã</p>
                </div>
                <button
                    onClick={() => navigate('/wards/create')}
                    className="bg-blue-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-800 transition-all flex items-center gap-2"
                >
                    <Plus size={16} /> Thêm Phường/Xã
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <tr>
                        <th className="px-8 py-5">STT</th>
                        <th className="px-8 py-5">Tên Phường/Xã</th>
                        <th className="px-8 py-5">Quận/Huyện</th>
                        <th className="px-8 py-5 text-right">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {wards.map((w, index) => (
                        <tr key={w.id} className="hover:bg-blue-50/50 transition-colors">
                            <td className="px-8 py-5 font-bold text-gray-500 text-sm">{(Number(pageData.page || 0) * 10) + index + 1}</td>
                            <td className="px-8 py-5 font-bold text-gray-900 text-sm">{w.wardName}</td>
                            <td className="px-8 py-5 text-gray-700 font-medium text-sm">{w.districtName}</td>
                            <td className="px-8 py-5 text-right">
                                <button onClick={() => navigate(`/wards/edit/${w.id}`)} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-blue-900 shadow-sm transition-all">
                                    <SquarePen size={16}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="px-6 py-5 border-t border-gray-100 flex justify-between items-center bg-white">
                    <span className="text-xs font-black text-gray-400 uppercase">Trang {pageData.page + 1} / {pageData.totalPages || 1}</span>
                    <Pagination currentPage={pageData.page} totalPages={pageData.totalPages} onPageChange={fetchWards} />
                </div>
            </div>
        </div>
    );
};
export default WardsPage;