import { X } from "lucide-react";

const PatientDetailModal = ({ patient, onClose, formatDate }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="bg-blue-900 px-6 py-4 flex justify-between items-center">
                <h2 className="text-white text-lg font-bold">Thông tin chi tiết học sinh</h2>
                <button onClick={onClose} className="text-white hover:text-gray-200"><X size={20}/></button>
            </div>

            {/* Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoBox label="Họ Tên" value={patient.patientName} />
                <InfoBox label="Mã HS" value={patient.patientId} />

                {/* Bổ sung Chiến dịch ở đây */}
                <div className="col-span-1 md:col-span-2">
                    <InfoBox label="Chiến dịch" value={patient.campaignTitle || patient.campaignName || '---'} />
                </div>

                <InfoBox label="Lớp" value={patient.className} />
                <InfoBox label="Cơ sở" value={patient.facilityName} />
                <InfoBox label="SĐT" value={patient.parentPhone} />
                <InfoBox label="Ngày sinh" value={formatDate(patient.dob)} />
                <InfoBox label="Giới tính" value={patient.gender === 'MALE' ? 'Nam' : 'Nữ'} />

                <div className="col-span-1 md:col-span-2">
                    <InfoBox label="Địa chỉ (Phường/Xã)" value={patient.wardName} />
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 text-right border-t border-gray-200">
                <button
                    className="px-6 py-2 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-800 transition-all"
                    onClick={onClose}
                >
                    Đóng
                </button>
            </div>
        </div>
    </div>
);

const InfoBox = ({ label, value }) => (
    <div className="bg-white border border-gray-200 p-4 rounded-xl">
        <p className="text-gray-500 text-xs font-bold uppercase mb-1">{label}</p>
        <p className="text-gray-950 font-bold text-base">{value || '---'}</p>
    </div>
);

export default PatientDetailModal;