import { useState, useEffect } from 'react';
import axiosClient from "../../../shared/axios/axiosClient.js";
import CampaignActions from "../components/CampaignActions.jsx";
import CampaignTable from "../components/CampaignTable.jsx";
import DetailModal from "../components/DetailModal.jsx";
import CreateModal from "../components/CreateModal.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import Pagination from "../../../shared/components/Pagination.jsx";

const CampaignsPage = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [orgs, setOrgs] = useState([]);
    const [errors, setErrors] = useState({});
    const [pageData, setPageData] = useState({ page: 0, totalPages: 0, totalElements: 0 });
    const [modals, setModals] = useState({ detail: false, create: false, confirm: false });
    const [selected, setSelected] = useState(null);
    const [pending, setPending] = useState(null);
    const [formData, setFormData] = useState({
        title: '', year: '', startDate: '', managerName: '', orgId: '', targetId: ''
    });

    useEffect(() => {
        fetchCampaigns(0);
        fetchMasterData();
    }, []);

    const fetchCampaigns = async (page = 0) => {
        try {
            const res = await axiosClient.get(`/campaigns?page=${page}&size=10`);
            setCampaigns(res.data.content || []);
            setPageData({ page: res.data.number, totalPages: res.data.totalPages, totalElements: res.data.totalElements });
        } catch (error) { console.error("Error:", error); }
    };

    const fetchMasterData = async () => {
        try {
            const res = await axiosClient.get("/master-data/facilities?size=100");
            const all = res.data.content || [];
            setFacilities(all.filter(f => f.facilityType === 'SCHOOL'));
            setOrgs(all.filter(f => f.facilityType !== 'SCHOOL'));
        } catch (error) { console.error("Error:", error); }
    };

    const handleAction = async () => {
        try {
            if (pending.type === 'delete') await axiosClient.delete(`/campaigns/${pending.id}`);
            else await axiosClient.patch(`/campaigns/${pending.id}/status/${pending.newStatus}`);
            setModals({ ...modals, confirm: false });
            fetchCampaigns(pageData.page);
        } catch (error) { console.error("Action failed!"); }
    };

    const handleSave = async () => {
        try {
            setErrors({});
            await axiosClient.post("/campaigns", formData);
            setModals({...modals, create: false});
            fetchCampaigns(0);
        } catch (err) {
            const data = err.response?.data;
            if (data && typeof data === 'object' && !data.message) {
                setErrors(data);
            } else {
                alert("Lỗi: " + (data?.message || "Có lỗi xảy ra"));
            }
        }
    };

    return (
        <div className="p-6 bg-[#f5f7fa] h-full overflow-y-auto scrollbar-thin">
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        Examination Campaigns
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Total: {pageData.totalElements} campaigns</p>
                </div>
                <CampaignActions onAdd={() => {
                    setErrors({});
                    setFormData({ title: '', year: '', startDate: '', managerName: '', orgId: '', targetId: '' });
                    setModals({ ...modals, create: true });
                }} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <CampaignTable
                    campaigns={campaigns}
                    onOpenDetail={(c) => { setSelected(c); setModals({ ...modals, detail: true }); }}
                    onToggleStatus={(c) => { setPending({type:'status', id: c.campaignId, newStatus: c.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED'}); setModals({ ...modals, confirm: true }); }}
                    onDelete={(id) => { setPending({type:'delete', id}); setModals({ ...modals, confirm: true }); }}
                />

                <div className="flex items-center justify-between px-6 py-5 bg-white border-t border-gray-100">
                    <div className="text-sm font-semibold text-gray-500">
                        Trang {pageData.page + 1} / {pageData.totalPages || 1}
                    </div>
                    <Pagination
                        currentPage={pageData.page}
                        totalPages={pageData.totalPages}
                        onPageChange={(p) => fetchCampaigns(p)}
                    />
                </div>
            </div>

            {modals.detail && <DetailModal campaign={selected} onClose={() => setModals({ ...modals, detail: false })} />}
            {modals.create && (
                <CreateModal
                    onClose={() => setModals({...modals, create: false})}
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    facilities={facilities}
                    orgs={orgs}
                    onSave={handleSave}
                />
            )}
            {modals.confirm && <ConfirmModal onConfirm={handleAction} onClose={() => setModals({ ...modals, confirm: false })} />}
        </div>
    );
};
export default CampaignsPage;