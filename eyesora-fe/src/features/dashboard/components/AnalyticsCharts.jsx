import React from 'react';

const AnalyticsCharts = ({ gradeStats, facilityStats = [], animateBars }) => {
    return (
        <div className="flex flex-col w-full">
            {/* Tỷ lệ cận thị theo khối lớp */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col mb-6">
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

            {/* Tỷ lệ cận thị giữa các trường học */}
            <div className="w-full bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6 flex flex-col">
                <div className="mb-4">
                    <h3 className="text-base font-bold text-gray-900">Tỷ lệ cận thị giữa các trường học</h3>
                </div>

                <div className="flex flex-col w-full h-72">
                    {facilityStats && facilityStats.length > 0 ? (
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

                                {facilityStats.map((item, index) => (
                                    <div key={index} className="relative flex flex-col items-center w-full h-full justify-end border-r border-dashed border-gray-300 last:border-r-0 px-2">
                                        <span className="absolute text-xs font-semibold text-gray-800 pb-1.5 transition-all duration-1000 select-none"
                                              style={{ bottom: animateBars ? `${item.rate}%` : '0%' }}>
                                              {item.rate}%
                                        </span>
                                        <div
                                            className="w-12 bg-[#4472c4] transition-all duration-1000 ease-out shadow-sm max-w-[80%]"
                                            style={{ height: animateBars ? `${item.rate}%` : '0%' }}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="bg-[#f2f2f2] border-b border-l border-r border-gray-300 h-10 flex justify-around items-center">
                                {facilityStats.map((item, index) => (
                                    <div key={index} className="w-full text-center border-r border-gray-300/60 last:border-r-0 px-1 truncate">
                                        <p className="text-xs font-bold text-gray-700 select-none truncate" title={item.facilityName}>
                                            {item.facilityName}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center border border-dashed border-gray-200 rounded-xl text-xs text-gray-400 italic">
                            Không có dữ liệu phân tích theo trường học
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsCharts;