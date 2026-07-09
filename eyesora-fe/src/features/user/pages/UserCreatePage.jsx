import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, Shield, Landmark, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import axiosClient from "../../../shared/axios/axiosClient.js";

const UserCreatePage = () => {
    const navigate = useNavigate();

    // 1. State form lưu trữ dữ liệu khớp 100% Request Body của API
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        fullName: '',
        roleNames: [], // Mảng chứa các chuỗi tên quyền (e.g. ['ADMIN'])
        facilityId: ''
    });

    // State phục vụ danh mục dữ liệu tải từ Master Data
    const [options, setOptions] = useState({ roles: [], facilities: [] });
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    // 2. Tải danh mục Quyền và Cơ sở từ hệ thống
    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const [rRes, fRes] = await Promise.all([
                    axiosClient.get('/roles?size=999').catch(() => ({ data: [] })), // Thay bằng endpoint Role thực tế
                    axiosClient.get('/master-data/facilities?size=999').catch(() => ({ data: [] }))
                ]);
                setOptions({
                    roles: rRes.data.content || rRes.data || [],
                    facilities: fRes.data.content || fRes.data || []
                });
            } catch (err) {
                console.error("Lỗi khi tải danh mục:", err);
                setErrors({ server: "Không thể nạp danh mục cấu hình hệ thống." });
            } finally {
                setPageLoading(false);
            }
        };
        fetchMasterData();
    }, []);

    // 3. Logic kiểm tra xem các quyền đang tích chọn có yêu cầu Cơ sở quản lý hay không
    // Đồng bộ hoàn toàn logic: !role.equalsIgnoreCase("ADMIN") && !EXAMINER && !OWNER
    const checkIfNeedsFacility = (selectedRoles) => {
        if (selectedRoles.length === 0) return false;
        return selectedRoles.some(roleName => {
            const name = roleName.toUpperCase();
            return name !== 'ADMIN' && name !== 'EXAMINER' && name !== 'OWNER';
        });
    };

    const needsFacility = checkIfNeedsFacility(formData.roleNames);

    // Xử lý khi Admin chọn/bỏ chọn checkbox của danh sách Roles
    const handleRoleCheckboxChange = (roleName) => {
        setSuccess(false);
        let updatedRoles = [...formData.roleNames];
        if (updatedRoles.includes(roleName)) {
            updatedRoles = updatedRoles.filter(r => r !== roleName);
        } else {
            updatedRoles.push(roleName);
        }

        // Cập nhật state roles đồng thời reset facilityId về rỗng nếu các quyền mới không cần cơ sở
        const nextNeedsFacility = checkIfNeedsFacility(updatedRoles);
        setFormData(prev => ({
            ...prev,
            roleNames: updatedRoles,
            facilityId: nextNeedsFacility ? prev.facilityId : ''
        }));
    };

    // 4. Gửi dữ liệu tạo tài khoản lên API
    const handleCreateUserSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccess(false);

        // Kiểm tra nhanh ở Client
        let localErrors = {};
        if (!formData.username.trim()) localErrors.username = "Vui lòng nhập tên đăng nhập";
        if (!formData.password || formData.password.length < 6) localErrors.password = "Mật khẩu bắt buộc và từ 6 ký tự";
        if (!formData.fullName.trim()) localErrors.fullName = "Vui lòng nhập họ và tên";
        if (formData.roleNames.length === 0) localErrors.roleNames = "Vui lòng chỉ định ít nhất 1 quyền";
        if (needsFacility && !formData.facilityId) localErrors.facilityId = "Tài khoản này bắt buộc phải chọn Cơ sở quản lý";

        if (Object.keys(localErrors).length > 0) {
            setErrors(localErrors);
            return;
        }

        setLoading(true);

        // Đóng gói payload chuẩn JSON gởi lên API
        const payload = {
            username: formData.username.trim(),
            password: formData.password,
            email: formData.email.trim(),
            fullName: formData.fullName.trim(),
            roleNames: formData.roleNames,
            facilityId: needsFacility ? formData.facilityId : null // Nếu không cần cơ sở, truyền lên null giống Backend xử lý
        };

        try {
            await axiosClient.post('/api/admin/users', payload);
            setSuccess(true);
            // Reset toàn bộ Form về trạng thái trống
            setFormData({ username: '', password: '', email: '', fullName: '', roleNames: [], facilityId: '' });
        } catch (err) {
            try {
                // Xử lý lỗi validation từ Exception Handler của Spring Boot (nếu trả về chuỗi JSON lỗi)
                const errorObj = JSON.parse(err.message);
                setErrors(errorObj);
            } catch (e) {
                setErrors({ server: err.response?.data?.message || "Tên đăng nhập đã tồn tại hoặc dữ liệu không hợp lệ!" });
            }
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = `w-full border border-gray-200 bg-white p-3 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all text-sm outline-none`;
    const labelStyle = `text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block`;

    if (pageLoading) {
        return (
            <div className="p-6 bg-[#f5f7fa] h-full flex items-center justify-center">
                <p className="text-gray-500 font-semibold text-sm flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-900" /> Đang tải danh mục phân quyền...
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-[#f5f7fa] h-full overflow-y-auto scrollbar-thin">

            {/* Header Page */}
            <div className="flex items-center gap-3 mb-6 w-full">
                <button
                    onClick={() => navigate('/admin/users')}
                    className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-blue-900 shadow-sm transition-colors cursor-pointer flex items-center justify-center"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="text-lg font-bold text-gray-900">Thêm mới tài khoản hệ thống</h1>
                    <p className="text-xs text-gray-500">Cấp tài khoản cho cán bộ quản trị hoặc kỹ thuật viên lâm sàng</p>
                </div>
            </div>

            {/* Form Container */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full p-6 md:p-8">

                {success && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm font-bold flex items-center gap-2 animate-fade-in">
                        <CheckCircle2 size={18}/> Tài khoản nhân viên đã được khởi tạo thành công!
                    </div>
                )}

                {errors.server && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-bold flex items-center gap-2">
                        <AlertCircle size={16}/> {errors.server}
                    </div>
                )}

                <form onSubmit={handleCreateUserSubmit} className="space-y-5 w-full">

                    {/* Hàng 1: Tài khoản & Mật khẩu */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelStyle}>Tên đăng nhập / Username (*)</label>
                            <input
                                className={inputStyle}
                                value={formData.username}
                                name="username"
                                onChange={handleChange}
                                placeholder="Ví dụ: bacsi_an_rems"
                            />
                            {errors.username && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.username}</p>}
                        </div>
                        <div>
                            <label className={labelStyle}>Mật khẩu ban đầu (*)</label>
                            <input
                                type="password"
                                className={inputStyle}
                                value={formData.password}
                                name="password"
                                onChange={handleChange}
                                placeholder="Tối thiểu 6 ký tự"
                            />
                            {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.password}</p>}
                        </div>
                    </div>

                    {/* Hàng 2: Họ tên & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelStyle}>Họ và Tên Cán Bộ (*)</label>
                            <input
                                className={inputStyle}
                                value={formData.fullName}
                                name="fullName"
                                onChange={handleChange}
                                placeholder="Nhập tên đầy đủ có dấu"
                            />
                            {errors.fullName && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.fullName}</p>}
                        </div>
                        <div>
                            <label className={labelStyle}>Địa chỉ Email</label>
                            <input
                                type="email"
                                className={inputStyle}
                                value={formData.email}
                                name="email"
                                onChange={handleChange}
                                placeholder="canbo@gmail.com (Không bắt buộc)"
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-6 pt-4"></div>

                    {/* Hàng 3: Phân nhóm Chọn Quyền hạn (Roles) */}
                    <div>
                        <label className={labelStyle}>Chọn Quyền hạn / Vai trò hệ thống (*)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border border-gray-100 bg-gray-50/50 rounded-xl">
                            {options.roles.map((role) => (
                                <label key={role.id || role.name} className="flex items-center space-x-3 p-2 bg-white border border-gray-100 rounded-lg shadow-inner cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={formData.roleNames.includes(role.name)}
                                        onChange={() => handleRoleCheckboxChange(role.name)}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900/20 transition-colors"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">{role.name}</span>
                                        <span className="text-[10px] text-gray-400 truncate max-w-[120px]">{role.description || 'Quyền thao tác'}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                        {errors.roleNames && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.roleNames}</p>}
                    </div>

                    {/* Hàng 4: Chọn Cơ sở - Tự động hiển thị/bắt buộc dựa trên Roles */}
                    <div className="transition-all duration-300">
                        <label className={`${labelStyle} ${needsFacility ? 'text-blue-900 font-extrabold' : 'text-gray-400'}`}>
                            Cơ sở y tế / Trường học quản lý {needsFacility ? "(* Bắt buộc)" : "(Không áp dụng)"}
                        </label>
                        <select
                            className={`${inputStyle} ${!needsFacility ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'bg-white'}`}
                            value={formData.facilityId}
                            disabled={!needsFacility}
                            onChange={e => setFormData({ ...formData, facilityId: e.target.value })}
                        >
                            <option value="">{needsFacility ? "--- Vui lòng chọn cơ sở quản lý học sinh ---" : "Tài khoản Tổng cục / Toàn hệ thống (Không cần chọn cơ sở)"}</option>
                            {options.facilities.map(f => (
                                <option key={f.id} value={String(f.id)}>{f.facilityName}</option>
                            ))}
                        </select>
                        {needsFacility && errors.facilityId && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.facilityId}</p>}
                    </div>

                    {/* Các nút lệnh cuối form */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-8 w-full">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/users')}
                            className="px-6 py-2.5 border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all rounded-xl text-sm cursor-pointer"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-2.5 bg-blue-900 text-white font-bold hover:bg-blue-800 active:scale-95 transition-all rounded-xl text-sm shadow-sm cursor-pointer flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                            Khởi tạo tài khoản
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserCreatePage;