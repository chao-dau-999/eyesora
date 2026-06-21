import {useState, useEffect} from 'react';
import SearchBar from "../components/SearchBar";
import PatientAction from "../components/PatientAction.jsx";
import {View, Trash, SquarePen, MoveLeft, MoveRight} from "lucide-react";

const PatientManagement = () => {
    const [patients, setPatients] = useState([]);
    const [pageInfo, setPageInfo] = useState({pageNumber: 0, pageSize: 10, totalElements: 0, totalPages: 1});
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

    const fetchPatients = async (page = 0, size = 10) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/patients?page=${page}&size=${size}`);
            const data = await response.json();

            setPatients(data.content || []);
            setPageInfo({
                pageNumber: data.pageable?.pageNumber || 0,
                pageSize: data.pageable?.pageSize || 10,
                totalElements: data.totalElements || 0,
                totalPages: data.totalPages || 1
            });
        } catch (error) {
            console.error("Lỗi khi kết nối dữ liệu bệnh nhân:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients(pageInfo.pageNumber, pageInfo.pageSize);
    }, [pageInfo.pageNumber]);

    const filteredPatients = patients.filter(p =>
        p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.patientId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateStr) => {
        if (!dateStr) return '---';
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="p-6 h-full overflow-y-auto scrollbar-thin">
            <div
                className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onAddClick={() => alert('Chức năng thêm học sinh đang phát triển')}
                    onBulkClick={() => setIsBulkModalOpen(true)}
                />

                <PatientAction/>
            </div>


            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-base font-bold text-gray-900">Hồ sơ Học sinh / Bệnh nhân</h3>
                    <span className="text-sm text-gray-500">Tổng số: {pageInfo.totalElements} học sinh</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-gray-50/30 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <th className="px-6 py-3 font-bold w-12">STT</th>
                            <th className="px-4 py-3 font-bold">Mã bệnh nhân</th>
                            <th className="px-4 py-3 font-bold">Họ và Tên</th>
                            <th className="px-4 py-3 font-bold text-center">Ngày Sinh</th>
                            <th className="px-4 py-3 font-bold text-center">Giới tính</th>
                            <th className="px-4 py-3 font-bold">Số điện thoại</th>
                            <th className="px-4 py-3 font-bold">Địa chỉ (Phường/Xã)</th>
                            <th className="px-6 py-3 font-bold text-right">Hành động</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="8" className="text-center py-8 text-gray-500">Đang tải dữ liệu...</td>
                            </tr>
                        ) : filteredPatients.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center py-8 text-gray-500 italic">Không tìm thấy kết quả
                                    phù hợp
                                </td>
                            </tr>
                        ) : (
                            filteredPatients.map((patient, index) => (
                                <tr key={patient.patientId} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {String(pageInfo.pageNumber * pageInfo.pageSize + index + 1).padStart(2, '0')}
                                    </td>
                                    <td className="px-4 py-4 font-mono text-xs text-blue-950 font-bold max-w-[120px] truncate"
                                        title={patient.patientId}>
                                        {patient.patientId}
                                    </td>
                                    <td className="px-4 py-4 font-semibold text-gray-900">{patient.patientName}</td>
                                    <td className="px-4 py-4 text-sm text-center text-gray-900">{formatDate(patient.dob)}</td>
                                    <td className="px-4 py-4 text-center">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                                patient.gender === 'MALE' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                                            }`}>
                                                {patient.gender === 'MALE' ? 'Nam' : 'Nữ'}
                                            </span>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-600">{patient.parentPhone || '---'}</td>
                                    <td className="px-4 py-4 text-sm text-gray-600">{patient.wardName}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                className="text-gray-400 hover:text-blue-900 text-sm font-bold bg-transparent border-none cursor-pointer"><View />
                                            </button>
                                            <button
                                                className="text-gray-400 hover:text-blue-900 transition-colors cursor-pointer">
                                                <span className="material-symbols-outlined text-[20px]"><SquarePen /></span>
                                            </button>
                                            <button
                                                className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
                                                <span className="material-symbols-outlined text-[20px]"><Trash /></span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang động dựa vào API */}
                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                        Hiển thị {filteredPatients.length} trong số {pageInfo.totalElements} kết quả
                    </span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setPageInfo(prev => ({
                                ...prev,
                                pageNumber: Math.max(0, prev.pageNumber - 1)
                            }))}
                            disabled={pageInfo.pageNumber === 0}
                            className="p-1 rounded border border-gray-200 hover:bg-gray-100 transition-colors disabled:opacity-30 cursor-pointer"
                        >
                            <span className="text-blue-900 hover:text-blue-900 transition-colors cursor-pointer"><MoveLeft /></span>
                        </button>

                        {[...Array(pageInfo.totalPages)].map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setPageInfo(prev => ({...prev, pageNumber: idx}))}
                                className={`px-3 py-1 rounded text-sm font-bold cursor-pointer ${
                                    pageInfo.pageNumber === idx
                                        ? 'bg-blue-900 text-white'
                                        : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            >
                                {idx + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setPageInfo(prev => ({
                                ...prev,
                                pageNumber: Math.min(prev.totalPages - 1, prev.pageNumber + 1)
                            }))}
                            disabled={pageInfo.pageNumber === pageInfo.totalPages - 1}
                            className="p-1 rounded border border-gray-200 hover:bg-gray-100 transition-colors disabled:opacity-30 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-blue-900 hover:text-blue-900 transition-colors cursor-pointer" ><MoveRight /></span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Bulk Entry Modal */}
            {isBulkModalOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div
                        className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                        {/* Modal Header */}
                        <div className="px-6 py-4 bg-blue-900 text-white flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold">Nhập nhanh kết quả khám thị lực</h2>
                                <p className="text-blue-200 text-xs mt-0.5">Đợt khám: Sức khỏe định kỳ Học kỳ I</p>
                            </div>
                            <button className="hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
                                    onClick={() => setIsBulkModalOpen(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Modal Content - Danh sách bệnh nhân thật từ API để nhập liệu */}
                        <div className="p-6 flex-grow overflow-y-auto scrollbar-thin">
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr className="text-xs font-semibold text-gray-500">
                                        <th className="px-4 py-3 w-1/3">Tên Học Sinh</th>
                                        <th className="px-4 py-3 text-center">Mắt Trái (SPH)</th>
                                        <th className="px-4 py-3 text-center">Mắt Phải (SPH)</th>
                                        <th className="px-4 py-3 text-center">Trụ Trái (CYL)</th>
                                        <th className="px-4 py-3 text-center">Trụ Phải (CYL)</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {patients.map((patient) => (
                                        <tr key={patient.patientId} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-3">
                                                <p className="font-bold text-gray-900">{patient.patientName}</p>
                                                <p className="text-[10px] text-gray-400 font-mono max-w-[180px] truncate">{patient.patientId}</p>
                                            </td>
                                            <td className="px-4 py-3"><input
                                                className="w-full text-center py-1 rounded border border-gray-200 focus:border-blue-900 font-mono text-sm"
                                                type="text" placeholder="0.00"/></td>
                                            <td className="px-4 py-3"><input
                                                className="w-full text-center py-1 rounded border border-gray-200 focus:border-blue-900 font-mono text-sm"
                                                type="text" placeholder="0.00"/></td>
                                            <td className="px-4 py-3"><input
                                                className="w-full text-center py-1 rounded border border-gray-200 focus:border-blue-900 font-mono text-sm"
                                                type="text" placeholder="0.00"/></td>
                                            <td className="px-4 py-3"><input
                                                className="w-full text-center py-1 rounded border border-gray-200 focus:border-blue-900 font-mono text-sm"
                                                type="text" placeholder="0.00"/></td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                            <button
                                className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-200 transition-colors rounded-lg cursor-pointer"
                                onClick={() => setIsBulkModalOpen(false)}>Hủy
                            </button>
                            <button
                                className="px-6 py-2 bg-blue-900 text-white font-bold hover:bg-blue-800 rounded-lg shadow-sm active:scale-95 transition-all cursor-pointer"
                                onClick={() => {
                                    alert('Đã lưu kết quả khám!');
                                    setIsBulkModalOpen(false);
                                }}>Lưu kết quả
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientManagement;