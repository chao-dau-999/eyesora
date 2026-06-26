import { X } from "lucide-react";
import Pagination from "../../../shared/components/Pagination.jsx"; // Import đúng đường dẫn

const ClassDetailModal = ({ onClose, data, onPageChange }) => {
    if (!data) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white p-8 rounded-3xl w-full max-w-2xl shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-black text-gray-950">{data.className}</h3>
                        <p className="text-sm font-bold text-blue-900">{data.patientCount} Patients</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="text-gray-500"/></button>
                </div>

                <div className="overflow-y-auto flex-1 pr-2">
                    <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 bg-white border-b border-gray-100">
                        <tr className="text-gray-400 uppercase text-[10px] font-black tracking-widest">
                            <th className="pb-3 pl-2">Name</th><th className="pb-3">DOB</th><th className="pb-3">Ward</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {data.patients.map((p, idx) => (
                            <tr key={p.patientId || idx} className="hover:bg-gray-50">
                                <td className="py-4 pl-2 font-bold text-gray-900">{p.patientName}</td>
                                <td className="py-4 text-gray-600">{p.dob}</td>
                                <td className="py-4 text-gray-600 italic">{p.wardName || 'N/A'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer phân trang giống CampaignsPage */}
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <span className="text-xs font-black text-gray-400 uppercase">
                        Page {data.number + 1} / {data.totalPages || 1}
                    </span>
                    <Pagination
                        currentPage={data.number}
                        totalPages={data.totalPages}
                        onPageChange={onPageChange}
                    />
                </div>
            </div>
        </div>
    );
};
export default ClassDetailModal;