import { Eye, Lock, Unlock, Trash2 } from "lucide-react";

const CampaignTable = ({ campaigns, onOpenDetail, onToggleStatus, onDelete }) => (
    <table className="w-full text-left">
        <thead className="bg-gray-100 text-[12px] font-black text-gray-800 uppercase tracking-wider">
        <tr>
            <th className="px-6 py-4">Title</th>
            <th className="px-4 py-4">Year</th>
            <th className="px-4 py-4">Manager</th>
            <th className="px-4 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
        </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
        {campaigns.map((c) => (
            <tr key={c.campaignId} className="hover:bg-gray-50 text-sm">
                <td className="px-6 py-4 font-semibold text-gray-900">{c.campaignTitle}</td>
                <td className="px-4 py-4 text-gray-800 font-medium">{c.facilityYear}</td>
                <td className="px-4 py-4 text-gray-800 font-medium">{c.managerName}</td>
                <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${c.status === 'LOCKED' ? "bg-red-600" : "bg-emerald-600"} text-white`}>
                            {c.status}
                        </span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button onClick={() => onOpenDetail(c)} className="p-2 bg-gray-100 rounded-lg border hover:bg-gray-200 text-gray-700"><Eye size={18}/></button>
                    <button onClick={() => onToggleStatus(c)} className="p-2 bg-gray-100 rounded-lg border hover:bg-gray-200 text-gray-700">{c.status === 'LOCKED' ? <Unlock size={18}/> : <Lock size={18}/>}</button>
                    <button onClick={() => onDelete(c.campaignId)} className="p-2 bg-gray-100 rounded-lg border hover:bg-gray-200 text-red-600"><Trash2 size={18}/></button>
                </td>
            </tr>
        ))}
        </tbody>
    </table>
);
export default CampaignTable;