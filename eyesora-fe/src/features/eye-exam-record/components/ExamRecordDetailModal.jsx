import React from 'react';
import { X } from "lucide-react";

const ExamRecordDetailModal = ({ isOpen, onClose, record, formatDate, formatVA, formatDiopter, formatAxis }) => {
    if (!isOpen || !record) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white p-8 rounded-3xl w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <div>
                        <h2 className="text-2xl font-black text-gray-950">Chi tiết hồ sơ khám mắt</h2>
                        <p className="text-sm font-semibold text-blue-900 mt-1">Học sinh: {record.patientName}</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"><X size={22} className="text-gray-400"/></button>
                </div>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl mb-6 text-sm">
                    <div><span className="text-gray-500 font-medium">Lớp:</span> <span className="font-bold text-gray-950">{record.className || "-"}</span></div>
                    <div><span className="text-gray-500 font-medium">Ngày khám:</span> <span className="font-bold text-gray-950">{formatDate(record.examDate)}</span></div>
                    <div className="col-span-2"><span className="text-gray-500 font-medium">Chiến dịch:</span> <span className="font-bold text-gray-950">{record.campaignTitle || "-"}</span></div>
                    <div className="col-span-2"><span className="text-gray-500 font-medium">Người khám:</span> <span className="font-bold text-gray-950">{record.examinerName || "-"}</span></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-blue-100 rounded-2xl p-5 bg-blue-50/10">
                        <h4 className="text-sm font-black text-blue-900 uppercase tracking-wider mb-4 border-b border-blue-100 pb-2">Mắt Trái (L)</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thị lực (Không kính)</span><span className="text-sm font-black text-blue-900">{formatVA(record.vaLeftWithoutGlasses)}</span></div>
                            <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thị lực (Có kính)</span><span className="text-sm font-black text-blue-900">{formatVA(record.vaLeftWithGlasses)}</span></div>
                            <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Độ cầu (Sph L)</span><span className="text-sm font-bold text-gray-800">{formatDiopter(record.sphLeft)}</span></div>
                            <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Độ trụ (Cyl L)</span><span className="text-sm font-bold text-gray-800">{formatDiopter(record.cylLeft)}</span></div>
                            <div className="flex justify-between"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Trục (Axis L)</span><span className="text-sm font-bold text-gray-800">{formatAxis(record.axisLeft)}</span></div>
                        </div>
                    </div>
                    <div className="border border-green-100 rounded-2xl p-5 bg-green-50/10">
                        <h4 className="text-sm font-black text-green-900 uppercase tracking-wider mb-4 border-b border-green-100 pb-2">Mắt Phải (R)</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thị lực (Không kính)</span><span className="text-sm font-black text-green-900">{formatVA(record.vaRightWithoutGlasses)}</span></div>
                            <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thị lực (Có kính)</span><span className="text-sm font-black text-green-900">{formatVA(record.vaRightWithGlasses)}</span></div>
                            <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Độ cầu (Sph R)</span><span className="text-sm font-bold text-gray-800">{formatDiopter(record.sphRight)}</span></div>
                            <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Độ trụ (Cyl R)</span><span className="text-sm font-bold text-gray-800">{formatDiopter(record.cylRight)}</span></div>
                            <div className="flex justify-between"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Trục (Axis R)</span><span className="text-sm font-bold text-gray-800">{formatAxis(record.axisRight)}</span></div>
                        </div>
                    </div>
                </div>
                <button type="button" onClick={onClose} className="w-full mt-8 py-4 bg-gray-950 text-white rounded-2xl font-black hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 cursor-pointer">Đóng chi tiết</button>
            </div>
        </div>
    );
};

export default ExamRecordDetailModal;