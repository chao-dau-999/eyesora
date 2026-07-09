import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowLeft, AlertCircle, RefreshCw, KeyRound } from 'lucide-react';
import axiosClient from "../../../shared/axios/axiosClient.js";

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // 🟢 TỰ ĐỘNG LẤY TOKEN TỪ URL PARAMETERS (?token=...)
    const tokenParam = searchParams.get('token') || '';
    const emailParam = searchParams.get('email') || '';

    const [resetData, setResetData] = useState({ newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Kiểm tra và hiển thị thông báo lỗi ngay lập tức nếu thiếu token trên đường dẫn
    useEffect(() => {
        if (!tokenParam) {
            setErrors({ server: "Không tìm thấy liên kết xác minh hoặc mã token hợp lệ. Vui lòng kiểm tra lại email khôi phục mật khẩu!" });
        }
    }, [tokenParam]);

    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Nếu không có token từ URL thì chặn đứng hành động submit
        if (!tokenParam) {
            setErrors({ server: "Yêu cầu khôi phục mật khẩu không hợp lệ do thiếu mã token xác thực." });
            return;
        }

        let localErrors = {};
        if (!resetData.newPassword) localErrors.newPassword = "Vui lòng nhập mật khẩu mới";
        if (resetData.newPassword !== resetData.confirmPassword) localErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp";

        if (Object.keys(localErrors).length > 0) {
            setErrors(localErrors);
            return;
        }

        setLoading(true);
        try {
            // 🟢 TỰ ĐỘNG ĐÓNG GÓI TOKEN TỪ URL VÀO TRONG PAYLOAD GỬI LÊN BACKEND
            const payload = {
                token: tokenParam.trim(),
                newPassword: resetData.newPassword,
                confirmPassword: resetData.confirmPassword
            };
            const res = await axiosClient.post('/auth/reset-password', payload);

            alert(res.data || "Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.");
            navigate('/login');
        } catch (err) {
            setErrors({ server: err.response?.data || err.message || "Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn." });
        } finally {
            setLoading(false);
        }
    };

    const labelStyle = `text-xs font-bold text-slate-600 uppercase tracking-wider mb-1 block`;
    const inputStyle = `block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl font-medium text-sm text-gray-800 placeholder-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 focus:bg-white transition-all`;

    return (
        <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center p-4">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-xl w-full max-w-md p-6 md:p-8">

                <button
                    onClick={() => navigate('/forgot-password')}
                    className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-blue-900 mb-6 transition-colors cursor-pointer"
                >
                    <ArrowLeft size={14} /> <span>Quay lại nhập Email</span>
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-xl font-black text-blue-900 uppercase tracking-tight">Đặt lại mật khẩu mới</h2>
                    <p className="text-xs text-gray-500 mt-1">
                        {emailParam ? `Thiết lập mật khẩu mới cho tài khoản: ${emailParam}` : "Vui lòng nhập mật khẩu mới để bảo mật tài khoản của bạn"}
                    </p>
                </div>

                {errors.server && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold flex items-start gap-2 animate-fade-in">
                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                        <span>{errors.server}</span>
                    </div>
                )}

                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">

                    {/* New Password Field */}
                    <div>
                        <label className={labelStyle}>Mật khẩu mới (*)</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-900 transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                value={resetData.newPassword}
                                disabled={!tokenParam}
                                onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                                className={`${inputStyle} ${errors.newPassword ? 'border-red-400 focus:ring-red-200' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
                                placeholder="Từ 8-50 ký tự, đầy đủ định dạng"
                            />
                        </div>
                        {errors.newPassword && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.newPassword}</p>}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label className={labelStyle}>Xác nhận mật khẩu mới (*)</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-900 transition-colors">
                                <KeyRound size={18} />
                            </div>
                            <input
                                type="password"
                                value={resetData.confirmPassword}
                                disabled={!tokenParam}
                                onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                                className={`${inputStyle} ${errors.confirmPassword ? 'border-red-400 focus:ring-red-200' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
                                placeholder="Nhập lại mật khẩu giống hệt phía trên"
                            />
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.confirmPassword}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !tokenParam}
                        className="w-full py-3 bg-blue-900 text-white font-bold text-sm rounded-xl shadow-md hover:bg-blue-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                        <span>Xác nhận đổi mật khẩu</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;