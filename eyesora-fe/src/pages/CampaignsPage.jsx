import { useState, useEffect } from 'react';
import axiosClient from "../axios/axiosClient";
import { Lock, Unlock, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";
import CampaignActions from "../components/CampaignActions";

const CampaignsPage = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [pageData, setPageData] = useState({ page: 0, totalPages: 0, totalElements: 0 });
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [notification, setNotification] = useState(null);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        title: '', year: '', startDate: '', managerName: '', orgId: '', targetId: ''
    });

    useEffect(() => {
        fetchCampaigns(0);
        fetchFacilities();
    }, []);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchCampaigns = async (page = 0) => {
        try {
            const res = await axiosClient.get(`/campaigns?page=${page}&size=10`);
            setCampaigns(res.data.content || []);
            setPageData({ page: res.data.number, totalPages: res.data.totalPages, totalElements: res.data.totalElements });
        } catch (error) { console.error("Error fetching campaigns:", error); }
    };

    const fetchFacilities = async () => {
        try {
            const res = await axiosClient.get("/master-data/facilities?size=100");
            setFacilities(res.data.content || []);
        } catch (error) { console.error("Error facilities:", error); }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.year.trim()) newErrors.year = "Year is required";
        if (!formData.startDate) newErrors.startDate = "Start date is required";
        if (!formData.managerName.trim()) newErrors.managerName = "Manager name is required";
        if (!formData.orgId) newErrors.orgId = "Organization is required";
        if (!formData.targetId) newErrors.targetId = "Target school is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreate = async () => {
        if (!validate()) return;
        try {
            await axiosClient.post("/campaigns", formData);
            showNotification("Campaign created successfully!");
            setIsCreateOpen(false);
            setFormData({ title: '', year: '', startDate: '', managerName: '', orgId: '', targetId: '' });
            fetchCampaigns(0);
        } catch (error) { showNotification(error.response?.data?.message || "Server Error.", "error"); }
    };

    const executeAction = async () => {
        try {
            if (pendingAction.type === 'delete') {
                await axiosClient.delete(`/campaigns/${pendingAction.id}`);
            } else {
                await axiosClient.patch(`/campaigns/${pendingAction.id}/status/${pendingAction.newStatus}`);
            }
            setIsConfirmOpen(false);
            fetchCampaigns(pageData.page);
        } catch (error) { showNotification("Action failed!", "error"); }
    };

    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-50 text-gray-950">
            {notification && (
                <div className={`fixed top-5 right-5 z-[10000] px-6 py-4 rounded-xl shadow-2xl text-white font-bold ${notification.type === 'success' ? 'bg-green-700' : 'bg-red-700'}`}>
                    {notification.message}
                </div>
            )}

            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black">Examination Campaigns</h2>
                    <p className="text-sm text-gray-600 font-semibold mt-1">Total: {pageData.totalElements} campaigns</p>
                </div>
                <CampaignActions onAdd={() => { setErrors({}); setIsCreateOpen(true); }} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[11px] font-black text-gray-500 uppercase tracking-widest">
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
                            <td className="px-6 py-4 font-bold">{c.campaignTitle}</td>
                            <td className="px-4 py-4">{c.facilityYear}</td>
                            <td className="px-4 py-4">{c.managerName}</td>
                            <td className="px-4 py-4">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${c.status === 'LOCKED' ? "bg-red-600" : "bg-emerald-600"} text-white`}>
                                        {c.status}
                                    </span>
                            </td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                <button onClick={() => { setPendingAction({type:'status', id: c.campaignId, newStatus: c.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED'}); setIsConfirmOpen(true); }} className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-100">
                                    {c.status === 'LOCKED' ? <Unlock size={18}/> : <Lock size={18}/>}
                                </button>
                                <button onClick={() => { setPendingAction({type:'delete', id: c.campaignId}); setIsConfirmOpen(true); }} className="p-2 bg-white rounded-lg border border-gray-200 text-red-600 hover:bg-gray-100">
                                    <Trash2 size={18}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="flex items-center justify-between px-6 py-5 bg-white border-t border-gray-100">
                    <div className="text-sm font-semibold text-gray-500">Trang <span className="text-blue-900 font-bold">{pageData.page + 1}</span> / {pageData.totalPages || 1}</div>
                    <div className="flex items-center gap-1.5">
                        <button disabled={pageData.page === 0} onClick={() => fetchCampaigns(pageData.page - 1)} className="flex items-center justify-center w-9 h-9 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-all"><ChevronLeft size={18} className="text-gray-700"/></button>
                        {[...Array(pageData.totalPages)].map((_, i) => {
                            if (i === 0 || i === pageData.totalPages - 1 || (i >= pageData.page - 1 && i <= pageData.page + 1)) return (
                                <button key={i} onClick={() => fetchCampaigns(i)} className={`w-9 h-9 rounded-lg font-bold text-sm transition-all shadow-sm ${pageData.page === i ? 'bg-blue-900 text-white shadow-blue-200' : 'bg-white border border-gray-200 text-gray-600 hover:bg-blue-50'}`}>{i + 1}</button>
                            );
                            if (i === pageData.page - 2 || i === pageData.page + 2) return <span key={i} className="px-2 text-gray-400 font-bold tracking-widest">...</span>;
                            return null;
                        })}
                        <button disabled={pageData.page >= pageData.totalPages - 1} onClick={() => fetchCampaigns(pageData.page + 1)} className="flex items-center justify-center w-9 h-9 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-all"><ChevronRight size={18} className="text-gray-700"/></button>
                    </div>
                </div>
            </div>

            {isCreateOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black">Create New Campaign</h2>
                            <button onClick={() => setIsCreateOpen(false)}><X/></button>
                        </div>
                        <div className="space-y-4">
                            {[ {key:'title', label:'Title'}, {key:'year', label:'Year'}, {key:'managerName', label:'Manager Name'} ].map(field => (
                                <div key={field.key}>
                                    <label className="block text-[10px] font-black uppercase mb-1 ml-1">{field.label}</label>
                                    <input className={`w-full p-3 border-2 rounded-xl text-gray-950 ${errors[field.key] ? 'border-red-500' : 'border-gray-200'}`} placeholder={field.label} onChange={(e) => { setFormData({...formData, [field.key]: e.target.value}); if(errors[field.key]) setErrors({...errors, [field.key]: null}) }} />
                                    {errors[field.key] && <p className="text-red-600 text-[10px] font-bold mt-1 ml-1">{errors[field.key]}</p>}
                                </div>
                            ))}
                            <div>
                                <label className="block text-[10px] font-black uppercase mb-1 ml-1">Start Date</label>
                                <input type="date" className={`w-full p-3 border-2 rounded-xl ${errors.startDate ? 'border-red-500' : 'border-gray-200'}`} onChange={(e) => { setFormData({...formData, startDate: e.target.value}); if(errors.startDate) setErrors({...errors, startDate: null}) }} />
                                {errors.startDate && <p className="text-red-600 text-[10px] font-bold mt-1 ml-1">{errors.startDate}</p>}
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase mb-1 ml-1">Organization</label>
                                <select className={`w-full p-3 border-2 rounded-xl bg-white ${errors.orgId ? 'border-red-500' : 'border-gray-200'}`} onChange={(e) => { setFormData({...formData, orgId: e.target.value}); if(errors.orgId) setErrors({...errors, orgId: null}) }}>
                                    <option value="">Select Organization</option>
                                    {facilities.filter(f => f.facilityType !== 'SCHOOL').map(f => <option key={f.id} value={f.id}>{f.facilityName}</option>)}
                                </select>
                                {errors.orgId && <p className="text-red-600 text-[10px] font-bold mt-1 ml-1">{errors.orgId}</p>}
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase mb-1 ml-1">Target School</label>
                                <select className={`w-full p-3 border-2 rounded-xl bg-white ${errors.targetId ? 'border-red-500' : 'border-gray-200'}`} onChange={(e) => { setFormData({...formData, targetId: e.target.value}); if(errors.targetId) setErrors({...errors, targetId: null}) }}>
                                    <option value="">Select Target School</option>
                                    {facilities.filter(f => f.facilityType === 'SCHOOL').map(f => <option key={f.id} value={f.id}>{f.facilityName}</option>)}
                                </select>
                                {errors.targetId && <p className="text-red-600 text-[10px] font-bold mt-1 ml-1">{errors.targetId}</p>}
                            </div>
                        </div>
                        <button onClick={handleCreate} className="w-full mt-8 py-4 bg-blue-950 text-white rounded-2xl font-black shadow-lg">Save Campaign</button>
                    </div>
                </div>
            )}

            {isConfirmOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
                        <h3 className="font-bold text-lg">Confirm Action</h3>
                        <p className="text-gray-600 text-sm mt-2">Are you sure you want to perform this action?</p>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setIsConfirmOpen(false)} className="flex-1 py-2 bg-gray-200 rounded-lg font-bold">No</button>
                            <button onClick={executeAction} className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold">Yes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default CampaignsPage;