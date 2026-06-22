import { useState, useEffect } from 'react';
import axiosClient from "../axios/axiosClient";
import { Lock, Unlock, Trash2 } from "lucide-react";
import CampaignActions from "../components/CampaignActions";

const CampaignsPage = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [notification, setNotification] = useState(null);

    // THÊM: State để chứa lỗi cho từng field
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        title: '', year: '', startDate: '', managerName: '', orgId: '', targetId: ''
    });

    useEffect(() => {
        fetchCampaigns();
        fetchFacilities();
    }, []);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Hàm cập nhật form và validate tức thì
    const updateFormData = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        // Validate đơn giản: nếu để trống thì báo lỗi
        setErrors(prev => ({ ...prev, [key]: !value ? "Required" : "" }));
    };

    const fetchCampaigns = async () => {
        try {
            const res = await axiosClient.get("/campaigns");
            setCampaigns(Array.isArray(res.data) ? res.data : []);
        } catch (error) { console.error("Error fetching campaigns:", error); }
    };

    const fetchFacilities = async () => {
        try {
            const res = await axiosClient.get("/master-data/facilities");
            setFacilities(res.data.content || []);
        } catch (error) { console.error("Error facilities:", error); }
    };

    const handleCreate = async () => {
        // Validate trước khi gửi
        const newErrors = {};
        Object.keys(formData).forEach(key => { if(!formData[key]) newErrors[key] = "Required"; });
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            showNotification("Please fill all required fields", "error");
            return;
        }

        try {
            await axiosClient.post("/campaigns", formData);
            showNotification("Campaign created successfully!", "success");
            setIsCreateOpen(false);
            setFormData({ title: '', year: '', startDate: '', managerName: '', orgId: '', targetId: '' });
            fetchCampaigns();
        } catch (error) {
            const errMsg = error.response?.data?.message || "Server Error.";
            showNotification(errMsg, "error");
        }
    };

    const executeAction = async () => {
        try {
            if (pendingAction.type === 'delete') {
                await axiosClient.delete(`/campaigns/${pendingAction.id}`);
                showNotification("Campaign deleted successfully!", "success");
            } else {
                await axiosClient.patch(`/campaigns/${pendingAction.id}/status/${pendingAction.newStatus}`);
                showNotification(`Status updated to ${pendingAction.newStatus}!`, "success");
            }
            setIsConfirmOpen(false);
            fetchCampaigns();
        } catch (error) {
            showNotification("Action failed!", "error");
        }
    };

    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-50 text-gray-950">
            {notification && (
                <div className={`fixed top-5 right-5 z-[10000] px-6 py-4 rounded-xl shadow-2xl text-white font-bold ${notification.type === 'success' ? 'bg-green-700' : 'bg-red-700'}`}>
                    {notification.message}
                </div>
            )}

            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black">Examination Campaigns</h2>
                    <p className="text-sm text-gray-600 font-semibold mt-1">Manage and track all examination campaigns</p>
                </div>
                <CampaignActions onAdd={() => setIsCreateOpen(true)} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100">
                    <tr className="text-[11px] font-black text-gray-600 uppercase tracking-widest">
                        <th className="px-6 py-4">Title</th>
                        <th className="px-4 py-4">Year</th>
                        <th className="px-4 py-4">Manager</th>
                        <th className="px-4 py-4">Organization</th>
                        <th className="px-4 py-4">Target</th>
                        <th className="px-4 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {campaigns.map((c) => (
                        <tr key={c.campaignId} className="hover:bg-gray-50 transition-colors text-sm">
                            <td className="px-6 py-4 font-bold">{c.campaignTitle}</td>
                            <td className="px-4 py-4">{c.facilityYear}</td>
                            <td className="px-4 py-4">{c.managerName}</td>
                            <td className="px-4 py-4">{c.organizationName || 'N/A'}</td>
                            <td className="px-4 py-4">{c.targetFacilityName || 'N/A'}</td>
                            <td className="px-4 py-4">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${c.status === 'LOCKED' ? "bg-red-600 text-white" : "bg-emerald-600 text-white"}`}>
                                    {c.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                <button onClick={() => { setPendingAction({type:'status', id: c.campaignId, newStatus: c.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED'}); setIsConfirmOpen(true); }} className="p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100">
                                    {c.status === 'LOCKED' ? <Unlock size={18}/> : <Lock size={18}/>}
                                </button>
                                <button onClick={() => { setPendingAction({type:'delete', id: c.campaignId}); setIsConfirmOpen(true); }} className="p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-red-100 text-red-600">
                                    <Trash2 size={18}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Create */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
                        <h2 className="text-xl font-black mb-6">Create New Campaign</h2>
                        {['title', 'year', 'managerName'].map(key => (
                            <div key={key}>
                                <input className={`w-full p-3 border-2 rounded-xl ${errors[key] ? 'border-red-500' : 'border-gray-200'}`} placeholder={key.toUpperCase()} onChange={(e) => updateFormData(key, e.target.value)} />
                                {errors[key] && <p className="text-red-600 text-[10px] font-bold mt-1">{errors[key]}</p>}
                            </div>
                        ))}
                        <input type="date" className="w-full p-3 border-2 border-gray-200 rounded-xl" onChange={(e) => updateFormData('startDate', e.target.value)} />

                        <select className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white" onChange={(e) => updateFormData('orgId', e.target.value)}>
                            <option value="">Select Organization</option>
                            {facilities.filter(f => f.facilityType !== 'SCHOOL').map(f => <option key={f.id} value={f.id}>{f.facilityName}</option>)}
                        </select>

                        <select className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white" onChange={(e) => updateFormData('targetId', e.target.value)}>
                            <option value="">Select Target School</option>
                            {facilities.filter(f => f.facilityType === 'SCHOOL').map(f => <option key={f.id} value={f.id}>{f.facilityName}</option>)}
                        </select>

                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setIsCreateOpen(false)} className="flex-1 py-3 bg-gray-200 rounded-xl font-bold">Cancel</button>
                            <button onClick={handleCreate} className="flex-1 py-3 bg-blue-950 text-white rounded-xl font-bold">Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Confirm (Giữ nguyên cũ của bạn) */}
            {isConfirmOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
                        <h3 className="font-bold text-lg">Confirm Action</h3>
                        <p className="text-gray-600 text-sm mt-2">Are you sure you want to perform this action?</p>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setIsConfirmOpen(false)} className="flex-1 py-2 bg-gray-200 rounded-lg">No</button>
                            <button onClick={executeAction} className="flex-1 py-2 bg-red-600 text-white rounded-lg">Yes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default CampaignsPage;