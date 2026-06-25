import { Download, Upload, Plus, SquarePen } from "lucide-react";

const PatientAction = () => {
    return (
    <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 px-3 py-2 text-blue-900 font-bold hover:bg-gray-50 transition-colors text-sm rounded-lg border border-gray-200 cursor-pointer">
            <span className="material-symbols-outlined text-[20px]"><Download /></span>
            Tải File Mẫu
        </button>
        <button className="flex items-center gap-1 px-3 py-2 text-blue-900 font-bold hover:bg-gray-50 transition-colors text-sm rounded-lg border border-gray-200 cursor-pointer">
            <span className="material-symbols-outlined text-[20px]"><Upload /></span>
            Import Excel
        </button>
        <button
            // onClick={onAddClick}
            className="flex items-center gap-1 px-3 py-2 bg-blue-900 text-white font-bold hover:bg-blue-800 active:scale-95 transition-all text-sm rounded-lg shadow-sm cursor-pointer"
        >
            <span className="material-symbols-outlined text-[20px]"><Plus /></span>
            Thêm Học Sinh
        </button>
        <button
            // onClick={onBulkClick}
            className="flex items-center gap-1 px-3 py-2 bg-blue-900 text-white font-bold hover:bg-blue-800 active:scale-95 transition-all text-sm rounded-lg shadow-sm cursor-pointer"
        >
            <span className="material-symbols-outlined text-[20px]"><SquarePen /></span>
            Nhập nhanh đợt khám
        </button>
    </div>
    )
}

export default PatientAction;