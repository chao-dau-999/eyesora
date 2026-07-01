import { X } from "lucide-react";

const FacilityDetailModal = ({ data, onClose }) => {
    if (!data) return null;
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl">

                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-black text-gray-950">Chi tiết cơ sở</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                        <X size={22} className="text-gray-400" />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 bg-gray-50 p-4 rounded-xl mb-6 text-sm">
                    {[
                        { label: 'Tên cơ sở', value: data.facilityName },
                        { label: 'Loại hình', value: data.facilityType },
                        { label: 'Điện thoại', value: data.phone },
                        { label: 'Địa chỉ', value: data.address },
                        { label: 'Phường/Xã', value: data.wardName }
                    ].map((i, idx) => (
                        <div key={idx} className="flex justify-between border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{i.label}</span>
                            <span className="text-sm font-black text-blue-900">{i.value || 'N/A'}</span>
                        </div>
                    ))}
                </div>

                <button onClick={onClose} className="w-full py-4 bg-gray-950 text-white rounded-2xl font-black hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 cursor-pointer">
                    Đóng chi tiết
                </button>
            </div>
        </div>
    );
};
export default FacilityDetailModal;