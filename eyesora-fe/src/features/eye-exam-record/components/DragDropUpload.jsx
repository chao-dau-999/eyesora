import { useState } from 'react';
import { Upload, File } from 'lucide-react';

const DragDropUpload = ({ file, setFile, error, setError, onFileSelect }) => {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) validateAndSetFile(e.dataTransfer.files[0]);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) validateAndSetFile(e.target.files[0]);
    };

    const validateAndSetFile = (selectedFile) => {
        setError(null);
        if (onFileSelect) onFileSelect();

        const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
        if (!['xlsx', 'xls', 'csv'].includes(fileExtension)) {
            setError("Hệ thống chỉ chấp nhận file định dạng .xlsx, .xls hoặc .csv");
            setFile(null);
            return;
        }
        setFile(selectedFile);
    };

    return (
        <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Tải lên File dữ liệu danh sách (*)</label>
            <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all min-h-[180px] relative ${
                    dragActive ? "border-blue-900 bg-blue-50/40" : "border-gray-200 bg-gray-50/50 hover:bg-gray-50"
                }`}
            >
                <input type="file" id="file-upload" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleFileChange} />
                <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-900 mb-3 shadow-inner">
                        <Upload className="w-6 h-6 text-blue-900" />
                    </div>
                    <p className="text-sm font-semibold text-gray-800">Kéo và thả file Excel vào đây, hoặc <span className="text-blue-900 underline">chọn từ máy tính</span></p>
                    <p className="text-xs text-gray-400 mt-1">Hỗ trợ định dạng mở rộng: .xlsx, .xls, .csv</p>
                </label>

                {file && (
                    <div className="mt-4 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center gap-3 animate-fade-in">
                        <File className="text-green-600 w-5 h-5" />
                        <div className="text-left">
                            <p className="text-xs font-bold text-gray-900 max-w-[250px] truncate">{file.name}</p>
                            <p className="text-[10px] text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button type="button" onClick={() => { setFile(null); if(onFileSelect) onFileSelect(); }} className="text-xs text-red-500 font-bold hover:underline ml-4 cursor-pointer">Xóa</button>
                    </div>
                )}
            </div>
            {error && <p className="text-red-500 text-[10px] font-bold mt-1">{error}</p>}
        </div>
    );
};

export default DragDropUpload;