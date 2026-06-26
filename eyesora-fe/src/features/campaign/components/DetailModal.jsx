import { X } from "lucide-react";

const DetailModal = ({ campaign, onClose }) => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl text-blue-950 font-black">Campaign Details</h2>
                <button onClick={onClose}><X/></button>
            </div>
            <div className="space-y-4 text-sm text-gray-700">
                <div className="grid grid-cols-2 gap-4">
                    <p><span className="block font-bold text-gray-500 uppercase text-[10px]">Title:</span> {campaign.campaignTitle}</p>
                    <p><span className="block font-bold text-gray-500 uppercase text-[10px]">Year:</span> {campaign.facilityYear}</p>
                </div>
                <p><span className="block font-bold text-gray-500 uppercase text-[10px]">Manager:</span> {campaign.managerName}</p>
                <p><span className="block font-bold text-gray-500 uppercase text-[10px]">Start Date:</span> {campaign.startDate}</p>
                <p><span className="block font-bold text-gray-500 uppercase text-[10px]">Status:</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${campaign.status === 'LOCKED' ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
                        {campaign.status}
                    </span>
                </p>
                <div className="border-t pt-4 mt-2">
                    <p><span className="block font-bold text-gray-500 uppercase text-[10px]">Organization:</span> {campaign.organizationName}</p>
                    <p className="mt-2"><span className="block font-bold text-gray-500 uppercase text-[10px]">Target School:</span> {campaign.targetFacilityName}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl mt-2">
                    <p className="text-blue-900 font-black text-sm">Total Patients: <span className="text-xl">{campaign.patientCount || 0}</span></p>
                </div>
            </div>
            <button onClick={onClose} className="w-full mt-8 py-3 bg-gray-900 text-white rounded-xl font-black hover:bg-gray-800 transition-all">Close</button>
        </div>
    </div>
);
export default DetailModal;