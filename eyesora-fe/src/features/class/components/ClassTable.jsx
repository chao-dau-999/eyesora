import {Trash, SquarePen, Users} from "lucide-react";

const ClassTable = ({classes, loading, page, onOpenDetail, onEdit}) => (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase font-black text-gray-500">
            <tr>
                <th className="p-6 w-16">STT</th>
                <th className="p-6">Class Name</th>
                <th className="p-6">Grade</th>
                <th className="p-6">Facility</th>
                <th className="p-6">School Year</th>
                <th className="p-6 text-right">Actions</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
            {loading ? <tr>
                    <td colSpan="7" className="text-center py-10 font-bold text-gray-500">Loading...</td>
                </tr> :
                classes.map((cls, index) => (
                    <tr key={cls.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="p-6 text-gray-500 font-bold text-sm">{(page * 10) + index + 1}</td>
                        <td className="p-6 font-bold text-gray-900 text-sm">{cls.className}</td>
                        <td className="p-6 text-gray-600 text-sm">{cls.grade}</td>
                        <td className="p-6 text-sm text-gray-600">{cls.facilityName || 'N/A'}</td>
                        <td className="p-6 text-sm text-gray-600">{cls.schoolYear}</td>
                        <td className="p-6 text-right flex justify-end gap-3">
                            <button onClick={() => onOpenDetail(cls)} className="text-green-600"><Users size={20}/>
                            </button>
                            <button onClick={() => onEdit(cls)} className="text-blue-900"><SquarePen size={20}/>
                            </button>
                            <button className="text-red-600"><Trash size={20}/></button>
                        </td>
                    </tr>
                ))
            }
            </tbody>
        </table>
    </div>
);
export default ClassTable;