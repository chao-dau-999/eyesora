import React, { useEffect, useState, useCallback } from 'react';
import axiosClient from "../../../shared/axios/axiosClient.js";
import FacilityCharts from "../components/FacilityCharts.jsx";

const FacilityDashboard = () => {
    const [facilities, setFacilities] = useState([]);
    const [selectedFacilityId, setSelectedFacilityId] = useState("");

    const [gradeStats, setGradeStats] = useState([]);
    const [timelineStats, setTimelineStats] = useState([]);

    const [chartLoading, setChartLoading] = useState(false);
    const [animateBars, setAnimateBars] = useState(false);

    // 1. Lấy danh sách trường học từ db đổ vào Select Option
    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const res = await axiosClient.get('/dashboard/facility/list');
                const list = res.data || [];
                setFacilities(list);
                if (list.length > 0) {
                    setSelectedFacilityId(list[0].id);
                }
            } catch (error) {
                console.error("Lỗi khi tải danh sách cơ sở trường học:", error);
            }
        };
        fetchFacilities();
    }, []);

    // 2. Tải dữ liệu các biểu đồ dựa theo FacilityId tương ứng
    const fetchChartData = useCallback(async (facilityId) => {
        if (!facilityId) return;
        try {
            setChartLoading(true);
            setAnimateBars(false);
            const params = { facilityId };

            const [gradeRes, timelineRes] = await Promise.all([
                axiosClient.get('/dashboard/facility/grade-stats', { params }),
                axiosClient.get('/dashboard/facility/timeline', { params })
            ]);

            setGradeStats(gradeRes.data || []);
            setTimelineStats(timelineRes.data || []);
            setTimeout(() => setAnimateBars(true), 150);
        } catch (error) {
            console.error("Lỗi khi tải báo cáo thống kê cơ sở:", error);
        } finally {
            setChartLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedFacilityId) {
            fetchChartData(selectedFacilityId);
        }
    }, [selectedFacilityId, fetchChartData]);

    // Xử lý tạo SVG vector path cho Line Chart xu hướng năm học
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

    return (
        <div className="p-6 bg-[#f5f7fa] h-full overflow-y-auto text-gray-950">
            {/* Header và Bộ lọc Select Box chọn trường */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                <div>
                    <h1 className="text-lg font-bold text-gray-900">Báo cáo Thống kê theo Cơ sở</h1>
                    <p className="text-xs text-gray-500">Chọn cơ sở giáo dục có trong hệ thống để xem dữ liệu phân tích</p>
                </div>

                <div className="w-full sm:w-80">
                    <select
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#004194] focus:border-[#004194] p-2.5 outline-none font-semibold transition-all cursor-pointer"
                        value={selectedFacilityId}
                        onChange={(e) => setSelectedFacilityId(e.target.value)}
                    >
                        {facilities.length === 0 && <option value="">Đang tải danh sách các cơ sở...</option>}
                        {facilities.map((fac) => (
                            <option key={fac.id} value={fac.id}>
                                {fac.facilityName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Khối hiển thị nội dung biểu đồ */}
            {chartLoading ? (
                <div className="flex flex-col items-center justify-center h-72 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="w-8 h-8 border-4 border-[#004194] border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-xs text-gray-400 italic">Đang đồng bộ dữ liệu đồ thị...</p>
                </div>
            ) : (
                <FacilityCharts
                    gradeStats={gradeStats}
                    timelineStats={timelineStats}
                    animateBars={animateBars}
                    path={path}
                    circles={circles}
                />
            )}
        </div>
    );
};

export default FacilityDashboard;