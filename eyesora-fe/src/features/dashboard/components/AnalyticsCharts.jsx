import React from 'react';

const AnalyticsCharts = ({ gradeStats, timelineStats, animateBars, path, circles }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col">
                <div className="mb-4">
                    <h3 className="text-base font-bold text-gray-900">Tỷ lệ cận thị theo khối lớp</h3>
                </div>
                <div className="flex flex-col w-full h-72">
                    {gradeStats && gradeStats.length > 0 ? (
                        <>
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
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center border border-dashed border-gray-200 rounded-xl text-xs text-gray-400 italic">
                            Không có dữ liệu phân tích theo khối lớp
                        </div>
                    )}
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
                    {timelineStats && timelineStats.length > 0 ? (
                        <>
                            <svg className="w-full h-4/5 overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 200">
                                {path && <path d={path} fill="none" stroke="#004194" strokeLinecap="round" strokeWidth="3"></path>}
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
                                        {item.schoolYear} {item.type === 'PREDICTED' ? '(DB)' : ''}
                                    </span>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center border border-dashed border-gray-200 rounded-xl text-xs text-gray-400 italic">
                            Không có dữ liệu dòng thời gian xu hướng
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsCharts;