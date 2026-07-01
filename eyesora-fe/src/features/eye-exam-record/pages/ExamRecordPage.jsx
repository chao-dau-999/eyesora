import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from "../../../shared/axios/axiosClient.js";

import SearchExamRecords from "../../../shared/components/SearchExamRecords.jsx";
import ExamRecordAction from "../components/ExamRecordAction.jsx";

import ExamRecordTable from '../components/ExamRecordTable.jsx';
import ExamRecordDetailModal from '../components/ExamRecordDetailModal.jsx';
import ConfirmModal from "../../../shared/components/ConfirmModal.jsx";

const ExamRecordPage = () => {
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);

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

    const openUpdatePage = (record) => {
        navigate(`/eye-exam-records/edit/${record.examId}`);
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

    const handleCloseDeleteModal = () => {
        setIsDeleteOpen(false);
        setRecordToDelete(null);
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
                openUpdateModal={openUpdatePage}
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

            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa hồ sơ"
                message={
                    <>
                        Bạn có chắc chắn muốn xóa hồ sơ khám mắt của{" "}
                        <strong className="font-bold text-gray-900">
                            {recordToDelete?.patientName || "N/A"}
                        </strong>
                        ?
                    </>
                }
            />
        </div>
    );
};

export default ExamRecordPage;