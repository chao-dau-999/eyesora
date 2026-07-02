import { Users, SquarePen, Trash } from "lucide-react";

const PatientTable = ({ patients, loading, pageInfo, onDetail, onEdit, onDelete, formatDate }) => (
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
                <th className="px-6 py-3 font-bold text-right">Hành động</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
            {loading ? (
                <tr><td colSpan="9" className="text-center py-8 text-gray-500">Đang tải...</td></tr>
            ) : patients.length === 0 ? (
                <tr><td colSpan="9" className="text-center py-8 text-gray-500 italic">Không tìm thấy kết quả</td></tr>
            ) : (
                patients.map((p, index) => (
                    <tr key={p.patientId} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                        <td className="px-4 py-4 font-mono text-xs text-blue-950 font-bold">{p.patientId}</td>
                        <td className="px-4 py-4 font-semibold text-gray-900">{p.patientName}</td>
                        <td className="px-4 py-4 text-sm font-bold text-blue-800">{p.className || '---'}</td>
                        <td className="px-4 py-4 text-sm text-center text-gray-900">{p.dob}</td>
                        <td className="px-4 py-4 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${p.gender === 'MALE' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                                {p.gender === 'MALE' ? 'Nam' : 'Nữ'}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                                <button onClick={() => onDetail(p)} className="text-green-600 hover:text-green-800"><Users size={20}/></button>
                                <button onClick={() => onEdit(p)} className="text-blue-600"><SquarePen size={18}/></button>
                                <button onClick={() => onDelete(p)} className="text-gray-400 hover:text-red-600"><Trash size={20}/></button>
                            </div>
                        </td>
                    </tr>
                ))
            )}
            </tbody>
        </table>
    </div>
);
export default PatientTable;