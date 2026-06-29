import React from 'react';
import { Users, TrendingUp, AlertTriangle, Building2 } from 'lucide-react';

const StatsCards = ({ summary }) => {
    const stats = [
        {
            title: "Tổng số học sinh đã khám",
            value: (summary?.totalExaminedStudents || 0).toLocaleString('vi-VN'),
            icon: <Users className="w-6 h-6" />,
            bgColor: "bg-blue-900/10 text-[#004194]"
        },
        {
            title: "Tỷ lệ cận thị hiện tại",
            value: `${summary?.currentMyopiaRate || 0}%`,
            icon: <TrendingUp className="w-5 h-5 mr-1" />,
            trend: summary?.myopiaRateTrend !== null && summary?.myopiaRateTrend !== undefined ? `${summary.myopiaRateTrend > 0 ? '+' : ''}${summary.myopiaRateTrend}%` : null,
            hasProgress: true
        },
        {
            title: "Số ca báo động cận nặng",
            value: (summary?.totalAlertCases || 0).toString(),
            icon: <AlertTriangle className="w-6 h-6 animate-pulse" />,
            bgColor: "bg-red-500/20 text-[#ba1a1a]",
            isAlert: true
        },
        {
            title: "Cơ sở tham gia",
            value: (summary?.totalParticipatingFacilities || 0).toString(),
            icon: <Building2 className="w-6 h-6" />,
            bgColor: "bg-slate-200 text-slate-700"
        }
    ];

    return (
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
                                <div className={`flex items-center font-bold text-xs ${summary?.myopiaRateTrend > 0 ? 'text-[#ba1a1a]' : 'text-green-600'}`}>
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
    );
};

export default StatsCards;