import { useState, useEffect } from 'react';
import SearchExamRecords from "../components/SearchExamRecords";
import ExamRecordAction from "../components/ExamRecordAction.jsx";
import { View, Trash, SquarePen, ChevronLeft, ChevronRight, X } from "lucide-react";
import axiosClient from "../axios/axiosClient";

const ExamRecordsPage = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const [pageData, setPageData] = useState({ page: 0, totalPages: 0, totalElements: 0 });

    const fetchData = async (page = 0) => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`/eye-exam-records?page=${page}&size=10`);
            const data = res.data;
            const dataArray = Array.isArray(data) ? data : (data.content || []);

            setRecords(dataArray);
            setPageData({
                page: data.pageable?.pageNumber !== undefined ? data.pageable.pageNumber : (data.number !== undefined ? data.number : page),
                totalPages: data.totalPages || Math.ceil(dataArray.length / 10) || 1,
                totalElements: data.totalElements || dataArray.length
            });
        } catch (error) {
            console.error("Error fetching eye exam records:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openDetail = async (record) => {
        try {
            const res = await axiosClient.get(`/eye-exam-records/${record.examId}`);
            setSelectedRecord(res.data);
            setIsDetailOpen(true);
        } catch (error) {
            alert("Error loading exam record details");
        }
    };

    const filteredRecords = records.filter(r =>
        (r.className?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (r.campaignTitle?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (r.patientName?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateStr) => {
        if (!dateStr) return '---';
        try {
            const date = new Date(dateStr);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } catch (e) {
            return '---';
        }
    };

    const formatVA = (value) => {
        if (value === null || value === undefined || value === "") return "-";
        const num = parseFloat(value);
        if (isNaN(num)) return "-";
        if (num >= 1) return `${Math.round(num)}/10`;
        return `${Math.round(num * 10)}/10`;
    };

    const formatDiopter = (value) => {
        if (value === null || value === undefined || value === "") return "0.00";
        const num = parseFloat(value);
        if (isNaN(num)) return "0.00";
        if (num === 0) return "0.00";
        return num > 0 ? `+${num.toFixed(2)}` : num.toFixed(2);
    };

    const formatAxis = (value) => {
        if (value === null || value === undefined || value === "") return "0°";
        return `${value}°`;
    };

    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-50 text-gray-950 scrollbar-thin">
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4">
                <SearchExamRecords
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onAddClick={() => alert('Single record creation feature is under development')}
                />

                <ExamRecordAction
                    onAddClick={() => alert('Single record creation feature is under development')}
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50/50 px-8 py-5 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-black text-gray-950">Eye Exam Records</h3>
                    <p className="text-gray-500 font-semibold text-sm">Total: {pageData.totalElements} records</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="text-gray-600 text-xs font-bold uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                            <th className="px-6 py-4">Patient Name</th>
                            <th className="px-6 py-4">Class</th>
                            <th className="px-6 py-4">Campaign</th>
                            <th className="px-6 py-4">Exam Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-8 font-semibold text-gray-500">Loading data...</td>
                            </tr>
                        ) : filteredRecords.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-gray-500 italic font-medium">No matching records found</td>
                            </tr>
                        ) : (
                            filteredRecords.map((record) => (
                                <tr key={record.examId} className="hover:bg-blue-50/50 transition-all text-sm font-medium text-gray-900">
                                    <td className="px-6 py-5 font-bold text-gray-900 text-sm">{record.patientName ?? "N/A"}</td>
                                    <td className="px-6 py-5 text-gray-600 font-semibold text-sm">{record.className ?? "-"}</td>
                                    <td className="px-6 py-5 text-gray-600 text-sm min-w-[200px]" title={record.campaignTitle}>{record.campaignTitle ?? "-"}</td>
                                    <td className="px-6 py-5 text-gray-600 text-sm">{formatDate(record.examDate)}</td>

                                    <td className="px-6 py-5 text-right flex justify-end gap-3">
                                        <button type="button" onClick={() => openDetail(record)} className="text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"><View size={20} /></button>
                                        <button type="button" className="text-gray-400 hover:text-blue-900 transition-colors cursor-pointer"><SquarePen size={20}/></button>
                                        <button type="button" className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"><Trash size={20}/></button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between px-6 py-5 bg-white border-t border-gray-100">
                    <div className="text-sm font-semibold text-gray-500">
                        Page <span className="text-blue-900 font-bold">{pageData.page + 1}</span> / {pageData.totalPages || 1}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button
                            disabled={pageData.page === 0}
                            onClick={() => fetchData(pageData.page - 1)}
                            className="flex items-center justify-center w-9 h-9 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-all cursor-pointer"
                        >
                            <ChevronLeft size={18} className="text-gray-700"/>
                        </button>

                        {[...Array(pageData.totalPages)].map((_, i) => {
                            if (i === 0 || i === pageData.totalPages - 1 || (i >= pageData.page - 1 && i <= pageData.page + 1)) return (
                                <button
                                    key={i}
                                    onClick={() => fetchData(i)}
                                    className={`w-9 h-9 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                                        pageData.page === i
                                            ? 'bg-blue-900 text-white shadow-lg shadow-blue-200'
                                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            );
                            if (i === pageData.page - 2 || i === pageData.page + 2) return <span key={i} className="px-2 text-gray-400 font-bold tracking-widest">...</span>;
                            return null;
                        })}

                        <button
                            disabled={pageData.page >= pageData.totalPages - 1}
                            onClick={() => fetchData(pageData.page + 1)}
                            className="flex items-center justify-center w-9 h-9 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-all cursor-pointer"
                        >
                            <ChevronRight size={18} className="text-gray-700"/>
                        </button>
                    </div>
                </div>
            </div>

            {isDetailOpen && selectedRecord && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">

                        {/* Header của Modal */}
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <div>
                                <h2 className="text-2xl font-black text-gray-950">Eye Exam Record Details</h2>
                                <p className="text-sm font-semibold text-blue-900 mt-1">Patient: {selectedRecord.patientName}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsDetailOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                            >
                                <X size={22} className="text-gray-400"/>
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl mb-6 text-sm">
                            <div><span className="text-gray-500 font-medium">Class:</span> <span className="font-bold text-gray-950">{selectedRecord.className || "-"}</span></div>
                            <div><span className="text-gray-500 font-medium">Exam Date:</span> <span className="font-bold text-gray-950">{formatDate(selectedRecord.examDate)}</span></div>
                            <div className="col-span-2"><span className="text-gray-500 font-medium">Campaign:</span> <span className="font-bold text-gray-950">{selectedRecord.campaignTitle || "-"}</span></div>
                            <div className="col-span-2"><span className="text-gray-500 font-medium">Examiner:</span> <span className="font-bold text-gray-950">{selectedRecord.examinerName || "-"}</span></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="border border-blue-100 rounded-2xl p-5 bg-blue-50/10">
                                <h4 className="text-sm font-black text-blue-900 uppercase tracking-wider mb-4 border-b border-blue-100 pb-2">Left Eye (L)</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">VA (No Glasses)</span>
                                        <span className="text-sm font-black text-blue-900">{formatVA(selectedRecord.vaLeftWithoutGlasses)}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">VA (With Glasses)</span>
                                        <span className="text-sm font-black text-blue-900">{formatVA(selectedRecord.vaLeftWithGlasses)}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sphere (Sph L)</span>
                                        <span className="text-sm font-bold text-gray-800">{formatDiopter(selectedRecord.sphLeft)}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cylinder (Cyl L)</span>
                                        <span className="text-sm font-bold text-gray-800">{formatDiopter(selectedRecord.cylLeft)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Axis L</span>
                                        <span className="text-sm font-bold text-gray-800">{formatAxis(selectedRecord.axisLeft)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border border-green-100 rounded-2xl p-5 bg-green-50/10">
                                <h4 className="text-sm font-black text-green-900 uppercase tracking-wider mb-4 border-b border-green-100 pb-2">Right Eye (R)</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">VA (No Glasses)</span>
                                        <span className="text-sm font-black text-green-900">{formatVA(selectedRecord.vaRightWithoutGlasses)}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">VA (With Glasses)</span>
                                        <span className="text-sm font-black text-green-900">{formatVA(selectedRecord.vaRightWithGlasses)}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sphere (Sph R)</span>
                                        <span className="text-sm font-bold text-gray-800">{formatDiopter(selectedRecord.sphRight)}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cylinder (Cyl R)</span>
                                        <span className="text-sm font-bold text-gray-800">{formatDiopter(selectedRecord.cylRight)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Axis R</span>
                                        <span className="text-sm font-bold text-gray-800">{formatAxis(selectedRecord.axisRight)}</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={() => setIsDetailOpen(false)}
                            className="w-full mt-8 py-4 bg-gray-950 text-white rounded-2xl font-black hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 cursor-pointer"
                        >
                            Close Details
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamRecordsPage;