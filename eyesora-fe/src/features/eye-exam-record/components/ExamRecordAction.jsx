import { Download, Upload, Plus, SquarePen } from "lucide-react";

const ExamRecordAction = ({ onAddClick, onBulkClick }) => {
    return (
        <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-2 text-blue-900 font-bold hover:bg-gray-50 transition-colors text-sm rounded-lg border border-gray-200 cursor-pointer">
                <span><Download size={18} /></span>
                Tải xuống mẫu
            </button>
            <button className="flex items-center gap-1 px-3 py-2 text-blue-900 font-bold hover:bg-gray-50 transition-colors text-sm rounded-lg border border-gray-200 cursor-pointer">
                <span><Upload size={18} /></span>
                Nhập dữ liệu Excel
            </button>
            <button
                onClick={onAddClick}
                className="flex items-center gap-1 px-3 py-2 bg-blue-900 text-white font-bold hover:bg-blue-800 active:scale-95 transition-all text-sm rounded-lg shadow-sm cursor-pointer"
            >
                <span><Plus size={18} /></span>
                Thêm bản ghi
            </button>
            <button
                onClick={onBulkClick}
                className="flex items-center gap-1 px-3 py-2 bg-blue-900 text-white font-bold hover:bg-blue-800 active:scale-95 transition-all text-sm rounded-lg shadow-sm cursor-pointer"
            >
                <span><SquarePen size={18} /></span>
                Nhập hàng loạt
            </button>
        </div>
    );
};

export default ExamRecordAction;