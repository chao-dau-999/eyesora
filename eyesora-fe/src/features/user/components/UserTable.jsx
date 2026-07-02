import { Eye, SquarePen, Lock, Unlock } from "lucide-react";

const UserTable = ({ users, loading, onDetail, onEdit, onToggle }) => (
    <table className="w-full text-left">
        <thead className="bg-gray-50/30 text-xs font-bold text-gray-500 uppercase">
        <tr>
            <th className="px-8 py-4">Tên đăng nhập</th>
            <th className="px-4 py-4">Trạng thái</th>
            <th className="px-6 py-4 text-right">Hành động</th>
        </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
        {loading ? <tr><td colSpan="3" className="text-center py-8">Đang tải...</td></tr> : users.map(u => (
            <tr key={u.id} className="hover:bg-gray-50/50">
                <td className="px-8 py-4 font-bold text-sm text-gray-900">{u.username}</td>
                <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {u.status}
                        </span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-3">
                    <button onClick={() => onDetail(u)} className="text-gray-400 hover:text-green-600"><Eye size={18}/></button>
                    <button onClick={() => onEdit(u)} className="text-gray-400 hover:text-blue-600"><SquarePen size={18}/></button>
                    <button onClick={() => onToggle(u)} className="text-gray-400 hover:text-gray-900">
                        {u.status === 'ACTIVE' ? <Lock size={18}/> : <Unlock size={18}/>}
                    </button>
                </td>
            </tr>
        ))}
        </tbody>
    </table>
);
export default UserTable;