import { Eye, Lock, Unlock, Trash2, Edit2 } from "lucide-react";

const CampaignTable = ({ campaigns, onOpenDetail, onToggleStatus, onDelete, onEdit }) => {

    const getStatusLabel = (status) => {
        return status === 'LOCKED' ? "Đã khóa" : "Hoạt động";
    };

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/30 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                    <th className="px-6 py-4 font-bold">Tên chiến dịch</th>
                    <th className="px-4 py-4 font-bold">Thời gian</th>
                    <th className="px-4 py-4 font-bold">Người quản lý</th>
                    <th className="px-4 py-4 font-bold">Trạng thái</th>
                    <th className="px-6 py-4 font-bold text-right">Hành động</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {campaigns.length > 0 ? (
                    campaigns.map((c) => (
                        <tr key={c.campaignId} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-gray-900">{c.campaignTitle}</td>
                            <td className="px-4 py-4 text-gray-600 text-xs">
                                {c.startDate} <br /> đến {c.endDate}
                            </td>
                            <td className="px-4 py-4 text-gray-700">{c.managerName}</td>
                            <td className="px-4 py-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                        c.status === 'LOCKED'
                                            ? "bg-red-50 text-red-700 border-red-200"
                                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    }`}>
                                        {getStatusLabel(c.status)}
                                    </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-3">
                                    <button onClick={() => onOpenDetail(c)} className="text-gray-500 hover:text-blue-900 transition-colors"><Eye size={20}/></button>
                                    <button onClick={() => onEdit(c.campaignId)} className="text-blue-600 hover:text-blue-800 transition-colors"><Edit2 size={18}/></button>
                                    <button onClick={() => onToggleStatus(c)} className="text-gray-500 hover:text-gray-900 transition-colors">
                                        {c.status === 'LOCKED' ? <Unlock size={18}/> : <Lock size={18}/>}
                                    </button>
                                    <button onClick={() => onDelete(c.campaignId)} className="text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={20}/></button>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic">
                            Chưa có chiến dịch nào được tạo.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default CampaignTable;