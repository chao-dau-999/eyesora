import { Download, Upload, Plus } from "lucide-react";

const CampaignActions = ({ onAdd, onImport, onExport }) => {
    return (
        <div className="flex items-center gap-2">
            <button onClick={onExport} className="flex items-center gap-1 px-3 py-2 text-blue-900 font-bold hover:bg-gray-50 transition-colors text-sm rounded-lg border border-gray-200 cursor-pointer">
                <Download size={18} /> Tải File Mẫu
            </button>
            <button onClick={onImport} className="flex items-center gap-1 px-3 py-2 text-blue-900 font-bold hover:bg-gray-50 transition-colors text-sm rounded-lg border border-gray-200 cursor-pointer">
                <Upload size={18} /> Import Excel
            </button>
            <button
                onClick={onAdd}
                className="flex items-center gap-1 px-4 py-2 bg-blue-900 text-white font-bold hover:bg-blue-800 active:scale-95 transition-all text-sm rounded-lg shadow-sm cursor-pointer"
            >
                <Plus size={18} /> New Campaign
            </button>
        </div>
    );
};

export default CampaignActions;