import { ArrowLeft, Download } from 'lucide-react';

const PageHeader = ({ onBack, onDownloadTemplate }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 w-full">
        <div className="flex items-center gap-3">
            <button
                onClick={onBack}
                className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-blue-900 shadow-sm transition-colors cursor-pointer flex items-center justify-center"
            >
                <ArrowLeft size={18} />
            </button>
            <div>
                <h1 className="text-lg font-bold text-gray-900">Import hồ sơ bằng Excel / CSV</h1>
                <p className="text-xs text-gray-500">Thêm danh sách học sinh hàng loạt vào hệ thống lâm sàng</p>
            </div>
        </div>

        <button
            onClick={onDownloadTemplate}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-blue-900 font-bold hover:bg-gray-50 transition-all rounded-xl text-sm shadow-sm cursor-pointer w-fit"
        >
            <Download size={16} /> Tải file Excel mẫu
        </button>
    </div>
);

export default PageHeader;