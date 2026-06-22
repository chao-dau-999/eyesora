import { useState, useEffect } from 'react';
import axiosClient from "../axios/axiosClient";
import { SquarePen, Trash, Building2 } from "lucide-react";
import FacilityActions from "../components/FacilityActions";

const FacilitiesPage = () => {
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFacilities = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get("/master-data/facilities");
            setFacilities(res.data.content || []);
        } catch (error) {
            console.error("Error fetching facilities:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchFacilities(); }, []);

    return (
        <div className="p-6 h-full overflow-y-auto">
            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Building2 className="text-blue-900" /> Facility Management
                    </h2>
                    <p className="text-sm text-gray-500">Overview of campus facilities and locations</p>
                </div>

                <FacilityActions
                    onAdd={() => alert("Chức năng thêm cơ sở đang phát triển")}
                    onImport={() => alert("Import feature coming soon")}
                    onExport={() => alert("Download template feature coming soon")}
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/80">
                    <tr className="text-gray-600 text-xs font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Facility Name</th>
                        <th className="px-6 py-4">Address</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {loading ? (
                        <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-500">Loading facilities...</td></tr>
                    ) : facilities.length > 0 ? (
                        facilities.map(f => (
                            <tr key={f.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900 text-sm">{f.facilityName}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{f.address}</td>
                                <td className="px-6 py-4 text-right flex justify-end gap-3">
                                    <button className="text-gray-400 hover:text-blue-900 transition-colors">
                                        <SquarePen size={18} />
                                    </button>
                                    <button className="text-gray-400 hover:text-red-600 transition-colors">
                                        <Trash size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-500 italic">No facilities found.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FacilitiesPage;