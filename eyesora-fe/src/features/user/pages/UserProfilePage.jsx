import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { ArrowLeft, User, Mail, ShieldAlert, ShieldCheck, Activity, Landmark, RefreshCw } from 'lucide-react';
import axiosClient from "../../../shared/axios/axiosClient.js";

const UserProfilePage = () => {
    // State quản lý thông tin người dùng lâm sàng
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch thông tin profile từ endpoint API của bạn
    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            try {
                const response = await axiosClient.get('/admin/users/b3e82f45-8f77-46ae-8ac9-c46c9e24b1fb');
                // Hoặc nếu endpoint động: await axiosClient.get(`/api/admin/users/${currentUserId}`);

                setProfile(response.data);
            } catch (err) {
                console.error("Lỗi khi tải thông tin hồ sơ tài khoản:", err);
                setError("Không thể kết nối dữ liệu tài khoản cá nhân. Vui lòng thử lại sau!");
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const labelStyle = `text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block`;
    const infoBoxStyle = `w-full border border-gray-100 bg-gray-50/50 p-3.5 rounded-xl text-gray-800 font-medium text-sm flex items-center gap-3`;

    if (loading) {
        return (
            <div className="p-6 bg-[#f5f7fa] h-full flex items-center justify-center">
                <div className="flex items-center gap-2 text-gray-500 font-semibold text-sm">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-900" />
                    Đang nạp thông tin hồ sơ...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-[#f5f7fa] h-full flex items-center justify-center">
                <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-xl text-sm font-bold max-w-md text-center">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-[#f5f7fa] h-full overflow-y-auto scrollbar-thin">

            {/* Header đồng bộ layout hệ thống */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                <div className="flex items-center gap-4">
                    {/*<button*/}
                    {/*    onClick={() => navigate('/eye-exam-records')}*/}
                    {/*    className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-blue-900 shadow-sm transition-colors cursor-pointer flex items-center justify-center"*/}
                    {/*>*/}
                    {/*    <ArrowLeft/>*/}
                    {/*</button>*/}
                    <div className="w-16 h-16 rounded-2xl bg-blue-900/10 border border-blue-900/20 flex items-center justify-center text-blue-900 shadow-sm flex-shrink-0">
                        <User className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900">{profile?.fullName || 'Họ tên người dùng'}</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Mã số tài khoản: {profile?.id}</p>
                    </div>
                </div>

                {/* Trạng thái tài khoản */}
                <div className="w-fit">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                        profile?.status === 'ACTIVE'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                        <Activity size={14} />
                        {profile?.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm khóa'}
                    </span>
                </div>
            </div>

            {/* Vùng thông tin chi tiết */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full p-6 md:p-8">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-5">
                    Thông tin tài khoản y tế
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    <div>
                        <label className={labelStyle}>Tên đăng nhập (Username)</label>
                        <div className={infoBoxStyle}>
                            <User size={16} className="text-gray-400" />
                            <span>{profile?.username}</span>
                        </div>
                    </div>
                    <div>
                        <label className={labelStyle}>Địa chỉ Email</label>
                        <div className={infoBoxStyle}>
                            <Mail size={16} className="text-gray-400" />
                            <span>{profile?.email}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    <div>
                        <label className={labelStyle}>Cơ sở lâm sàng trực thuộc</label>
                        <div className={infoBoxStyle}>
                            <Landmark size={16} className="text-gray-400" />
                            <span className={profile?.facilityName === 'N/A' ? 'text-gray-400 italic' : 'text-gray-800'}>
                                {profile?.facilityName === 'N/A' ? 'Không thuộc cơ sở cố định (Trung tâm điều hành)' : profile?.facilityName}
                            </span>
                        </div>
                    </div>

                    {/* Danh sách phân quyền Roles */}
                    <div>
                        <label className={labelStyle}>Quyền hạn hệ thống (Roles)</label>
                        <div className="w-full border border-gray-100 bg-gray-50/50 p-3 rounded-xl flex flex-wrap gap-2 items-center min-h-[46px]">
                            {profile?.roles?.map((role, idx) => {
                                let badgeStyle = "bg-gray-100 text-gray-700 border-gray-200";
                                if (role === 'OWNER') badgeStyle = "bg-purple-50 text-purple-700 border-purple-200";
                                if (role === 'ADMIN') badgeStyle = "bg-blue-50 text-blue-800 border-blue-200";

                                return (
                                    <span key={idx} className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border uppercase tracking-wider ${badgeStyle}`}>
                                        {role}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Phần lưu ý bảo mật phụ */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-start gap-3 bg-blue-50/30 p-4 rounded-xl border border-blue-100/50">
                    <ShieldCheck className="text-blue-900 w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                        <h4 className="text-xs font-bold text-gray-900">Thông báo về quyền tài khoản</h4>
                        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                            Tài khoản của bạn nắm giữ các vai trò quản trị tối cao của hệ thống dữ liệu lâm sàng <strong>REMS Clinical</strong>. Mọi thao tác chỉnh sửa hoặc import danh sách học sinh từ tài khoản này sẽ được ghi nhận trực tiếp vào Nhật ký kiểm toán (Audit Logs). Hãy bảo vệ mật khẩu của bạn định kỳ.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default UserProfilePage;