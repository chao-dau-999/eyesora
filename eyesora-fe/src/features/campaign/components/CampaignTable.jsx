import { Eye, Lock, Unlock, Trash2 } from "lucide-react";

const CampaignTable = ({ campaigns, onOpenDetail, onToggleStatus, onDelete }) => (
    <div className="w-full overflow-x-auto">
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <tr>
                <th className="px-6 py-4">Tên chiến dịch</th>
                <th className="px-4 py-4">Năm</th>
                <th className="px-4 py-4">Người quản lý</th>
                <th className="px-4 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
            {campaigns.length > 0 ? (
                campaigns.map((c) => (
                    <tr key={c.campaignId} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4 font-bold text-gray-900">{c.campaignTitle}</td>
                        <td className="px-4 py-4 text-gray-600 font-medium">{c.facilityYear}</td>
                        <td className="px-4 py-4 text-gray-600 font-medium">{c.managerName}</td>
                        <td className="px-4 py-4">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${c.status === 'LOCKED' ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                                    {c.status}
                                </span>
                        </td>
                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                            <button onClick={() => onOpenDetail(c)} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-blue-900 transition-all shadow-sm">
                                <Eye size={16}/>
                            </button>
                            <button onClick={() => onToggleStatus(c)} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-900 transition-all shadow-sm">
                                {c.status === 'LOCKED' ? <Unlock size={16}/> : <Lock size={16}/>}
                            </button>
                            <button onClick={() => onDelete(c.campaignId)} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-red-600 transition-all shadow-sm">
                                <Trash2 size={16}/>
                            </button>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-medium italic">
                        Chưa có chiến dịch nào được tạo.
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    </div>
);

export default CampaignTable;