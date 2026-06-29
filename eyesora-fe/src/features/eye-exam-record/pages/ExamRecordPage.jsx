import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle } from "lucide-react";
import axiosClient from "../../../shared/axios/axiosClient.js";

import SearchExamRecords from "../../../shared/components/SearchExamRecords.jsx";
import ExamRecordAction from "../components/ExamRecordAction.jsx";

import ExamRecordTable from '../components/ExamRecordTable.jsx';
import ExamRecordDetailModal from '../components/ExamRecordDetailModal.jsx';
import ExamRecordModal from '../components/ExamRecordModal.jsx';

const ExamRecordPage = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);

    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [updateForm, setUpdateForm] = useState({
        examId: '', patientName: '', className: '', campaignTitle: '',
        vaLeftWithoutGlasses: '', vaLeftWithGlasses: '', sphLeft: '', cylLeft: '', axisLeft: '',
        vaRightWithoutGlasses: '', vaRightWithGlasses: '', sphRight: '', cylRight: '', axisRight: ''
    });

    const [pageData, setPageData] = useState({ page: 0, totalPages: 0, totalElements: 0 });

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 400);

        return () => clearTimeout(handler);
    }, [searchQuery]);

    const fetchData = useCallback(async (page = 0) => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`/eye-exam-records`, {
                params: {
                    page: page,
                    size: 10,
                    keyword: debouncedSearchQuery || null
                }
            });

            const data = res.data;
            const dataArray = data && data.content ? data.content : [];

            setRecords(dataArray);
            setPageData({
                page: data.number !== undefined ? data.number : page,
                totalPages: data.totalPages || 1,
                totalElements: data.totalElements || 0
            });
        } catch (error) {
            console.error("Lỗi khi truy xuất hồ sơ khám mắt:", error);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearchQuery]);

    useEffect(() => {
        fetchData(0);
    }, [debouncedSearchQuery, fetchData]);

    const openDetail = async (record) => {
        try {
            const res = await axiosClient.get(`/eye-exam-records/${record.examId}`);
            setSelectedRecord(res.data);
            setIsDetailOpen(true);
        } catch (error) {
            alert("Lỗi khi tải chi tiết hồ sơ khám mắt");
        }
    };

    const openUpdateModal = async (record) => {
        try {
            const res = await axiosClient.get(`/eye-exam-records/${record.examId}`);
            const data = res.data;

            setUpdateForm({
                examId: data.examId || '',
                patientName: data.patientName || '',
                className: data.className || '',
                campaignTitle: data.campaignTitle || '',
                vaLeftWithoutGlasses: data.vaLeftWithoutGlasses ?? '',
                vaLeftWithGlasses: data.vaLeftWithGlasses ?? '',
                sphLeft: data.sphLeft ?? '',
                cylLeft: data.cylLeft ?? '',
                axisLeft: data.axisLeft ?? '',
                vaRightWithoutGlasses: data.vaRightWithoutGlasses ?? '',
                vaRightWithGlasses: data.vaRightWithGlasses ?? '',
                sphRight: data.sphRight ?? '',
                cylRight: data.cylRight ?? '',
                axisRight: data.axisRight ?? ''
            });
            setIsUpdateOpen(true);
        } catch (error) {
            alert("Không thể tải thông tin hồ sơ để chỉnh sửa.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateForm(prev => ({ ...prev, [name]: value }));
    };

    const handleConfirmUpdate = async (e) => {
        e.preventDefault();
        try {
            const cleanedForm = { ...updateForm };
            const numericFields = [
                'vaLeftWithoutGlasses', 'vaLeftWithGlasses', 'sphLeft', 'cylLeft', 'axisLeft',
                'vaRightWithoutGlasses', 'vaRightWithGlasses', 'sphRight', 'cylRight', 'axisRight'
            ];

            numericFields.forEach(field => {
                if (cleanedForm[field] === '') {
                    cleanedForm[field] = null;
                } else if (cleanedForm[field] !== null && cleanedForm[field] !== undefined) {
                    cleanedForm[field] = parseFloat(cleanedForm[field]);
                }
            });

            await axiosClient.put(`/eye-exam-records/${cleanedForm.examId}`, cleanedForm);
            setIsUpdateOpen(false);
            fetchData(pageData.page);
        } catch (error) {
            alert(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật hồ sơ.");
        }
    };

    const triggerDeleteModal = (record) => {
        setRecordToDelete(record);
        setIsDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!recordToDelete) return;
        try {
            await axiosClient.delete(`/eye-exam-records/${recordToDelete.examId}`);
            setIsDeleteOpen(false);
            setRecordToDelete(null);

            const isLastItemOnPage = records.length === 1 && pageData.page > 0;
            const targetPage = isLastItemOnPage ? pageData.page - 1 : pageData.page;
            fetchData(targetPage);
        } catch (error) {
            alert(error.response?.data?.message || "Có lỗi xảy ra khi xóa hồ sơ.");
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '---';
        try {
            const date = new Date(dateStr);
            return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        } catch (e) { return '---'; }
    };

    const formatVA = (value) => {
        if (value === null || value === undefined || value === "") return "-";
        const num = parseFloat(value);
        if (isNaN(num)) return "-";
        return num >= 1 ? `${Math.round(num)}/10` : `${Math.round(num * 10)}/10`;
    };

    const formatDiopter = (value) => {
        if (value === null || value === undefined || value === "") return "0.00";
        const num = parseFloat(value);
        if (isNaN(num) || num === 0) return "0.00";
        return num > 0 ? `+${num.toFixed(2)}` : num.toFixed(2);
    };

    const formatAxis = (value) => (value === null || value === undefined || value === "") ? "0°" : `${value}°`;

    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-50 text-gray-950 scrollbar-thin">

            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4">
                <SearchExamRecords
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    placeholder="Tìm kiếm"
                />
                <ExamRecordAction
                    onAddClick={() => alert('Đang phát triển Thêm bản ghi')}
                    onBulkClick={() => alert('Đang phát triển Nhập hàng loạt')}
                />
            </div>

            <ExamRecordTable
                records={records}
                loading={loading}
                pageData={pageData}
                fetchData={fetchData}
                openDetail={openDetail}
                openUpdateModal={openUpdateModal}
                triggerDeleteModal={triggerDeleteModal}
                formatDate={formatDate}
            />

            <ExamRecordDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                record={selectedRecord}
                formatDate={formatDate}
                formatVA={formatVA}
                formatDiopter={formatDiopter}
                formatAxis={formatAxis}
            />

            <ExamRecordModal
                isOpen={isUpdateOpen}
                onClose={() => setIsUpdateOpen(false)}
                updateForm={updateForm}
                handleInputChange={handleInputChange}
                handleConfirmUpdate={handleConfirmUpdate}
            />

            {isDeleteOpen && recordToDelete && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl text-center border border-gray-100">
                        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100 text-red-600">
                            <AlertTriangle size={28} className="animate-bounce" />
                        </div>
                        <h3 className="text-xl font-black text-gray-950 mb-2">Xác nhận xóa hồ sơ</h3>
                        <p className="text-sm font-medium text-gray-500 leading-relaxed px-2">
                            Bạn có chắc chắn muốn xóa hồ sơ khám mắt của học sinh <span className="font-bold text-gray-950">"{recordToDelete.patientName || 'N/A'}"</span>?
                        </p>
                        <div className="grid grid-cols-2 gap-3 mt-6">
                            <button type="button" onClick={() => { setIsDeleteOpen(false); setRecordToDelete(null); }} className="py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all cursor-pointer">Hủy bỏ</button>
                            <button type="button" onClick={handleConfirmDelete} className="py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all cursor-pointer">Xác nhận xóa</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamRecordPage;