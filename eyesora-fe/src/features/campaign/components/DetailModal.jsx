import { X } from "lucide-react";

const DetailModal = ({ campaign, onClose }) => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl text-blue-950 font-black">Chi tiết chiến dịch</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-900"><X size={20}/></button>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="block font-bold text-gray-400 uppercase text-[10px] mb-1">Tên chiến dịch:</span>
                        <p className="font-bold text-gray-900">{campaign.campaignTitle}</p>
                    </div>
                    <div>
                        <span className="block font-bold text-gray-400 uppercase text-[10px] mb-1">Năm:</span>
                        <p className="font-bold text-gray-900">{campaign.facilityYear}</p>
                    </div>
                </div>

                <div>
                    <span className="block font-bold text-gray-400 uppercase text-[10px] mb-1">Thời gian:</span>
                    <p className="font-bold text-gray-900">{campaign.startDate} đến {campaign.endDate}</p>
                </div>

                <div>
                    <span className="block font-bold text-gray-400 uppercase text-[10px] mb-1">Người quản lý:</span>
                    <p className="font-bold text-gray-900">{campaign.managerName}</p>
                </div>

                <div>
                    <span className="block font-bold text-gray-400 uppercase text-[10px] mb-1">Trạng thái:</span>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${campaign.status === 'LOCKED' ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                        {campaign.status}
                    </span>
                </div>

                <div className="border-t pt-4 mt-2 space-y-3">
                    <div>
                        <span className="block font-bold text-gray-400 uppercase text-[10px] mb-1">Đơn vị tổ chức:</span>
                        <p className="font-bold text-gray-900">{campaign.organizationName}</p>
                    </div>
                    <div>
                        <span className="block font-bold text-gray-400 uppercase text-[10px] mb-1">Trường học mục tiêu:</span>
                        <p className="font-bold text-gray-900">{campaign.targetFacilityName}</p>
                    </div>
                </div>

                <div className="border-t pt-4 mt-2">
                    <span className="block font-bold text-gray-400 uppercase text-[10px] mb-1">Số lượng học sinh đã khám:</span>
                    <p className="font-bold text-blue-900 text-lg">{campaign.patientCount || 0} học sinh</p>
                </div>
            </div>


            <button
                onClick={onClose}
                className="w-full mt-8 py-3 bg-gray-900 text-white rounded-xl font-black hover:bg-gray-800 transition-all shadow-md">
                Đóng
            </button>
        </div>
    </div>
);

export default DetailModal;