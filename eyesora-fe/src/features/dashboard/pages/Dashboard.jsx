import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, AlertTriangle, Building2, Eye, ChevronLeft, ChevronRight, SlidersHorizontal, Download } from 'lucide-react';

const AdminDashboard = () => {
    // State xử lý hiệu ứng mở thanh đồ thị cột (Bar Chart Animation)
    const [animateBars, setAnimateBars] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimateBars(true), 150);
        return () => clearTimeout(timer);
    }, []);

    // Khối dữ liệu mock data phục vụ thống kê (Dễ dàng thay bằng API)
    const stats = [
        {
            title: "Tổng số học sinh đã khám",
            value: "12,450",
            icon: <Users className="w-6 h-6" />,
            bgColor: "bg-blue-900/10 text-[#004194]"
        },
        {
            title: "Tỷ lệ cận thị hiện tại",
            value: "38.5%",
            icon: <TrendingUp className="w-5 h-5 mr-1" />,
            trend: "2.4%",
            hasProgress: true
        },
        {
            title: "Số ca báo động",
            value: "156",
            icon: <AlertTriangle className="w-6 h-6 animate-pulse" />,
            bgColor: "bg-red-500/20 text-[#ba1a1a]",
            isAlert: true
        },
        {
            title: "Cơ sở tham gia",
            value: "42",
            icon: <Building2 className="w-6 h-6" />,
            bgColor: "bg-slate-200 text-slate-700"
        }
    ];

    const blockChartData = [
        { label: "Khối 6", value: 32, colorClass: "bg-blue-900/20" },
        { label: "Khối 7", value: 37, colorClass: "bg-blue-900/40" },
        { label: "Khối 8", value: 41, colorClass: "bg-blue-900/60" },
        { label: "Khối 9", value: 44, colorClass: "bg-blue-900" }
    ];

    const alertPatients = [
        { id: "HS01245", name: "Nguyễn Văn An", school: "THCS Nguyễn Huệ", class: "9A1", sph: "-6.50 D", status: "Cận nặng", severity: "heavy" },
        { id: "HS01298", name: "Lê Thị Bảo", school: "THCS Phan Chu Trinh", class: "8C2", sph: "-4.25 D", status: "Cận vừa", severity: "medium" },
        { id: "HS01302", name: "Trần Minh Quân", school: "THCS Trưng Vương", class: "7B4", sph: "-6.25 D", status: "Cận nặng", severity: "heavy" },
        { id: "HS01315", name: "Phạm Ngọc Lan", school: "THCS Nguyễn Huệ", class: "9A1", sph: "-3.75 D", status: "Cận vừa", severity: "medium" }
    ];

    return (
        <div className="p-6 bg-[#f5f7fa] h-full overflow-y-auto scrollbar-thin">

            {/* Top Row: Cards Thống Kê */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {stats.map((stat, index) => {
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
                                    <div className="flex items-center text-[#ba1a1a] font-bold text-xs">
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

                {/* Bar Chart: Tỷ lệ cận thị khối lớp */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-base font-bold text-gray-900">Tỷ lệ cận thị theo khối lớp</h3>
                    </div>
                    <div className="flex items-end justify-around h-64 gap-4 px-4">
                        {blockChartData.map((item, index) => (
                            <div key={index} className="flex flex-col items-center w-full max-w-[60px]">
                                <div
                                    className={`w-full ${item.colorClass} rounded-t-lg relative transition-all duration-700 ease-out`}
                                    style={{ height: animateBars ? `${item.value}%` : '0%' }}
                                >
                                    <span className="absolute -top-6 left-1/2 -translate-y-1/2 text-xs font-bold text-[#004194]">
                                        {item.value}%
                                    </span>
                                </div>
                                <p className="mt-4 text-xs font-medium text-gray-500">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Line Chart SVG: Xu hướng qua các năm */}
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
                            <path d="M 0,160 L 100,140 L 200,125 L 300,110 L 400,90" fill="none" stroke="#004194" strokeLinecap="round" strokeWidth="3"></path>
                            <circle cx="0" cy="160" fill="#004194" r="4"></circle>
                            <circle cx="100" cy="140" fill="#004194" r="4"></circle>
                            <circle cx="200" cy="125" fill="#004194" r="4"></circle>
                            <circle cx="300" cy="110" fill="#004194" r="4"></circle>
                            <circle cx="400" cy="90" fill="#004194" r="4"></circle>
                        </svg>
                        <div className="absolute bottom-2 w-full flex justify-between px-2">
                            <span className="text-xs font-medium text-gray-400">2023</span>
                            <span className="text-xs font-medium text-gray-400">2024</span>
                            <span className="text-xs font-medium text-gray-400">2025</span>
                            <span className="text-xs font-medium text-gray-400">2026 (Dự báo)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Bảng Ca Bệnh Cảnh Báo */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center bg-gray-50/70 gap-2">
                    <h3 className="text-base font-bold text-gray-900">Danh sách ca bệnh cần cảnh báo gấp</h3>
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
                            <th className="px-6 py-4">Mã HS</th>
                            <th className="px-6 py-4">Họ Tên</th>
                            <th className="px-6 py-4">Trường</th>
                            <th className="px-6 py-4">Lớp</th>
                            <th className="px-6 py-4">Độ cận (SPH)</th>
                            <th className="px-6 py-4">Trạng thái</th>
                            <th className="px-6 py-4 text-center">Hành động</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {alertPatients.map((patient) => (
                            <tr key={patient.id} className="hover:bg-gray-50/60 hover:translate-x-1 transition-all duration-200">
                                <td className="px-6 py-4 font-mono text-xs font-bold text-[#004194]">{patient.id}</td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{patient.name}</td>
                                <td className="px-6 py-4 text-xs text-gray-600">{patient.school}</td>
                                <td className="px-6 py-4 text-xs text-gray-600">{patient.class}</td>
                                <td className={`px-6 py-4 font-mono text-xs font-bold ${patient.severity === 'heavy' ? 'text-[#ba1a1a]' : 'text-gray-700'}`}>
                                    {patient.sph}
                                </td>
                                <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                            patient.severity === 'heavy'
                                                ? 'bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]/10'
                                                : 'bg-blue-100 text-blue-800 border-blue-200'
                                        }`}>
                                            {patient.status}
                                        </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button className="p-2 text-[#004194] hover:bg-blue-50 rounded-full transition-colors cursor-pointer">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer Pagination */}
                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200 flex justify-between items-center">
                    <p className="text-xs text-gray-400">Hiển thị 1-4 trong số 156 ca báo động</p>
                    <div className="flex gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-100 disabled:opacity-30 cursor-pointer">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded bg-[#004194] text-white font-bold text-xs">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-100 text-xs cursor-pointer">2</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-100 text-xs cursor-pointer">3</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-100 cursor-pointer">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;