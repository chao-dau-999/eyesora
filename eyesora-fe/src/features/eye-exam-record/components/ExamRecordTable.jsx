import React from 'react';
import { View, SquarePen, Trash, ChevronLeft, ChevronRight } from "lucide-react";

const ExamRecordTable = ({
                             records,
                             loading,
                             pageData,
                             fetchData,
                             openDetail,
                             openUpdateModal,
                             triggerDeleteModal,
                             formatDate
                         }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50/50 px-8 py-5 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-black text-gray-950">Hồ sơ khám mắt</h3>
                <p className="text-gray-500 font-semibold text-sm">Tổng số: {pageData.totalElements} bản ghi</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="text-gray-600 text-xs font-bold uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                        <th className="px-6 py-4">Họ và Tên</th>
                        <th className="px-6 py-4">Lớp</th>
                        <th className="px-6 py-4">Chiến dịch khám</th>
                        <th className="px-6 py-4">Ngày khám</th>
                        <th className="px-6 py-4 text-right">Hành động</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {loading ? (
                        <tr><td colSpan="5" className="text-center py-8 font-semibold text-gray-500">Đang tải dữ liệu...</td></tr>
                    ) : records.length === 0 ? (
                        <tr><td colSpan="5" className="text-center py-8 text-gray-500 italic font-medium">Không tìm thấy hồ sơ phù hợp</td></tr>
                    ) : (
                        records.map((record) => (
                            <tr key={record.examId} className="hover:bg-blue-50/50 transition-all text-sm font-medium text-gray-900">
                                <td className="px-6 py-5 font-bold text-gray-900 text-sm">{record.patientName ?? "N/A"}</td>
                                <td className="px-6 py-5 text-gray-600 font-semibold text-sm">{record.className ?? "-"}</td>
                                <td className="px-6 py-5 text-gray-600 text-sm min-w-[200px]" title={record.campaignTitle}>{record.campaignTitle ?? "-"}</td>
                                <td className="px-6 py-5 text-gray-600 text-sm">{formatDate(record.examDate)}</td>

                                <td className="px-6 py-5 text-right flex justify-end gap-3">
                                    <button type="button" onClick={() => openDetail(record)} className="text-green-600 hover:text-green-900 transition-colors cursor-pointer" title="Xem chi tiết"><View size={20} /></button>
                                    <button type="button" onClick={() => openUpdateModal(record)} className="text-blue-700 hover:text-blue-900 transition-colors cursor-pointer" title="Chỉnh sửa"><SquarePen size={20}/></button>
                                    <button type="button" onClick={() => triggerDeleteModal(record)} className="text-red-600 hover:text-red-800 transition-colors cursor-pointer" title="Xóa hồ sơ"><Trash size={20}/></button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            <div className="flex items-center justify-between px-6 py-5 bg-white border-t border-gray-100">
                <div className="text-sm font-semibold text-gray-500">Trang <span className="text-blue-900 font-bold">{pageData.page + 1}</span> / {pageData.totalPages || 1}</div>
                <div className="flex items-center gap-1.5">
                    <button disabled={pageData.page === 0} onClick={() => fetchData(pageData.page - 1)} className="flex items-center justify-center w-9 h-9 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-all cursor-pointer"><ChevronLeft size={18} className="text-gray-700"/></button>
                    {[...Array(pageData.totalPages)].map((_, i) => {
                        if (i === 0 || i === pageData.totalPages - 1 || (i >= pageData.page - 1 && i <= pageData.page + 1)) return (
                            <button key={i} onClick={() => fetchData(i)} className={`w-9 h-9 rounded-lg font-bold text-xs transition-all cursor-pointer ${pageData.page === i ? 'bg-blue-900 text-white shadow-lg shadow-blue-200' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{i + 1}</button>
                        );
                        if (i === pageData.page - 2 || i === pageData.page + 2) return <span key={i} className="px-2 text-gray-400 font-bold tracking-widest">...</span>;
                        return null;
                    })}
                    <button disabled={pageData.page >= pageData.totalPages - 1} onClick={() => fetchData(pageData.page + 1)} className="flex items-center justify-center w-9 h-9 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-all cursor-pointer"><ChevronRight size={18} className="text-gray-700"/></button>
                </div>
            </div>
        </div>
    );
};

export default ExamRecordTable;