import { useState, useEffect } from 'react';
import SearchBar from "../components/SearchBar";
import PatientAction from "../components/PatientAction.jsx";
import { Trash, SquarePen, MoveLeft, MoveRight, Users, X } from "lucide-react";

const PatientManagement = () => {
    const [patients, setPatients] = useState([]);
    const [pageInfo, setPageInfo] = useState({ pageNumber: 0, pageSize: 10, totalElements: 0, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

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

    const openDetail = (patient) => {
        setSelectedPatient(patient);
        setIsDetailModalOpen(true);
    };

    return (
        <div className="p-6 h-full overflow-y-auto scrollbar-thin">
            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onAddClick={() => alert('Chức năng thêm học sinh đang phát triển')}
                    onBulkClick={() => setIsBulkModalOpen(true)}
                />
                <PatientAction />
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
                            <th className="px-4 py-3 font-bold">Lớp</th>
                            <th className="px-4 py-3 font-bold text-center">Ngày Sinh</th>
                            <th className="px-4 py-3 font-bold text-center">Giới tính</th>
                            <th className="px-4 py-3 font-bold">Số điện thoại</th>
                            <th className="px-4 py-3 font-bold">Địa chỉ (Phường/Xã)</th>
                            <th className="px-6 py-3 font-bold text-right">Hành động</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="9" className="text-center py-8 text-gray-500">Đang tải dữ liệu...</td></tr>
                        ) : filteredPatients.length === 0 ? (
                            <tr><td colSpan="9" className="text-center py-8 text-gray-500 italic">Không tìm thấy kết quả phù hợp</td></tr>
                        ) : (
                            filteredPatients.map((p, index) => (
                                <tr key={p.patientId} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-500">{String(pageInfo.pageNumber * pageInfo.pageSize + index + 1).padStart(2, '0')}</td>
                                    <td className="px-4 py-4 font-mono text-xs text-blue-950 font-bold">{p.patientId}</td>
                                    <td className="px-4 py-4 font-semibold text-gray-900">{p.patientName}</td>
                                    <td className="px-4 py-4 text-sm font-bold text-blue-800">{p.className || '---'}</td>
                                    <td className="px-4 py-4 text-sm text-center text-gray-900">{formatDate(p.dob)}</td>
                                    <td className="px-4 py-4 text-center">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${p.gender === 'MALE' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                                            {p.gender === 'MALE' ? 'Nam' : 'Nữ'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-600">{p.parentPhone || '---'}</td>
                                    <td className="px-4 py-4 text-sm text-gray-600">{p.wardName}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button onClick={() => openDetail(p)} className="text-green-600 hover:text-green-800 transition-colors cursor-pointer"><Users size={20}/></button>
                                            <button className="text-gray-400 hover:text-blue-900 transition-colors cursor-pointer"><SquarePen size={20}/></button>
                                            <button className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"><Trash size={20}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Hiển thị {filteredPatients.length} kết quả</span>
                    <div className="flex gap-1">
                        <button onClick={() => setPageInfo(prev => ({...prev, pageNumber: Math.max(0, prev.pageNumber - 1)}))} disabled={pageInfo.pageNumber === 0} className="p-1 rounded border border-gray-200 hover:bg-gray-100"><MoveLeft /></button>
                        {[...Array(pageInfo.totalPages)].map((_, idx) => (
                            <button key={idx} onClick={() => setPageInfo(prev => ({...prev, pageNumber: idx}))} className={`px-3 py-1 rounded text-sm font-bold ${pageInfo.pageNumber === idx ? 'bg-blue-900 text-white' : 'hover:bg-gray-100'}`}>{idx + 1}</button>
                        ))}
                        <button onClick={() => setPageInfo(prev => ({...prev, pageNumber: Math.min(pageInfo.totalPages - 1, prev.pageNumber + 1)}))} disabled={pageInfo.pageNumber >= pageInfo.totalPages - 1} className="p-1 rounded border border-gray-200 hover:bg-gray-100"><MoveRight /></button>
                    </div>
                </div>
            </div>

            {/* Modal Detail */}
            {isDetailModalOpen && selectedPatient && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-200">
                        {/* Header */}
                        <div className="bg-blue-900 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-white text-lg font-bold">Thông tin chi tiết học sinh</h2>
                            <button onClick={() => setIsDetailModalOpen(false)} className="text-white hover:text-gray-200"><X size={20}/></button>
                        </div>

                        {/* Body - Đã thêm Ngày sinh, Giới tính, Phường/Xã */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white border border-gray-200 p-4 rounded-xl">
                                <p className="text-gray-500 text-xs font-bold uppercase mb-1">Họ Tên</p>
                                <p className="text-gray-950 font-bold text-base">{selectedPatient.patientName}</p>
                            </div>
                            <div className="bg-white border border-gray-200 p-4 rounded-xl">
                                <p className="text-gray-500 text-xs font-bold uppercase mb-1">Mã HS</p>
                                <p className="text-blue-900 font-bold text-base font-mono">{selectedPatient.patientId}</p>
                            </div>
                            <div className="bg-white border border-gray-200 p-4 rounded-xl">
                                <p className="text-gray-500 text-xs font-bold uppercase mb-1">Lớp</p>
                                <p className="text-gray-950 font-bold text-base">{selectedPatient.className || 'N/A'}</p>
                            </div>
                            <div className="bg-white border border-gray-200 p-4 rounded-xl">
                                <p className="text-gray-500 text-xs font-bold uppercase mb-1">SĐT</p>
                                <p className="text-gray-950 font-bold text-base">{selectedPatient.parentPhone || '---'}</p>
                            </div>
                            <div className="bg-white border border-gray-200 p-4 rounded-xl">
                                <p className="text-gray-500 text-xs font-bold uppercase mb-1">Ngày sinh</p>
                                <p className="text-gray-950 font-bold text-base">{formatDate(selectedPatient.dob)}</p>
                            </div>
                            <div className="bg-white border border-gray-200 p-4 rounded-xl">
                                <p className="text-gray-500 text-xs font-bold uppercase mb-1">Giới tính</p>
                                <p className="text-gray-950 font-bold text-base">{selectedPatient.gender === 'MALE' ? 'Nam' : 'Nữ'}</p>
                            </div>
                            <div className="col-span-1 md:col-span-2 bg-white border border-gray-200 p-4 rounded-xl">
                                <p className="text-gray-500 text-xs font-bold uppercase mb-1">Địa chỉ (Phường/Xã)</p>
                                <p className="text-gray-950 font-bold text-base">{selectedPatient.wardName || '---'}</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 text-right border-t border-gray-200">
                            <button className="px-6 py-2 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-800 transition-all" onClick={() => setIsDetailModalOpen(false)}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Entry Modal */}
            {isBulkModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                        <div className="px-6 py-4 bg-blue-900 text-white flex justify-between items-center">
                            <h2 className="text-lg font-bold">Nhập nhanh kết quả</h2>
                            <button onClick={() => setIsBulkModalOpen(false)}><X/></button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b">
                                <tr className="text-xs font-bold text-gray-500 uppercase">
                                    <th className="p-3">Tên</th><th className="p-3">Lớp</th><th className="p-3">SPH Trái</th><th className="p-3">SPH Phải</th>
                                </tr>
                                </thead>
                                <tbody>
                                {patients.map(p => (
                                    <tr key={p.patientId} className="border-b">
                                        <td className="p-3 font-bold text-sm">{p.patientName}</td>
                                        <td className="p-3 font-bold text-blue-800 text-sm">{p.className}</td>
                                        <td className="p-3"><input className="w-full border rounded p-1" placeholder="0.00"/></td>
                                        <td className="p-3"><input className="w-full border rounded p-1" placeholder="0.00"/></td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 border-t flex justify-end"><button className="px-6 py-2 bg-blue-900 text-white rounded-lg font-bold" onClick={() => setIsBulkModalOpen(false)}>Lưu</button></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientManagement;