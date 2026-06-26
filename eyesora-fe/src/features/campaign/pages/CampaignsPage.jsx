import { useState, useEffect } from 'react';
import axiosClient from "../../../shared/axios/axiosClient.js";
import { Lock, Unlock, Trash2, ChevronLeft, ChevronRight, X, Eye } from "lucide-react";
import CampaignActions from "../components/CampaignActions.jsx";

const CampaignsPage = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [pageData, setPageData] = useState({ page: 0, totalPages: 0, totalElements: 0 });
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
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

    const openDetail = async (c) => {
        try {
            const res = await axiosClient.get(`/campaigns/${c.campaignId}`);
            console.log("Dữ liệu chi tiết từ API:", res.data);
            setSelectedCampaign(res.data);
            setIsDetailOpen(true);
        } catch (error) { showNotification("Failed to load details", "error"); }
    };

    const executeAction = async () => {
        try {
            if (pendingAction.type === 'delete') await axiosClient.delete(`/campaigns/${pendingAction.id}`);
            else await axiosClient.patch(`/campaigns/${pendingAction.id}/status/${pendingAction.newStatus}`);
            setIsConfirmOpen(false);
            fetchCampaigns(pageData.page);
        } catch (error) { showNotification("Action failed!", "error"); }
    };

    const handleCreate = async () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Required";
        if (!formData.year.trim()) newErrors.year = "Required";
        if (!formData.startDate) newErrors.startDate = "Required";
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            await axiosClient.post("/campaigns", formData);
            showNotification("Campaign created successfully!");
            setIsCreateOpen(false);
            setFormData({ title: '', year: '', startDate: '', managerName: '', orgId: '', targetId: '' });
            fetchCampaigns(0);
        } catch (error) { showNotification("Create failed!", "error"); }
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
                    <tr><th className="px-6 py-4">Title</th><th className="px-4 py-4">Year</th><th className="px-4 py-4">Manager</th><th className="px-4 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {campaigns.map((c) => (
                        <tr key={c.campaignId} className="hover:bg-gray-50 text-sm">
                            <td className="px-6 py-4 font-bold">{c.campaignTitle}</td>
                            <td className="px-4 py-4">{c.facilityYear}</td>
                            <td className="px-4 py-4">{c.managerName}</td>
                            <td className="px-4 py-4"><span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${c.status === 'LOCKED' ? "bg-red-600" : "bg-emerald-600"} text-white`}>{c.status}</span></td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                <button onClick={() => openDetail(c)} className="p-2 bg-gray-50 rounded-lg border hover:bg-gray-100"><Eye size={18}/></button>
                                <button onClick={() => { setPendingAction({type:'status', id: c.campaignId, newStatus: c.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED'}); setIsConfirmOpen(true); }} className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-100">{c.status === 'LOCKED' ? <Unlock size={18}/> : <Lock size={18}/>}</button>
                                <button onClick={() => { setPendingAction({type:'delete', id: c.campaignId}); setIsConfirmOpen(true); }} className="p-2 bg-white rounded-lg border border-gray-200 text-red-600 hover:bg-gray-100"><Trash2 size={18}/></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="flex items-center justify-between px-6 py-5 bg-white border-t border-gray-100">
                    <div className="text-sm font-semibold text-gray-500">Trang {pageData.page + 1} / {pageData.totalPages || 1}</div>
                    <div className="flex items-center gap-1.5">
                        <button disabled={pageData.page === 0} onClick={() => fetchCampaigns(pageData.page - 1)} className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg disabled:opacity-30"><ChevronLeft size={18}/></button>
                        {[...Array(pageData.totalPages)].map((_, i) => (
                            <button key={i} onClick={() => fetchCampaigns(i)} className={`w-9 h-9 rounded-lg font-bold text-sm ${pageData.page === i ? 'bg-blue-900 text-white' : 'bg-white border text-gray-600'}`}>{i + 1}</button>
                        ))}
                        <button disabled={pageData.page >= pageData.totalPages - 1} onClick={() => fetchCampaigns(pageData.page + 1)} className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg disabled:opacity-30"><ChevronRight size={18}/></button>
                    </div>
                </div>
            </div>

            {/* Modal Detail */}

            {isDetailOpen && selectedCampaign && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black">Campaign Details</h2>
                            <button onClick={() => setIsDetailOpen(false)}><X/></button>
                        </div>

                        <div className="space-y-4 text-sm text-gray-700">
                            <div className="grid grid-cols-2 gap-4">
                                <p><span className="block font-bold text-gray-500 uppercase text-[10px]">Title:</span> {selectedCampaign.campaignTitle}</p>
                                <p><span className="block font-bold text-gray-500 uppercase text-[10px]">Year:</span> {selectedCampaign.facilityYear}</p>
                            </div>
                            <p><span className="block font-bold text-gray-500 uppercase text-[10px]">Manager:</span> {selectedCampaign.managerName}</p>
                            <p><span className="block font-bold text-gray-500 uppercase text-[10px]">Start Date:</span> {selectedCampaign.startDate}</p>
                            <p><span className="block font-bold text-gray-500 uppercase text-[10px]">Status:</span>
                                <span className={`ml-2 px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${selectedCampaign.status === 'LOCKED' ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
                        {selectedCampaign.status}
                    </span>
                            </p>
                            <div className="border-t pt-4 mt-2">
                                <p><span className="block font-bold text-gray-500 uppercase text-[10px]">Organization:</span> {selectedCampaign.organizationName}</p>
                                <p className="mt-2"><span className="block font-bold text-gray-500 uppercase text-[10px]">Target School:</span> {selectedCampaign.targetFacilityName}</p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-xl mt-2">
                                <p className="text-blue-900 font-black text-sm">
                                    Total Patients: <span className="text-xl">{selectedCampaign.patientCount || 0}</span>
                                </p>
                            </div>
                        </div>

                        <button onClick={() => setIsDetailOpen(false)} className="w-full mt-8 py-3 bg-gray-900 text-white rounded-xl font-black hover:bg-gray-800 transition-all">Close</button>
                    </div>
                </div>
            )}

            {/* Modal Create */}
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
                                    <input className="w-full p-3 border-2 rounded-xl" placeholder={field.label} onChange={(e) => setFormData({...formData, [field.key]: e.target.value})} />
                                </div>
                            ))}
                            <button onClick={handleCreate} className="w-full mt-8 py-4 bg-blue-950 text-white rounded-2xl font-black">Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Confirm */}
            {isConfirmOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
                        <h3 className="font-bold text-lg">Confirm Action</h3>
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