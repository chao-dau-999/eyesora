import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from "../../../shared/components/SearchBar.jsx";
import PatientAction from "../components/PatientAction.jsx";
import PatientTable from "../components/PatientTable.jsx";
import PatientDetailModal from "../components/PatientDetailModal.jsx";
import ConfirmModal from "../../../shared/components/ConfirmModal.jsx";
import Pagination from "../../../shared/components/Pagination.jsx";

const PatientPage = () => {
    const navigate = useNavigate();

    const [patients, setPatients] = useState([]);
    const [pageInfo, setPageInfo] = useState({ pageNumber: 0, pageSize: 10, totalElements: 0, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    const fetchPatients = async (page = 0, size = 10) => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/api/patients?page=${page}&size=${size}`);
            const data = await res.json();
            setPatients(data.content || []);
            setPageInfo({
                pageNumber: data.pageable?.pageNumber || 0,
                totalElements: data.totalElements || 0,
                totalPages: data.totalPages || 1,
                pageSize: size
            });
        } catch (error) {
            console.error("Lỗi fetch dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedPatient) return;
        setDeleteError(null);
        try {
            const res = await fetch(`http://localhost:8080/api/patients/${selectedPatient.patientId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setIsDeleteModalOpen(false);
                fetchPatients(pageInfo.pageNumber);
            } else {
                const errorMessage = await res.text();
                setDeleteError(errorMessage || "Có lỗi xảy ra, không thể xóa!");
            }
        } catch (error) {
            setDeleteError("Không thể kết nối tới máy chủ.");
        }
    };

    useEffect(() => {
        fetchPatients(pageInfo.pageNumber);
    }, [pageInfo.pageNumber]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '---';
        return dateStr;
    };

    return (
        <div className="p-6 bg-[#f5f7fa] h-full overflow-y-auto scrollbar-thin">

            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        Hồ sơ Học sinh / Bệnh nhân
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">Tổng số: {pageInfo.totalElements} học sinh</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/patients/create')}
                        className="bg-blue-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-800 active:scale-95 transition-all cursor-pointer flex-shrink-0"
                    >
                        + Thêm bệnh nhân
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>

            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <PatientTable
                    patients={patients}
                    loading={loading}
                    pageInfo={pageInfo}
                    formatDate={formatDate}
                    onEdit={(p) => navigate(`/patients/edit/${p.patientId}`)}
                    onDetail={(p) => { setSelectedPatient(p); setIsDetailModalOpen(true); }}
                    onDelete={(p) => { setSelectedPatient(p); setIsDeleteModalOpen(true); }}
                />

                <div className="flex items-center justify-between px-6 py-5 bg-white border-t border-gray-100">
                    <span className="text-xs font-black text-gray-400 uppercase">
                        Trang {pageInfo.pageNumber + 1} / {pageInfo.totalPages || 1}
                    </span>
                    <Pagination
                        currentPage={pageInfo.pageNumber}
                        totalPages={pageInfo.totalPages}
                        onPageChange={fetchPatients}
                    />
                </div>
            </div>

            {isDetailModalOpen && (
                <PatientDetailModal
                    patient={selectedPatient}
                    formatDate={formatDate}
                    onClose={() => setIsDetailModalOpen(false)}
                />
            )}

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteError(null);
                }}
                onConfirm={handleDelete}
                error={deleteError}
                title="Xác nhận xóa"
                message={`Bạn có chắc chắn muốn xóa bệnh nhân ${selectedPatient?.patientName}? Hành động này không thể hoàn tác.`}
            />
        </div>
    );
};

export default PatientPage;