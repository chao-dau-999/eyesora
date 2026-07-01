import { Eye, SquarePen } from "lucide-react";

const FacilityTable = ({ facilities, page, onEdit, onView }) => {

    const getFacilityTypeConfig = (type) => {
        const typeLower = type?.toLowerCase();

        const configs = {
            school: { label: 'Trường học', style: 'bg-purple-100 text-purple-800 border-purple-200' },
            hospital: { label: 'Bệnh viện', style: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
            clinic: { label: 'Phòng khám', style: 'bg-amber-100 text-amber-800 border-amber-200' },
        };

        return configs[typeLower] || { label: type || 'N/A', style: 'bg-gray-100 text-gray-800 border-gray-200' };
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-gray-50/30 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3 font-bold w-12">STT</th>
                    <th className="px-4 py-3 font-bold">Tên cơ sở</th>
                    <th className="px-4 py-3 font-bold">Loại hình</th>
                    <th className="px-6 py-3 font-bold text-right">Hành động</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {facilities.map((f, index) => {
                    const config = getFacilityTypeConfig(f.facilityType);
                    return (
                        <tr key={f.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-500">{(page * 10) + index + 1}</td>
                            <td className="px-4 py-4 font-semibold text-gray-900">{f.facilityName}</td>
                            <td className="px-4 py-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${config.style}`}>
                                        {config.label}
                                    </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        onClick={() => onView(f.id)}
                                        className="text-gray-500 hover:text-blue-900 transition-colors"
                                    >
                                        <Eye size={20} />
                                    </button>
                                    <button
                                        onClick={() => onEdit(f.id)}
                                        className="text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        <SquarePen size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default FacilityTable;