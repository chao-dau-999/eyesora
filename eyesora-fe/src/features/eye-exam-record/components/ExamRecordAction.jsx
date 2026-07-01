import {Download, Upload, Plus, SquarePen} from "lucide-react";
import {useNavigate} from "react-router-dom";

const ExamRecordAction = ({onAddClick, onBulkClick}) => {
    const navigate = useNavigate();
    return (
        <div className="flex items-center gap-2">
            <a href="/mau_nhap_lieu_hoc_sinh.xlsx"
                download="Mau_Nhap_Lieu_Hoc_Sinh.xlsx"
                className="flex items-center gap-1 px-3 py-2 text-blue-900 font-bold hover:bg-gray-50 transition-colors text-sm rounded-lg border border-gray-200 cursor-pointer no-underline inline-flex">
                <span><Download size={18}/></span>
                Tải xuống mẫu
            </a>
            <button
                className="flex items-center gap-1 px-3 py-2 text-blue-900 font-bold hover:bg-gray-50 transition-colors text-sm rounded-lg border border-gray-200 cursor-pointer"
                onClick={() => navigate('/eye-exam-records/import')}
            >
                <span><Upload size={18}/></span>
                Nhập dữ liệu Excel
            </button>
            <button
                onClick={onAddClick}
                className="flex items-center gap-1 px-3 py-2 bg-blue-900 text-white font-bold hover:bg-blue-800 active:scale-95 transition-all text-sm rounded-lg shadow-sm cursor-pointer"
            >
                <span><Plus size={18}/></span>
                Thêm bản ghi
            </button>
            <button
                onClick={onBulkClick}
                className="flex items-center gap-1 px-3 py-2 bg-blue-900 text-white font-bold hover:bg-blue-800 active:scale-95 transition-all text-sm rounded-lg shadow-sm cursor-pointer"
            >
                <span><SquarePen size={18}/></span>
                Nhập hàng loạt
            </button>
        </div>
    );
};

export default ExamRecordAction;