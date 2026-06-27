import { useState, useEffect } from 'react';
import axiosClient from "../../../shared/axios/axiosClient.js";
import { SquarePen, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import AddressActions from "../../../shared/components/AddressActions.jsx";

const DistrictsPage = () => {
    const [districts, setDistricts] = useState([]);
    const [pageData, setPageData] = useState({ page: 0, totalPages: 0, totalElements: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ districtName: '' });
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});

    const fetchDistricts = async (page = 0) => {
        const res = await axiosClient.get(`/master-data/districts?page=${page}&size=10`);
        setDistricts(res.data.content || []);
        setPageData({ page: res.data.number, totalPages: res.data.totalPages, totalElements: res.data.totalElements });
    };

    useEffect(() => { fetchDistricts(); }, []);

    const validate = () => {
        let tempErrors = {};
        if (!formData.districtName.trim()) tempErrors.districtName = "District name is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        try {
            if (editingId) await axiosClient.put(`/master-data/districts/${editingId}`, formData);
            else await axiosClient.post("/master-data/districts", formData);
            setIsModalOpen(false);
            fetchDistricts(pageData.page);
        } catch (error) {
            alert("Error saving district data");
        }
    };

    return (
        <div className="p-6 bg-[#f5f7fa] h-full overflow-y-auto scrollbar-thin">
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <MapPin/> Districts</h2>
                    <p className="text-gray-500 text-sm mt-1">Total: {pageData.totalElements} districts</p>
                </div>
                <AddressActions onAdd={() => { setEditingId(null); setFormData({ districtName: '' }); setErrors({}); setIsModalOpen(true); }} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs uppercase font-black text-gray-500">
                    <tr><th className="p-6 w-16">STT</th><th className="p-6">District Name</th><th className="p-6 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {districts.map((d, index) => (
                        <tr key={d.id} className="hover:bg-blue-50/50 transition-colors">
                            <td className="p-6 text-gray-500 font-bold text-sm">{(pageData.page * 10) + index + 1}</td>
                            <td className="p-6 font-bold text-gray-900 text-sm">{d.districtName}</td>
                            <td className="p-6 text-right">
                                <button onClick={() => { setEditingId(d.id); setFormData(d); setErrors({}); setIsModalOpen(true); }} className="text-blue-900 hover:text-blue-700 transition-colors"><SquarePen size={20}/></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="flex items-center justify-between px-6 py-5 bg-white border-t border-gray-100">
                    <div className="text-sm font-semibold text-gray-500">Trang <span className="text-blue-900 font-bold">{pageData.page + 1}</span> / {pageData.totalPages || 1}</div>
                    <div className="flex items-center gap-1.5">
                        <button disabled={pageData.page === 0} onClick={() => fetchDistricts(pageData.page - 1)} className="flex items-center justify-center w-9 h-9 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-all"><ChevronLeft size={18} className="text-gray-700"/></button>
                        {[...Array(pageData.totalPages)].map((_, i) => {
                            if (i === 0 || i === pageData.totalPages - 1 || (i >= pageData.page - 1 && i <= pageData.page + 1)) return (
                                <button key={i} onClick={() => fetchDistricts(i)} className={`w-9 h-9 rounded-lg font-bold text-sm transition-all shadow-sm ${pageData.page === i ? 'bg-blue-900 text-white shadow-blue-200' : 'bg-white border border-gray-200 text-gray-600 hover:bg-blue-50'}`}>{i + 1}</button>
                            );
                            if (i === pageData.page - 2 || i === pageData.page + 2) return <span key={i} className="px-2 text-gray-400 font-bold tracking-widest">...</span>;
                            return null;
                        })}
                        <button disabled={pageData.page >= pageData.totalPages - 1} onClick={() => fetchDistricts(pageData.page + 1)} className="flex items-center justify-center w-9 h-9 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-all"><ChevronRight size={18} className="text-gray-700"/></button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-2xl">
                        <h2 className="text-xl font-black text-gray-950 mb-5">{editingId ? "Edit District" : "Add District"}</h2>

                        <div className="space-y-1 mb-6">
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">District Name</label>
                            <input
                                className={`w-full p-3 bg-gray-50 border ${errors.districtName ? 'border-red-500' : 'border-gray-200'} rounded-xl font-bold text-gray-950 focus:border-blue-900 outline-none transition-all`}
                                placeholder="Enter name"
                                value={formData.districtName}
                                onChange={e => {
                                    setFormData({districtName: e.target.value});
                                    if(errors.districtName) setErrors({...errors, districtName: null});
                                }}
                            />
                            {errors.districtName && <p className="text-red-500 text-[10px] font-bold">{errors.districtName}</p>}
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all">Cancel</button>
                            <button onClick={handleSave} className="flex-1 py-2.5 bg-blue-900 text-white rounded-xl font-bold text-sm hover:bg-blue-800 transition-all">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default DistrictsPage;