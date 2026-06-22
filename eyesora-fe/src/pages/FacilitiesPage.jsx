import { useState, useEffect } from 'react';
import axiosClient from "../axios/axiosClient";
import { Building2, ChevronLeft, ChevronRight, X, SquarePen } from "lucide-react";
import FacilityActions from "../components/FacilityActions";

const FacilitiesPage = () => {
    const [facilities, setFacilities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});
    const [pageData, setPageData] = useState({ page: 0, totalPages: 0, totalElements: 0 });

    const [formData, setFormData] = useState({
        facilityName: '', facilityType: 'CLINIC', address: '', phone: '', wardId: '', districtId: ''
    });

    const fetchData = async (page = 0) => {
        setLoading(true);
        try {
            const [fRes, dRes] = await Promise.all([
                axiosClient.get(`/master-data/facilities?page=${page}&size=10`),
                axiosClient.get("/master-data/districts?size=100")
            ]);
            setFacilities(fRes.data.content || []);
            setPageData({
                page: fRes.data.number,
                totalPages: fRes.data.totalPages,
                totalElements: fRes.data.totalElements
            });
            setDistricts(dRes.data.content || []);
        } catch (error) { console.error("Error fetching data:", error); }
        finally { setLoading(false); }
    };

    const fetchWardsByDistrict = async (dId) => {
        if (!dId) { setWards([]); return; }
        try {
            const res = await axiosClient.get(`/master-data/wards?districtId=${dId}&size=100`);
            setWards(res.data.content || []);
        } catch (error) { console.error("Error fetching wards:", error); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleEdit = (f) => {
        setEditingId(f.id);
        setErrors({});
        setFormData({
            facilityName: f.facilityName,
            facilityType: f.facilityType,
            address: f.address,
            phone: f.phone,
            wardId: f.wardId,
            districtId: f.districtId
        });
        fetchWardsByDistrict(f.districtId);
        setIsCreateOpen(true);
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.facilityName.trim()) newErrors.facilityName = "Facility name is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.phone || !/^[0-9]{10,11}$/.test(formData.phone)) newErrors.phone = "Phone must be 10-11 digits";
        if (!formData.districtId) newErrors.districtId = "District is required";
        if (!formData.wardId) newErrors.wardId = "Ward is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        try {
            if (editingId) await axiosClient.put(`/master-data/facilities/${editingId}`, formData);
            else await axiosClient.post("/master-data/facilities", formData);

            setIsCreateOpen(false);
            setEditingId(null);
            setFormData({ facilityName: '', facilityType: 'CLINIC', address: '', phone: '', wardId: '', districtId: '' });
            fetchData(pageData.page);
        } catch (error) { alert("Error saving data"); }
    };

    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-50 text-gray-950">
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black flex items-center gap-3">
                        <Building2 className="text-blue-900" size={32} /> Facilities Management
                    </h2>
                    <p className="text-gray-500 font-semibold mt-1">Total: {pageData.totalElements} records</p>
                </div>
                <FacilityActions onAdd={() => { setEditingId(null); setErrors({}); setIsCreateOpen(true); }} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[11px] font-black uppercase text-gray-500 tracking-widest">
                    <tr>
                        <th className="px-8 py-5">STT</th>
                        <th className="px-8 py-5">Facility Name</th>
                        <th className="px-8 py-5">Type</th>
                        <th className="px-8 py-5">Address</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {facilities.map((f, index) => (
                        <tr key={f.id} className="hover:bg-blue-50/50 transition-all text-sm">
                            <td className="px-8 py-5 font-bold text-gray-500">{(pageData.page * 10) + index + 1}</td>
                            <td className="px-8 py-5 font-bold">{f.facilityName}</td>
                            <td className="px-8 py-5 font-semibold text-blue-700">{f.facilityType}</td>
                            <td className="px-8 py-5 text-gray-600">{f.address}</td>
                            <td className="px-8 py-5 text-right">
                                <button onClick={() => handleEdit(f)} className="text-blue-900 hover:text-blue-700"><SquarePen size={20} /></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Thanh phân trang thông minh */}
                <div className="flex items-center justify-between px-6 py-5 bg-white border-t border-gray-100">
                    <div className="text-sm font-semibold text-gray-500">Trang <span className="text-blue-900 font-bold">{pageData.page + 1}</span> / {pageData.totalPages || 1}</div>
                    <div className="flex items-center gap-1.5">
                        <button disabled={pageData.page === 0} onClick={() => fetchData(pageData.page - 1)} className="flex items-center justify-center w-9 h-9 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-all"><ChevronLeft size={18} className="text-gray-700"/></button>
                        {[...Array(pageData.totalPages)].map((_, i) => {
                            if (i === 0 || i === pageData.totalPages - 1 || (i >= pageData.page - 1 && i <= pageData.page + 1)) return (
                                <button key={i} onClick={() => fetchData(i)} className={`w-9 h-9 rounded-lg font-bold text-sm transition-all shadow-sm ${pageData.page === i ? 'bg-blue-900 text-white shadow-blue-200' : 'bg-white border border-gray-200 text-gray-600 hover:bg-blue-50'}`}>{i + 1}</button>
                            );
                            if (i === pageData.page - 2 || i === pageData.page + 2) return <span key={i} className="px-2 text-gray-400 font-bold tracking-widest">...</span>;
                            return null;
                        })}
                        <button disabled={pageData.page >= pageData.totalPages - 1} onClick={() => fetchData(pageData.page + 1)} className="flex items-center justify-center w-9 h-9 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-all"><ChevronRight size={18} className="text-gray-700"/></button>
                    </div>
                </div>
            </div>

            {isCreateOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black">{editingId ? "Edit Facility" : "Add Facility"}</h2>
                            <button onClick={() => setIsCreateOpen(false)}><X /></button>
                        </div>
                        <div className="space-y-4">
                            {[ {key:'facilityName', label:'Facility Name'}, {key:'address', label:'Address'}, {key:'phone', label:'Phone'} ].map(f => (
                                <div key={f.key}>
                                    <label className="block text-[10px] font-black uppercase mb-1 ml-1">{f.label}</label>
                                    <input className={`w-full p-3 border-2 rounded-xl text-gray-950 ${errors[f.key] ? 'border-red-500' : 'border-gray-200'}`} placeholder={f.label} value={formData[f.key]} onChange={e => { setFormData({...formData, [f.key]: e.target.value}); if(errors[f.key]) setErrors({...errors, [f.key]: null}) }} />
                                    {errors[f.key] && <p className="text-red-600 text-[10px] font-bold mt-1 ml-1">{errors[f.key]}</p>}
                                </div>
                            ))}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase mb-1 ml-1">District</label>
                                    <select className={`w-full p-3 border-2 rounded-xl bg-white ${errors.districtId ? 'border-red-500' : 'border-gray-200'}`} value={formData.districtId} onChange={e => { const dId = e.target.value; setFormData({...formData, districtId: dId, wardId: ''}); fetchWardsByDistrict(dId); if(errors.districtId) setErrors({...errors, districtId: null}) }}>
                                        <option value="">Select District</option>
                                        {districts.map(d => <option key={d.id} value={d.id}>{d.districtName}</option>)}
                                    </select>
                                    {errors.districtId && <p className="text-red-600 text-[10px] font-bold mt-1 ml-1">{errors.districtId}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase mb-1 ml-1">Ward</label>
                                    <select className={`w-full p-3 border-2 rounded-xl bg-white ${errors.wardId ? 'border-red-500' : 'border-gray-200'}`} value={formData.wardId} disabled={!formData.districtId} onChange={e => { setFormData({...formData, wardId: e.target.value}); if(errors.wardId) setErrors({...errors, wardId: null}) }}>
                                        <option value="">Select Ward</option>
                                        {wards.map(w => <option key={w.id} value={w.id}>{w.wardName}</option>)}
                                    </select>
                                    {errors.wardId && <p className="text-red-600 text-[10px] font-bold mt-1 ml-1">{errors.wardId}</p>}
                                </div>
                            </div>
                        </div>
                        <button onClick={handleSave} className="w-full mt-8 py-4 bg-blue-950 text-white rounded-2xl font-black">{editingId ? "Update" : "Save"}</button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default FacilitiesPage;