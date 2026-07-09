import { CircleCheck, AlertTriangle } from 'lucide-react';

const ImportResultAlert = ({ result }) => {
    if (!result) return null;

    const isSuccessAll = result.failureCount === 0;

    return (
        <div className={`p-5 border rounded-xl space-y-3 ${
            isSuccessAll ? 'bg-green-50/50 border-green-200 text-green-800' : 'bg-amber-50/50 border-amber-200 text-amber-900'
        }`}>
            <div className="flex items-center gap-2 font-bold text-base">
                {isSuccessAll ? <CircleCheck className="text-green-600" size={22} /> : <AlertTriangle className="text-amber-600" size={22} />}
                {isSuccessAll
                    ? `Import thành công hoàn toàn! (Đã lưu ${result.successCount}/${result.totalRows} dòng)`
                    : `Import hoàn tất nhưng có lỗi xuất hiện! (${result.successCount} thành công, ${result.failureCount} thất bại)`
                }
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold mt-1">
                <span className="px-2.5 py-1 bg-slate-200/60 rounded-md text-slate-700">Tổng số dòng: {result.totalRows}</span>
                <span className="px-2.5 py-1 bg-green-100 rounded-md text-green-700">Thành công: {result.successCount}</span>
                <span className="px-2.5 py-1 bg-red-100 rounded-md text-red-700">Lỗi dữ liệu: {result.failureCount}</span>
            </div>

            {result.errors && result.errors.length > 0 && (
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
                            {result.errors.map((err, idx) => (
                                <tr key={idx} className="hover:bg-red-50/30 transition-colors">
                                    <td className="p-3 text-center text-red-600 font-bold bg-red-50/20">Dòng {err.rowNumber}</td>
                                    <td className="p-3 text-slate-600">{err.errorMessage}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImportResultAlert;