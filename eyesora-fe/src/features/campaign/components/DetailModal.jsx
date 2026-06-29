import { X } from "lucide-react";

const DetailModal = ({ campaign, onClose }) => {
    if (!campaign) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <div>
                        <h2 className="text-2xl font-black text-gray-950">Chi tiết chiến dịch</h2>
                        <p className="text-sm font-semibold text-blue-900 mt-1">{campaign.campaignTitle}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    >
                        <X size={22} className="text-gray-400" />
                    </button>
                </div>

                <div className="space-y-6 text-sm">
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                        <div>
                            <span className="block font-bold text-gray-400 uppercase text-[10px] mb-1">Năm thực hiện:</span>
                            <p className="font-bold text-gray-950">{campaign.facilityYear}</p>
                        </div>
                        <div>
                            <span className="block font-bold text-gray-400 uppercase text-[10px] mb-1">Trạng thái:</span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${campaign.status === 'LOCKED' ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                                {campaign.status}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <InfoRow label="Thời gian diễn ra" value={`${campaign.startDate} đến ${campaign.endDate}`} />
                        <InfoRow label="Người quản lý" value={campaign.managerName} />
                        <InfoRow label="Đơn vị tổ chức" value={campaign.organizationName} />
                        <InfoRow label="Trường học mục tiêu" value={campaign.targetFacilityName} />
                    </div>

                    <div className="border-t border-gray-100 pt-6 mt-2 flex justify-between items-center bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                        <span className="font-bold text-blue-900 uppercase text-xs">Tổng học sinh đã khám:</span>
                        <p className="font-black text-blue-950 text-2xl">{campaign.patientCount || 0}</p>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-8 py-4 bg-gray-950 text-white rounded-2xl font-black hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 cursor-pointer"
                >
                    Đóng chi tiết
                </button>
            </div>
        </div>
    );
};

const InfoRow = ({ label, value }) => (
    <div className="border-b border-gray-100 pb-3">
        <span className="block font-bold text-gray-400 uppercase text-[10px] mb-1">{label}</span>
        <p className="font-bold text-gray-900">{value || '---'}</p>
    </div>
);

export default DetailModal;