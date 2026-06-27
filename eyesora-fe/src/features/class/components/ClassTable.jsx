import { Trash, SquarePen, Users } from "lucide-react";

const ClassTable = ({ classes, loading, page, onOpenDetail, onEdit }) => (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase font-black text-gray-500">
            <tr>
                <th className="p-6 w-16">STT</th>
                <th className="p-6">Tên lớp</th>
                <th className="p-6">Khối</th>
                <th className="p-6">Cơ sở</th>
                <th className="p-6">Năm học</th>
                <th className="p-6 text-right">Hành động</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
            {loading ? (
                <tr>
                    <td colSpan="6" className="text-center py-10 font-bold text-gray-500">Đang tải dữ liệu...</td>
                </tr>
            ) : classes.length === 0 ? (
                <tr>
                    <td colSpan="6" className="text-center py-10 font-bold text-gray-500 italic">Không tìm thấy dữ liệu</td>
                </tr>
            ) : (
                classes.map((cls, index) => (
                    <tr key={cls.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="p-6 text-gray-500 font-bold text-sm">{(page * 10) + index + 1}</td>
                        <td className="p-6 font-bold text-gray-900 text-sm">{cls.className}</td>
                        <td className="p-6 text-gray-600 text-sm">{cls.grade}</td>
                        <td className="p-6 text-sm text-gray-600">{cls.facilityName || 'N/A'}</td>
                        <td className="p-6 text-sm text-gray-600">{cls.schoolYear}</td>
                        <td className="p-6 text-right flex justify-end gap-3">
                            <button onClick={() => onOpenDetail(cls)} className="text-green-600 hover:text-green-800 transition-colors" title="Xem chi tiết">
                                <Users size={20}/>
                            </button>
                            <button onClick={() => onEdit(cls)} className="text-blue-900 hover:text-blue-700 transition-colors" title="Chỉnh sửa">
                                <SquarePen size={20}/>
                            </button>
                            <button className="text-red-500 hover:text-red-700 transition-colors" title="Xóa">
                                <Trash size={20}/>
                            </button>
                        </td>
                    </tr>
                ))
            )}
            </tbody>
        </table>
    </div>
);
export default ClassTable;