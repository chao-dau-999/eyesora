import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TrendingUp, Users, AlertTriangle, Building2, Eye, ChevronLeft, ChevronRight, SlidersHorizontal, Download, X } from 'lucide-react';
import axiosClient from "../../../shared/axios/axiosClient.js";

const Dashboard = () => {
    // 1. Khởi tạo các State lưu trữ dữ liệu từ hệ thống API phân tích
    const [summary, setSummary] = useState({
        totalExaminedStudents: 0,
        currentMyopiaRate: 0,
        myopiaRateTrend: null,
        totalAlertCases: 0,
        totalParticipatingFacilities: 0
    });
    const [gradeStats, setGradeStats] = useState([]);
    const [timelineStats, setTimelineStats] = useState([]);
    const [alertRecords, setAlertRecords] = useState([]);

    const [loading, setLoading] = useState(true);
    const [animateBars, setAnimateBars] = useState(false);

    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [countersRes, gradeRes, timelineRes, alertRecordsRes] = await axios.all([
                axiosClient.get('/dashboard/counters'),
                axiosClient.get('/dashboard/grade-stats'),
                axiosClient.get('/dashboard/myopia-timeline'),
                axiosClient.get('/eye-exam-records?page=0&size=5')
            ]);

            setSummary(countersRes.data);
            setGradeStats(gradeRes.data);
            setTimelineStats(timelineRes.data);

            const data = alertRecordsRes.data;
            const recordsArray = Array.isArray(data) ? data : (data.content || []);
            const heavyCases = recordsArray.filter(r => (r.sphLeft <= -6.00) || (r.sphRight <= -6.00));
            setAlertRecords(heavyCases);

            setTimeout(() => setAnimateBars(true), 150);
        } catch (error) {
            console.error("Error loading dashboard analysis data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
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
        return num > 0 ? `+${num.toFixed(2)}` : `${num.toFixed(2)}`;
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

        const maxRate = Math.max(...timelineStats.map(d => d.rate), 50);

        const points = timelineStats.map((item, index) => {
            const x = padding + (index / (timelineStats.length - 1)) * chartWidth;
            const y = height - padding - (item.rate / maxRate) * chartHeight;
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

    const statsCards = [
        {
            title: "Tổng số học sinh đã khám",
            value: summary.totalExaminedStudents.toLocaleString('vi-VN'),
            icon: <Users className="w-6 h-6" />,
            bgColor: "bg-blue-900/10 text-[#004194]"
        },
        {
            title: "Tỷ lệ cận thị hiện tại",
            value: `${summary.currentMyopiaRate}%`,
            icon: <TrendingUp className="w-5 h-5 mr-1" />,
            trend: summary.myopiaRateTrend !== null ? `${summary.myopiaRateTrend > 0 ? '+' : ''}${summary.myopiaRateTrend}%` : null,
            hasProgress: true
        },
        {
            title: "Số ca báo động",
            value: summary.totalAlertCases.toString(),
            icon: <AlertTriangle className="w-6 h-6 animate-pulse" />,
            bgColor: "bg-red-500/20 text-[#ba1a1a]",
            isAlert: true
        },
        {
            title: "Cơ sở tham gia",
            value: summary.totalParticipatingFacilities.toString(),
            icon: <Building2 className="w-6 h-6" />,
            bgColor: "bg-slate-200 text-slate-700"
        }
    ];

    return (
        <div className="p-6 bg-[#f5f7fa] h-full overflow-y-auto scrollbar-thin text-gray-950">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {statsCards.map((stat, index) => {
                    if (stat.isAlert) {
                        return (
                            <div key={index} className="bg-[#ffdad6] rounded-xl p-4 flex items-center justify-between border border-[#ba1a1a]/20 shadow-sm">
                                <div>
                                    <p className="text-[#93000a] text-xs font-medium">{stat.title}</p>
                                    <h2 className="text-3xl font-bold mt-1 text-[#93000a]">{stat.value}</h2>
                                </div>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bgColor}`}>
                                    {stat.icon}
                                </div>
                            </div>
                        );
                    }
                    return (
                        <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <p className="text-gray-500 text-xs font-medium">{stat.title}</p>
                                {stat.trend && (
                                    <div className={`flex items-center font-bold text-xs ${summary.myopiaRateTrend > 0 ? 'text-[#ba1a1a]' : 'text-green-600'}`}>
                                        {stat.icon} {stat.trend}
                                    </div>
                                )}
                                {!stat.trend && stat.bgColor && (
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bgColor}`}>
                                        {stat.icon}
                                    </div>
                                )}
                            </div>
                            <h2 className="text-3xl font-bold mt-1 text-gray-900">{stat.value}</h2>
                            {stat.hasProgress && (
                                <div className="w-full bg-gray-200 h-1 rounded-full mt-4">
                                    <div className="bg-[#ba1a1a] h-full rounded-full transition-all duration-500" style={{ width: stat.value }}></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Middle Row: Khối Đồ Thị */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                {/* BIỂU ĐỒ CỘT */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col">
                    <div className="mb-4">
                        <h3 className="text-base font-bold text-gray-900">Tỷ lệ cận thị theo khối lớp</h3>
                    </div>
                    <div className="flex flex-col w-full h-72">
                        <div className="relative flex-1 border-t border-r border-l border-b border-gray-300 flex items-end justify-around">
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                <div className="w-full border-b border-dashed border-gray-300/70 h-0"></div>
                                <div className="w-full border-b border-dashed border-gray-300/70 h-0"></div>
                                <div className="w-full border-b border-dashed border-gray-300/70 h-0"></div>
                                <div className="w-full border-b border-dashed border-gray-300/70 h-0"></div>
                                <div className="w-full border-b border-dashed border-gray-300/70 h-0"></div>
                                <div className="w-full h-0"></div>
                            </div>

                            {gradeStats.map((item, index) => (
                                <div key={index} className="relative flex flex-col items-center w-full h-full justify-end border-r border-dashed border-gray-300 last:border-r-0">
                                    <span className="absolute text-xs font-semibold text-gray-800 pb-1.5 transition-all duration-1000 select-none"
                                          style={{ bottom: animateBars ? `${item.rate}%` : '0%' }}>
                                          {item.rate}%
                                    </span>
                                    <div
                                        className="w-10 bg-[#4472c4] transition-all duration-1000 ease-out shadow-sm"
                                        style={{ height: animateBars ? `${item.rate}%` : '0%' }}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="bg-[#f2f2f2] border-b border-l border-r border-gray-300 h-8 flex justify-around items-center">
                            {gradeStats.map((item, index) => (
                                <div key={index} className="w-full text-center border-r border-gray-300/60 last:border-r-0">
                                    <p className="text-xs font-bold text-gray-700 select-none">
                                        {item.gradeName}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm overflow-hidden relative">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-base font-bold text-gray-900">Xu hướng cận thị qua các năm</h3>
                        <div className="flex gap-4">
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-gray-500">
                                <span className="w-2 h-2 rounded-full bg-[#004194]"></span> Thực tế
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-gray-500">
                                <span className="w-2 h-2 rounded-full bg-gray-400 border border-dashed border-[#004194]"></span> Dự báo
                            </span>
                        </div>
                    </div>
                    <div className="relative h-64 w-full pt-4">
                        <svg className="w-full h-4/5 overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 200">
                            <path d={path} fill="none" stroke="#004194" strokeLinecap="round" strokeWidth="3"></path>
                            {circles.map((dot, idx) => (
                                <circle
                                    key={idx}
                                    cx={dot.x}
                                    cy={dot.y}
                                    fill={dot.type === 'PREDICTED' ? '#9ca3af' : '#004194'}
                                    stroke={dot.type === 'PREDICTED' ? '#004194' : 'none'}
                                    strokeDasharray={dot.type === 'PREDICTED' ? '2,2' : 'none'}
                                    r="4"
                                >
                                    <title>{`${dot.schoolYear}: ${dot.rate}%`}</title>
                                </circle>
                            ))}
                        </svg>
                        <div className="absolute bottom-2 w-full flex justify-between px-2">
                            {timelineStats.map((item, idx) => (
                                <span key={idx} className="text-xs font-medium text-gray-400">
                                    {item.schoolYear} {item.type === 'PREDICTED' ? '(Dự báo)' : ''}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Bảng Ca Bệnh Cận Nặng Nguy Hiểm */}
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
                            <th className="px-6 py-4">Họ Tên</th>
                            <th className="px-6 py-4">Lớp</th>
                            <th className="px-6 py-4">Mắt Trái (SPH)</th>
                            <th className="px-6 py-4">Mắt Phải (SPH)</th>
                            <th className="px-6 py-4 text-center">Trạng thái</th>
                            <th className="px-6 py-4 text-center">Chi tiết</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {alertRecords.map((record, index) => (
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
                                    <button type="button" onClick={() => openDetail(record)} className="p-2 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {alertRecords.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-8 text-xs text-gray-400 font-semibold italic">
                                    Hệ thống chưa ghi nhận hồ sơ cận nặng lâm sàng nguy hiểm nào cần cảnh báo.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200 flex justify-between items-center">
                    <p className="text-xs text-gray-400 font-semibold">Hiển thị {alertRecords.length} ca cận nặng mới phát hiện</p>
                    <div className="flex gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-100 disabled:opacity-30 cursor-pointer">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded bg-[#004194] text-white font-bold text-xs">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-100 cursor-pointer">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL XEM CHI TIẾT HỒ SƠ BỆNH ÁN */}
            {isDetailOpen && selectedRecord && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <div>
                                <h2 className="text-2xl font-black text-gray-950">Eye Exam Record Details</h2>
                                <p className="text-sm font-semibold text-blue-900 mt-1">Patient: {selectedRecord.patientName}</p>
                            </div>
                            <button type="button" onClick={() => setIsDetailOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
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

                            {/* Mắt phải */}
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

                        <button type="button" onClick={() => setIsDetailOpen(false)} className="w-full mt-8 py-4 bg-gray-950 text-white rounded-2xl font-black hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 cursor-pointer">
                            Close Details
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;