import React from 'react';
import { Users, TrendingUp, AlertTriangle } from 'lucide-react';

const FacilityStatsCards = ({ summary }) => {
    const stats = [
        {
            title: "Tổng số học sinh đã khám",
            value: (summary?.totalExaminedStudents || 0).toLocaleString('vi-VN') + " học sinh",
            icon: <Users className="w-6 h-6" />,
            bgColor: "bg-blue-900/10 text-[#004194]"
        },
        {
            title: "Tỷ lệ cận thị hiện tại",
            value: `${summary?.currentMyopiaRate || 0}%`,
            icon: <TrendingUp className="w-5 h-5 mr-1" />,
            hasProgress: true
        },
        {
            title: "Số ca báo động cận nặng",
            value: (summary?.totalAlertCases || 0).toString() + " ca",
            icon: <AlertTriangle className="w-6 h-6 animate-pulse" />,
            bgColor: "bg-red-500/20 text-[#ba1a1a]",
            isAlert: true
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                            {stat.bgColor && (
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
    );
};

export default FacilityStatsCards;