import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import axiosClient from "../../../shared/axios/axiosClient.js";

import StatsCards from "../components/StatsCards.jsx";
import AnalyticsCharts from '../components/AnalyticsCharts.jsx';
import AlertRecordsTable from '../components/AlertRecordsTable.jsx';

import ExamRecordDetailModal from "../../eye-exam-record/components/ExamRecordDetailModal.jsx";

const Dashboard = () => {
    const [summary, setSummary] = useState({
        totalExaminedStudents: 0,
        currentMyopiaRate: 0,
        myopiaRateTrend: null,
        totalAlertCases: 0,
        totalParticipatingFacilities: 0
    });
    const [gradeStats, setGradeStats] = useState([]);
    const [timelineStats, setTimelineStats] = useState([]);

    const [records, setRecords] = useState([]);
    const [pageData, setPageData] = useState({ page: 0, totalPages: 1, totalElements: 0 });
    const [loading, setLoading] = useState(true);
    const [animateBars, setAnimateBars] = useState(false);

    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const fetchDashboardStaticData = async () => {
        try {
            const [countersRes, gradeRes, timelineRes] = await axios.all([
                axiosClient.get('/dashboard/counters'),
                axiosClient.get('/dashboard/grade-stats'),
                axiosClient.get('/dashboard/myopia-timeline')
            ]);

            setSummary(countersRes.data || {
                totalExaminedStudents: 0,
                currentMyopiaRate: 0,
                myopiaRateTrend: null,
                totalAlertCases: 0,
                totalParticipatingFacilities: 0
            });
            setGradeStats(gradeRes.data || []);
            setTimelineStats(timelineRes.data || []);
            setTimeout(() => setAnimateBars(true), 150);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu cấu trúc bảng thống kê", error);
        }
    };

    const fetchData = useCallback(async (page = 0) => {
        try {
            const res = await axiosClient.get(`/eye-exam-records`, {
                params: {
                    page: page,
                    size: 5
                }
            });

            const data = res.data;
            const dataArray = data && data.content ? data.content : [];

            const heavyCases = dataArray.filter(r => (r.sphLeft <= -6.00) || (r.sphRight <= -6.00));

            setRecords(heavyCases);
            setPageData({
                page: data.number !== undefined ? data.number : page,
                totalPages: data.totalPages || 1,
                totalElements: data.totalElements || 0
            });
        } catch (error) {
            console.error("Lỗi khi nạp dữ liệu phân trang danh sách ca cảnh báo:", error);
        }
    }, []);

    useEffect(() => {
        const initDashboard = async () => {
            setLoading(true);
            await Promise.all([
                fetchDashboardStaticData(),
                fetchData(0)
            ]);
            setLoading(false);
        };
        initDashboard();
    }, [fetchData]);

    const openDetail = async (record) => {
        try {
            const res = await axiosClient.get(`/eye-exam-records/${record.examId}`);
            setSelectedRecord(res.data);
            setIsDetailOpen(true);
        } catch (error) {
            alert("Lỗi khi tải chi tiết hồ sơ khám mắt");
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '---';
        try {
            const date = new Date(dateStr);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } catch (e) { return '---'; }
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
        if (isNaN(num) || num === 0) return "0.00";
        return num > 0 ? `+${num.toFixed(2)}` : num.toFixed(2);
    };

    const formatAxis = (value) => {
        if (value === null || value === undefined || value === "") return "0°";
        return `${value}°`;
    };

     const generateSvgPathAndCircles = () => {
        if (!timelineStats || timelineStats.length === 0) return { path: "", circles: [] };

        const width = 400;
        const height = 200;
        const padding = 20;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        const maxRate = Math.max(...timelineStats.map(d => d.rate || 0), 50);
        const totalItems = timelineStats.length;

        const points = timelineStats.map((item, index) => {
            const divisor = totalItems > 1 ? totalItems - 1 : 1;
            const x = padding + (index / divisor) * chartWidth;
            const y = height - padding - ((item.rate || 0) / maxRate) * chartHeight;
            return { x, y, ...item };
        });

        const path = points.reduce((acc, p, i) => i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`, "");
        return { path, circles: points };
    };

    const { path, circles } = generateSvgPathAndCircles();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-[#004194] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xs text-gray-500 font-semibold tracking-wide">Đang đồng bộ dữ liệu đồ thị tổng quan từ hệ thống...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-[#f5f7fa] h-full overflow-y-auto scrollbar-thin text-gray-950">
            <StatsCards summary={summary} />

            <AnalyticsCharts
                gradeStats={gradeStats}
                timelineStats={timelineStats}
                animateBars={animateBars}
                path={path}
                circles={circles}
            />

            <AlertRecordsTable
                records={records}
                pageData={pageData}
                fetchData={fetchData}
                openDetail={openDetail}
                formatDiopter={formatDiopter}
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
        </div>
    );
};

export default Dashboard;