import { X } from "lucide-react";
import Pagination from "../../../shared/components/Pagination.jsx";

const ClassDetailModal = ({ onClose, data, onPageChange }) => {
    if (!data) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white p-8 rounded-3xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <div>
                        <h2 className="text-2xl font-black text-gray-950 uppercase">Lớp: {data.className || '---'}</h2>
                        <p className="text-sm font-semibold text-blue-900 mt-1">{data.patientCount || 0} học sinh</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                        <X size={22} className="text-gray-400" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 pr-2 scrollbar-thin">
                    <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 bg-white border-b border-gray-100 z-10">
                        <tr className="text-gray-400 uppercase text-[10px] font-black tracking-widest">
                            <th className="pb-3 pl-2">Họ và tên</th>
                            <th className="pb-3">Ngày sinh</th>
                            <th className="pb-3">Phường/Xã</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {Array.isArray(data.patients) && data.patients.length > 0 ? (
                            data.patients.map((p, idx) => (
                                <tr key={p.patientId || idx} className="hover:bg-blue-50/50 transition-colors">
                                    <td className="py-4 pl-2 font-bold text-gray-900">{p.patientName || '---'}</td>
                                    <td className="py-4 text-gray-600 font-medium">{p.dob || '---'}</td>
                                    <td className="py-4 text-gray-600 font-medium italic">{p.wardName || 'Chưa cập nhật'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="py-12 text-center text-gray-400 font-bold italic bg-gray-50/50">Chưa có học sinh nào.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-black text-gray-400 uppercase">Trang {(data.number || 0) + 1} / {data.totalPages || 1}</span>
                    <Pagination currentPage={data.number || 0} totalPages={data.totalPages || 1} onPageChange={onPageChange} />
                </div>
            </div>
        </div>
    );
};
export default ClassDetailModal;