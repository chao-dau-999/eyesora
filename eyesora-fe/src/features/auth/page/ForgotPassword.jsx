import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import axiosClient from "../../../shared/axios/axiosClient.js";

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');

        if (!email.trim()) {
            setErrors({ email: "Vui lòng nhập địa chỉ email của bạn" });
            return;
        }

        setLoading(true);
        try {
            const res = await axiosClient.post('/auth/forgot-password', { email: email.trim() });
            alert(res.data || "Mã khôi phục đã được gửi vào email của bạn!");

        } catch (err) {
            setErrors({ server: err.response?.data || err.message || "Email không tồn tại trong hệ thống." });
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        if (!email.trim()) {
            setErrors({ email: "Vui lòng nhập email phía trên trước khi bấm gửi lại mã kích hoạt" });
            return;
        }
        setResendLoading(true);
        setErrors({});
        setSuccessMessage('');
        try {
            const res = await axiosClient.post(`/api/resend-verification?email=${encodeURIComponent(email.trim())}`);
            setSuccessMessage(res.data || "Đã gửi lại email xác thực thành công.");
        } catch (err) {
            setErrors({ server: err.response?.data || "Không thể gửi lại email xác thực. Tài khoản có thể đã được kích hoạt." });
        } finally {
            setResendLoading(false);
        }
    };

    const labelStyle = `text-xs font-bold text-slate-600 uppercase tracking-wider mb-1 block`;
    const inputStyle = `block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl font-medium text-sm text-gray-800 placeholder-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 focus:bg-white transition-all`;

    return (
        <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center p-4">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-xl w-full max-w-md p-6 md:p-8">

                <button
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-blue-900 mb-6 transition-colors cursor-pointer"
                >
                    <ArrowLeft size={14} /> <span>Quay lại Đăng nhập</span>
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-xl font-black text-blue-900 uppercase tracking-tight">Khôi phục mật khẩu</h2>
                    <p className="text-xs text-gray-500 mt-1">Nhập email hệ thống để nhận liên kết xác thực cấu hình lại tài khoản</p>
                </div>

                {successMessage && (
                    <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-xl text-xs font-semibold flex items-start gap-2 animate-fade-in">
                        <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                        <span>{successMessage}</span>
                    </div>
                )}

                {errors.server && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold flex items-start gap-2 animate-fade-in">
                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                        <span>{errors.server}</span>
                    </div>
                )}

                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                    <div>
                        <label className={labelStyle}>Địa chỉ Email đăng ký</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-900 transition-colors">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
                                className={`${inputStyle} ${errors.email ? 'border-red-400 focus:ring-red-200' : ''}`}
                                placeholder="canbo_healthcare@gmail.com"
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.email}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-900 text-white font-bold text-sm rounded-xl shadow-md hover:bg-blue-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                        <span>Gửi mã xác nhận</span>
                    </button>

                    <div className="pt-4 border-t border-gray-100 text-center">
                        <button
                            type="button"
                            disabled={resendLoading}
                            onClick={handleResendVerification}
                            className="text-xs font-bold text-gray-500 hover:text-blue-900 underline transition-colors cursor-pointer disabled:opacity-40"
                        >
                            {resendLoading ? "Đang gửi..." : "Tài khoản chưa xác thực? Gửi lại mail xác minh"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;