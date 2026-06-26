import { useState, useEffect } from 'react';
import SearchBar from "../../../shared/components/SearchBar.jsx";
import PatientAction from "../components/PatientAction.jsx";
import PatientTable from "../components/PatientTable.jsx";
import PatientDetailModal from "../components/PatientDetailModal.jsx";
import PatientFormModal from "../components/PatientFormModal.jsx";

const PatientPage = () => {
    const [patients, setPatients] = useState([]);
    const [pageInfo, setPageInfo] = useState({ pageNumber: 0, pageSize: 10, totalElements: 0, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

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

    useEffect(() => {
        fetchPatients(pageInfo.pageNumber);
    }, [pageInfo.pageNumber]);

    const handleSave = async (payload) => {
        const method = selectedPatient ? 'PUT' : 'POST';
        const url = selectedPatient
            ? `http://localhost:8080/api/patients/${selectedPatient.patientId}`
            : 'http://localhost:8080/api/patients';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // Cố gắng đọc message từ Backend (ví dụ: "Campaign is locked")
            const errorText = await response.text();
            throw new Error(errorText || "Lỗi không xác định");
        }

        setIsFormModalOpen(false);
        fetchPatients(pageInfo.pageNumber);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '---';
        return dateStr;
    };

    return (
        <div className="p-6 h-full overflow-y-auto">
            <div className="bg-white border p-4 rounded-xl mb-6 flex justify-between items-center">
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <button
                    onClick={() => { setSelectedPatient(null); setIsFormModalOpen(true); }}
                    className="bg-blue-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-800 transition-all"
                >
                    + Thêm bệnh nhân
                </button>
            </div>

            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <PatientTable
                    patients={patients}
                    loading={loading}
                    pageInfo={pageInfo}
                    formatDate={formatDate}
                    onEdit={(p) => {
                        console.log("Editing patient:", p);
                        setSelectedPatient(p);
                        setIsFormModalOpen(true);
                    }}
                    onDetail={(p) => { setSelectedPatient(p); setIsDetailModalOpen(true); }}
                />
            </div>

            {/* Modal Form Create/Edit */}
            {isFormModalOpen && (
                <PatientFormModal
                    patient={selectedPatient}
                    onClose={() => setIsFormModalOpen(false)}
                    onSave={handleSave}
                />
            )}

            {/* Modal Detail */}
            {isDetailModalOpen && (
                <PatientDetailModal
                    patient={selectedPatient}
                    formatDate={formatDate}
                    onClose={() => setIsDetailModalOpen(false)}
                />
            )}
        </div>
    );
};

export default PatientPage;