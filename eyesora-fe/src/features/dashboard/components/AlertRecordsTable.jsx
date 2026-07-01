import React from 'react';
import { SlidersHorizontal, Download, Eye } from 'lucide-react';
import Pagination from "../../../shared/components/Pagination.jsx";

const AlertRecordsTable = ({ records, pageData, fetchData, openDetail, formatDiopter }) => {
    const totalPages = pageData.totalPages || 1;

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center bg-gray-50/70 gap-2">
                <h3 className="text-base font-bold text-red-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                    Danh sách ca bệnh cần cảnh báo gấp
                </h3>
                <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-200/60 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                        <SlidersHorizontal className="w-3.5 h-3.5" /> Bộ lọc
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#004194] text-white text-xs font-semibold hover:bg-blue-800 transition-colors cursor-pointer">
                        <Download className="w-3.5 h-3.5" /> Xuất báo cáo
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 border-b border-gray-200">
                    <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        <th className="px-6 py-4">Họ Và Tên</th>
                        <th className="px-6 py-4">Lớp</th>
                        <th className="px-6 py-4">Mắt Trái (SPH)</th>
                        <th className="px-6 py-4">Mắt Phải (SPH)</th>
                        <th className="px-6 py-4 text-center">Trạng thái</th>
                        <th className="px-6 py-4 text-center">Chi tiết</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {records.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center py-8 text-xs text-gray-400 font-semibold italic">
                                Trang này hiện tại không ghi nhận hồ sơ cảnh báo cận nặng lâm sàng nào.
                            </td>
                        </tr>
                    ) : (
                        records.map((record, index) => (
                            <tr key={index} className="hover:bg-blue-50/50 transition-all duration-200 text-sm font-medium">
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">{record.patientName ?? "N/A"}</td>
                                <td className="px-6 py-4 text-xs text-gray-600">{record.className ?? "-"}</td>
                                <td className="px-6 py-4 font-mono text-xs font-bold text-[#ba1a1a]">
                                    {formatDiopter(record.sphLeft)}
                                </td>
                                <td className="px-6 py-4 font-mono text-xs font-bold text-[#ba1a1a]">
                                    {formatDiopter(record.sphRight)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase border bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]/10">
                                        Cận nặng
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button type="button" onClick={() => openDetail(record)} className="p-2 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer" title="Xem chi tiết">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Khối phân trang được dọn dẹp sạch bằng component Pagination */}
            <div className="flex items-center justify-between px-6 py-5 bg-white border-t border-gray-100">
                <div className="text-sm font-semibold text-gray-500">
                    Trang <span className="text-blue-900 font-bold">{pageData.page + 1}</span> / {totalPages}
                </div>

                {/* Component phân trang tái sử dụng */}
                <Pagination
                    currentPage={pageData.page}
                    totalPages={totalPages}
                    onPageChange={fetchData}
                />
            </div>
        </div>
    );
};

export default AlertRecordsTable;