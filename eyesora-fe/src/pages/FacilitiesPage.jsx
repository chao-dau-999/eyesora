import { useState, useEffect } from 'react';
import axiosClient from "../axios/axiosClient";
import { SquarePen, Building2 } from "lucide-react";
import FacilityActions from "../components/FacilityActions";

const FacilitiesPage = () => {
    const [facilities, setFacilities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    // THÊM: State để lưu ID bản ghi đang sửa
    const [editingId, setEditingId] = useState(null);
    // THÊM: State để chứa lỗi validate
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        facilityName: '',
        facilityType: 'CLINIC',
        address: '',
        phone: '',
        wardId: '',
        districtId: ''
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [fRes, dRes] = await Promise.all([
                axiosClient.get("/master-data/facilities"),
                axiosClient.get("/master-data/districts?size=100")
            ]);
            setFacilities(fRes.data.content || []);
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

    // THÊM: Hàm chuẩn bị dữ liệu khi nhấn nút sửa
    const handleEdit = (f) => {
        setEditingId(f.id);
        setErrors({}); // Reset lỗi
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
        if (!formData.facilityName) newErrors.facilityName = "Required";
        if (!formData.phone || !/^[0-9]{10,11}$/.test(formData.phone)) newErrors.phone = "Phone must be 10-11 digits";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return; // Kiểm tra lỗi trước khi lưu

        try {
            if (editingId) {
                // UPDATE: PUT
                await axiosClient.put(`/master-data/facilities/${editingId}`, formData);
                alert("Facility updated successfully!");
            } else {
                // CREATE: POST
                await axiosClient.post("/master-data/facilities", formData);
                alert("Facility created successfully!");
            }
            setIsCreateOpen(false);
            setEditingId(null);
            setFormData({ facilityName: '', facilityType: 'CLINIC', address: '', phone: '', wardId: '', districtId: '' });
            fetchData();
        } catch (error) {
            alert("Error: " + (error.response?.data?.message || "Operation failed"));
        }
    };

    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-50 text-gray-900">
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-950 flex items-center gap-3">
                        <Building2 className="text-blue-900" size={32} /> Facilities Management
                    </h2>
                </div>
                {/* Sửa: Reset editingId khi nhấn nút thêm mới */}
                <FacilityActions onAdd={() => { setEditingId(null); setErrors({}); setIsCreateOpen(true); }} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-700">
                    <tr className="text-xs font-black uppercase tracking-widest">
                        <th className="px-8 py-5">Facility Name</th>
                        <th className="px-8 py-5">Type</th>
                        <th className="px-8 py-5">Address</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                    {loading ? <tr><td colSpan="4" className="px-8 py-10 text-center font-bold">Loading...</td></tr> :
                        facilities.map(f => (
                            <tr key={f.id} className="hover:bg-blue-50/50 transition-all">
                                <td className="px-8 py-5 font-bold text-gray-950">{f.facilityName}</td>
                                <td className="px-8 py-5 font-semibold text-blue-700">{f.facilityType}</td>
                                <td className="px-8 py-5 text-gray-600">{f.address}</td>
                                <td className="px-8 py-5 text-right">
                                    <button onClick={() => handleEdit(f)} className="text-gray-400 hover:text-blue-950 transition-colors">
                                        <SquarePen size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isCreateOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 space-y-4">
                        <h2 className="text-2xl font-black mb-6">{editingId ? "Edit Facility" : "Add New Facility"}</h2>

                        <input className={`w-full p-4 border-2 rounded-xl ${errors.facilityName ? 'border-red-500' : ''}`} placeholder="Facility Name" value={formData.facilityName} onChange={e => setFormData({...formData, facilityName: e.target.value})} />
                        {errors.facilityName && <p className="text-red-500 text-xs font-bold">{errors.facilityName}</p>}

                        <select className="w-full p-4 border-2 rounded-xl" value={formData.facilityType} onChange={e => setFormData({...formData, facilityType: e.target.value})}>
                            <option value="CLINIC">Clinic</option><option value="HOSPITAL">Hospital</option><option value="SCHOOL">School</option>
                        </select>
                        <select className="w-full p-4 border-2 rounded-xl" value={formData.districtId} onChange={e => {
                            const dId = e.target.value;
                            setFormData({...formData, districtId: dId, wardId: ''});
                            fetchWardsByDistrict(dId);
                        }}>
                            <option value="">Select District</option>
                            {districts.map(d => <option key={d.id} value={d.id}>{d.districtName}</option>)}
                        </select>
                        <select className="w-full p-4 border-2 rounded-xl" value={formData.wardId} disabled={!formData.districtId} onChange={e => setFormData({...formData, wardId: e.target.value})}>
                            <option value="">Select Ward</option>
                            {wards.map(w => <option key={w.id} value={w.id}>{w.wardName}</option>)}
                        </select>
                        <input className="w-full p-4 border-2 rounded-xl" placeholder="Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                        <input className={`w-full p-4 border-2 rounded-xl ${errors.phone ? 'border-red-500' : ''}`} placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        {errors.phone && <p className="text-red-500 text-xs font-bold">{errors.phone}</p>}

                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setIsCreateOpen(false)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black">Cancel</button>
                            <button onClick={handleSave} className="flex-1 py-4 bg-blue-950 text-white rounded-2xl font-black">{editingId ? "Update" : "Save"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default FacilitiesPage;