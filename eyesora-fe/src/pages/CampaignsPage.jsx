import { useState, useEffect } from 'react';
import axiosClient from "../axios/axiosClient";
import { Lock, Unlock, AlertTriangle, Trash2 } from "lucide-react";
import CampaignActions from "../components/CampaignActions";

const CampaignsPage = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [counts, setCounts] = useState({});
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [notification, setNotification] = useState(null);
    const [formData, setFormData] = useState({ campaignTitle: '', facilityYear: '' });

    useEffect(() => { fetchCampaigns(); }, []);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchCampaigns = async () => {
        try {
            const res = await axiosClient.get("/campaigns");
            setCampaigns(Array.isArray(res.data) ? res.data : []);
            res.data.forEach(c => fetchPatientCount(c.campaignId));
        } catch (error) { console.error("Error:", error); }
    };

    const fetchPatientCount = async (campaignId) => {
        try {
            const res = await axiosClient.get(`/campaigns/${campaignId}/patient-count`);
            setCounts(prev => ({ ...prev, [campaignId]: res.data.count }));
        } catch (error) { }
    };

    const handleCreate = async () => {
        try {
            await axiosClient.post("/campaigns", formData);
            showNotification("Campaign created successfully!", "success");
            setIsCreateOpen(false);
            setFormData({ campaignTitle: '', facilityYear: '' });
            fetchCampaigns();
        } catch (error) {
            showNotification("Failed to create campaign.", "error");
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
            setIsConfirmOpen(false);
        }
    };

    return (
        <div className="p-6 h-full overflow-y-auto">
            {notification && (
                <div className={`fixed top-5 right-5 z-[100] px-6 py-3 rounded-lg shadow-lg text-white font-bold animate-in slide-in-from-right-10 ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {notification.message}
                </div>
            )}

            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-950">Exam Campaigns</h2>
                    <p className="text-sm text-gray-600 font-medium">Manage and track all examination campaigns</p>
                </div>
                <CampaignActions
                    onAdd={() => setIsCreateOpen(true)}
                    onImport={() => alert("Import feature coming soon")}
                    onExport={() => alert("Download template feature coming soon")}
                />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/80">
                    <tr className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                        <th className="px-6 py-4">Title</th>
                        <th className="px-4 py-4">Patients</th>
                        <th className="px-4 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {campaigns.map((c) => (
                        <tr key={c.campaignId} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-gray-950 text-sm">{c.campaignTitle}</td>
                            <td className="px-4 py-4 text-sm text-gray-800 font-bold">{counts[c.campaignId] || 0}</td>
                            <td className="px-4 py-4">
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold text-white ${c.status === 'LOCKED' ? "bg-red-600" : "bg-emerald-600"}`}>
                                    {c.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                <button onClick={() => { setPendingAction({type:'status', id: c.campaignId, newStatus: c.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED'}); setIsConfirmOpen(true); }} className="text-blue-900 bg-blue-50 p-1.5 rounded-lg hover:bg-blue-100 transition-all border border-blue-200">
                                    {c.status === 'LOCKED' ? <Unlock size={16}/> : <Lock size={16}/>}
                                </button>
                                <button onClick={() => { setPendingAction({type:'delete', id: c.campaignId}); setIsConfirmOpen(true); }} className="text-red-600 bg-red-50 p-1.5 rounded-lg hover:bg-red-100 transition-all border border-red-200">
                                    <Trash2 size={16}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-950 mb-4">Create Campaign</h3>
                        <input className="w-full p-2.5 mb-3 border border-gray-300 rounded-lg text-sm text-gray-950 placeholder-gray-400 focus:border-blue-900 outline-none" placeholder="Title" onChange={(e) => setFormData({...formData, campaignTitle: e.target.value})} />
                        <input className="w-full p-2.5 mb-4 border border-gray-300 rounded-lg text-sm text-gray-950 placeholder-gray-400 focus:border-blue-900 outline-none" placeholder="Year" onChange={(e) => setFormData({...formData, facilityYear: e.target.value})} />
                        <div className="flex gap-2">
                            <button onClick={() => setIsCreateOpen(false)} className="flex-1 py-2 rounded-lg font-bold text-sm bg-gray-100 text-gray-800 hover:bg-gray-200">Cancel</button>
                            <button onClick={handleCreate} className="flex-1 py-2 rounded-lg font-bold text-sm bg-blue-900 text-white hover:bg-blue-800">Save</button>
                        </div>
                    </div>
                </div>
            )}

            {isConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl text-center border border-gray-100">
                        <AlertTriangle size={40} className="text-amber-500 mx-auto mb-3" />
                        <h3 className="font-bold text-gray-950 text-lg mb-2">Confirm Action</h3>
                        <p className="text-gray-700 text-sm mb-6 font-medium">Are you sure you want to {pendingAction?.type} this?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsConfirmOpen(false)} className="flex-1 py-2 rounded-lg font-bold text-sm bg-gray-100 text-gray-800 hover:bg-gray-200">Cancel</button>
                            <button onClick={executeAction} className="flex-1 py-2 rounded-lg font-bold text-sm bg-blue-900 text-white hover:bg-blue-800">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default CampaignsPage;