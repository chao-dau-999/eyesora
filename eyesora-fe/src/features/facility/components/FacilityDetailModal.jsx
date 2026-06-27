import { X } from "lucide-react";

const FacilityDetailModal = ({ data, onClose }) => {
    if (!data) return null;
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white p-8 rounded-3xl w-full max-w-sm shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black text-gray-950">Chi tiết cơ sở</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-900"><X size={20}/></button>
                </div>
                <div className="space-y-4">
                    {[
                        { label: 'Tên cơ sở', value: data.facilityName },
                        { label: 'Loại hình', value: data.facilityType },
                        { label: 'Điện thoại', value: data.phone },
                        { label: 'Địa chỉ', value: data.address },
                        { label: 'Phường/Xã', value: data.wardName }
                    ].map((i, idx) => (
                        <div key={idx} className="border-b border-gray-100 pb-2">
                            <span className="block text-[10px] font-black text-gray-400 uppercase">{i.label}</span>
                            <span className="text-sm font-bold text-gray-800">{i.value || 'N/A'}</span>
                        </div>
                    ))}
                </div>
                <button onClick={onClose} className="w-full mt-8 py-3 bg-gray-900 text-white rounded-xl font-black hover:bg-gray-800">Đóng</button>
            </div>
        </div>
    );
};
export default FacilityDetailModal;