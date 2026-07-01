import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Download, File, CircleCheck, CircleAlert, RefreshCcw, AlertTriangle } from 'lucide-react';
import axiosClient from "../../../shared/axios/axiosClient.js";

const ExamRecordImportPage = () => {
    const navigate = useNavigate();

    const [selectedCampaign, setSelectedCampaign] = useState('');
    const [selectedFacility, setSelectedFacility] = useState('');
    const [selectedExaminer, setSelectedExaminer] = useState('');
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const [options, setOptions] = useState({ facilities: [], examiners: [], campaigns: [] });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // NÂNG CẤP: State quản lý kết quả chi tiết từ API
    const [importResult, setImportResult] = useState(null);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [fRes, eRes, cRes] = await Promise.all([
                    axiosClient.get('/master-data/facilities?size=999').catch(() => ({ data: [] })),
                    axiosClient.get('/admin/users?role=examiner&size=999').catch(() => ({ data: [] })),
                    axiosClient.get('/campaigns?status=active&size=999').catch(() => ({ data: [] }))
                ]);
                setOptions({
                    facilities: fRes.data.content || fRes.data || [],
                    examiners: eRes.data.content || eRes.data || [],
                    campaigns: cRes.data.content || cRes.data || []
                });
            } catch (err) {
                console.error("Lỗi tải danh mục:", err);
            }
        };
        fetchDropdownData();
    }, []);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (selectedFile) => {
        setErrors(prev => ({ ...prev, file: null }));
        setImportResult(null); // Reset kết quả cũ khi chọn file mới
        const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
        if (!['xlsx', 'xls', 'csv'].includes(fileExtension)) {
            setErrors(prev => ({ ...prev, file: "Hệ thống chỉ chấp nhận file định dạng .xlsx, .xls hoặc .csv" }));
            setFile(null);
            return;
        }
        setFile(selectedFile);
    };

    const handleImportSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setImportResult(null);

        let localErrors = {};
        if (!selectedFacility) localErrors.facilityId = "Vui lòng chọn cơ sở khám";
        if (!selectedExaminer) localErrors.examinerId = "Vui lòng chọn người khám";
        if (!selectedCampaign) localErrors.campaignId = "Vui lòng chọn chiến dịch";
        if (!file) localErrors.file = "Vui lòng tải lên file dữ liệu mẫu";

        if (Object.keys(localErrors).length > 0) {
            setErrors(localErrors);
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('facilityId', selectedFacility);
        formData.append('examinerId', selectedExaminer);
        formData.append('campaignId', selectedCampaign);

        try {
            const response = await axiosClient.post('/eye-exam-records/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Lưu data kết quả trả về từ API (chứa totalRows, successCount, failureCount, errors)
            setImportResult(response.data);

            if (response.data.failureCount === 0) {
                setFile(null); // Chỉ xóa file cũ nếu thành công 100%
            }
        } catch (err) {
            // Trường hợp lỗi hệ thống (Crash 500, Token hết hạn, sai Endpoint...)
            setErrors({ server: err.response?.data?.message || "Quá trình Import thất bại. Vui lòng kiểm tra lại cấu trúc file." });
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadTemplate = () => {
        const link = document.createElement('a');
        link.href = '/templates/mau_import_hoc_sinh.xlsx';
        link.setAttribute('download', 'Mau_Import_Hoc_Sinh.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const inputStyle = `w-full border border-gray-200 bg-white p-3 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all text-sm outline-none cursor-pointer`;
    const labelStyle = `text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block`;

    return (
        <div className="p-6 bg-[#f5f7fa] h-full overflow-y-auto scrollbar-thin">

            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 w-full">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/eye-exam-records')}
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
                    onClick={handleDownloadTemplate}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-blue-900 font-bold hover:bg-gray-50 transition-all rounded-xl text-sm shadow-sm cursor-pointer w-fit"
                >
                    <Download size={16} /> Tải file Excel mẫu
                </button>
            </div>

            {/* Khối Giao diện chính */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full p-6 md:p-8 space-y-6">

                {/* 1. Thông báo lỗi hệ thống/Mạng */}
                {errors.server && (
                    <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-bold flex items-center gap-2">
                        <CircleAlert size={18}/>
                        {errors.server}
                    </div>
                )}

                {/* 2. HIỂN THỊ THÔNG BÁO KẾT QUẢ ĐỌC FILE TỪ API */}
                {importResult && (
                    <div className={`p-5 border rounded-xl space-y-3 ${
                        importResult.failureCount === 0 ? 'bg-green-50/50 border-green-200 text-green-800' : 'bg-amber-50/50 border-amber-200 text-amber-900'
                    }`}>
                        <div className="flex items-center gap-2 font-bold text-base">
                            {importResult.failureCount === 0 ? (
                                <CircleCheck className="text-green-600" size={22} />
                            ) : (
                                <AlertTriangle className="text-amber-600" size={22} />
                            )}
                            {importResult.failureCount === 0
                                ? `Import thành công hoàn toàn! (Đã lưu ${importResult.successCount}/${importResult.totalRows} dòng)`
                                : `Import hoàn tất nhưng có lỗi xuất hiện! (${importResult.successCount} thành công, ${importResult.failureCount} thất bại)`
                            }
                        </div>

                        {/* Thống kê dạng Badge */}
                        <div className="flex items-center gap-3 text-xs font-semibold mt-1">
                            <span className="px-2.5 py-1 bg-slate-200/60 rounded-md text-slate-700">Tổng số dòng: {importResult.totalRows}</span>
                            <span className="px-2.5 py-1 bg-green-100 rounded-md text-green-700">Thành công: {importResult.successCount}</span>
                            <span className="px-2.5 py-1 bg-red-100 rounded-md text-red-700">Lỗi dữ liệu: {importResult.failureCount}</span>
                        </div>

                        {/* BẢNG HIỂN THỊ CHI TIẾT CÁC DÒNG LỖI (Nếu có) */}
                        {importResult.errors && importResult.errors.length > 0 && (
                            <div className="mt-4 border border-red-100 bg-white rounded-xl overflow-hidden shadow-inner">
                                <div className="bg-red-50/50 px-4 py-2 text-xs font-bold text-black-700 border-b border-red-100">
                                    Danh sách chi tiết lỗi cần sửa đổi trong file Excel:
                                </div>
                                <div className="max-h-[220px] overflow-y-auto scrollbar-thin text-xs">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                        <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 sticky top-0">
                                            <th className="p-3 w-24 text-center">Vị trí dòng</th>
                                            <th className="p-3">Nội dung chi tiết lỗi từ hệ thống</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                        {importResult.errors.map((err, idx) => (
                                            <tr key={idx} className="hover:bg-red-50/30 transition-colors">
                                                <td className="p-3 text-center text-red-600 font-bold bg-red-50/20">
                                                    Dòng {err.rowNumber}
                                                </td>
                                                <td className="p-3 text-slate-600">
                                                    {err.errorMessage}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Form Upload */}
                <form onSubmit={handleImportSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className={labelStyle}>Cơ sở y tế / Trường học (*)</label>
                            <select
                                className={inputStyle}
                                value={selectedFacility}
                                onChange={e => { setSelectedFacility(e.target.value); setImportResult(null); }}
                            >
                                <option value="">Chọn cơ sở tiếp nhận...</option>
                                {options.facilities.map(f => <option key={f.id} value={String(f.id)}>{f.facilityName}</option>)}
                            </select>
                            {errors.facilityId && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.facilityId}</p>}
                        </div>

                        <div>
                            <label className={labelStyle}>Cán bộ / Người khám chịu trách nhiệm (*)</label>
                            <select
                                className={inputStyle}
                                value={selectedExaminer}
                                onChange={e => { setSelectedExaminer(e.target.value); setImportResult(null); }}
                            >
                                <option value="">Chọn bác sĩ/kỹ thuật viên khám...</option>
                                {options.examiners.map(e => <option key={e.id} value={String(e.id)}>{e.examinerName || e.fullName || 'Bác sĩ chuyên khoa'}</option>)}
                            </select>
                            {errors.examinerId && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.examinerId}</p>}
                        </div>

                        <div>
                            <label className={labelStyle}>Chiến dịch (*)</label>
                            <select
                                className={inputStyle}
                                value={selectedCampaign}
                                onChange={(e) => {
                                    setSelectedCampaign(e.target.value);
                                    setImportResult(null);
                                }}
                            >
                                <option value="">Chọn chiến dịch...</option>

                                {options.campaigns.map((campaign) => (
                                    <option
                                        key={campaign.campaignId}
                                        value={String(campaign.campaignId)}
                                    >
                                        {campaign.campaignTitle || campaign.name || 'Chiến dịch'}
                                    </option>
                                ))}
                            </select>

                            {errors.campaignId && (
                                <p className="text-red-500 text-[10px] font-bold mt-1">
                                    {errors.campaignId}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className={labelStyle}>Tải lên File dữ liệu danh sách (*)</label>
                        <div
                            onDragEnter={handleDrag}
                            onDragOver={handleDrag}
                            onDragLeave={handleDrag}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all min-h-[180px] relative ${
                                dragActive ? "border-blue-900 bg-blue-50/40" : "border-gray-200 bg-gray-50/50 hover:bg-gray-50"
                            }`}
                        >
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                accept=".xlsx, .xls, .csv"
                                onChange={handleFileChange}
                            />

                            <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer text-center">
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-900 mb-3 shadow-inner">
                                    <Upload className="w-6 h-6 text-blue-900" />
                                </div>
                                <p className="text-sm font-semibold text-gray-800">
                                    Kéo và thả file Excel vào đây, hoặc <span className="text-blue-900 underline">chọn từ máy tính</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-1">Hỗ trợ định dạng mở rộng: .xlsx, .xls, .csv</p>
                            </label>

                            {file && (
                                <div className="mt-4 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center gap-3 animate-fade-in">
                                    <File className="text-green-600 w-5 h-5" />
                                    <div className="text-left">
                                        <p className="text-xs font-bold text-gray-900 max-w-[250px] truncate">{file.name}</p>
                                        <p className="text-[10px] text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => { setFile(null); setImportResult(null); }}
                                        className="text-xs text-red-500 font-bold hover:underline ml-4 cursor-pointer"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            )}
                        </div>
                        {errors.file && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.file}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-8 w-full">
                        <button
                            type="button"
                            onClick={() => navigate('/eye-exam-records')}
                            className="px-6 py-2.5 border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all rounded-xl text-sm cursor-pointer"
                            disabled={loading}
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-2.5 bg-blue-900 text-white font-bold hover:bg-blue-800 active:scale-95 transition-all rounded-xl text-sm shadow-sm cursor-pointer flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <RefreshCcw className="w-4 h-4 animate-spin" />
                                    Đang xử lý import...
                                </>
                            ) : (
                                "Tiến hành Import"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExamRecordImportPage;