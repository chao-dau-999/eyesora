import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from "lucide-react";
import axiosClient from "../../../shared/axios/axiosClient.js";

const UserFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        username: '', password: '', email: '', fullName: '', facilityId: '', roleNames: []
    });
    const [options, setOptions] = useState({ facilities: [] });
    const [errors, setErrors] = useState({});
    const [pageLoading, setPageLoading] = useState(isEditMode);

    const availableRoles = [
        { id: 'OWNER', name: 'OWNER' },
        { id: 'USER', name: 'USER' },
        { id: 'ADMIN', name: 'Quản trị viên' }
    ];

    const ErrorMsg = ({ field }) => errors[field] ? (
        <div className="flex items-center gap-1 mt-1.5 text-red-600">
            <AlertCircle size={14} />
            <span className="text-[11px] font-bold">{errors[field]}</span>
        </div>
    ) : null;

    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const res = await axiosClient.get('/master-data/facilities?size=999');
                setOptions({ facilities: res.data.content || res.data || [] });
            } catch (err) { console.error(err); }
        };
        fetchMasterData();
    }, []);

    useEffect(() => {
        if (isEditMode) {
            const fetchUser = async () => {
                try {
                    const res = await axiosClient.get(`/admin/users/${id}`);
                    const user = res.data;
                    setFormData({
                        username: user.username,
                        email: user.email,
                        fullName: user.fullName,
                        facilityId: user.facilityId ? String(user.facilityId) : '',
                        roleNames: user.roles || []
                    });
                } catch (err) {
                    setErrors({ server: "Không thể tải dữ liệu người dùng." });
                } finally {
                    setPageLoading(false);
                }
            };
            fetchUser();
        }
    }, [id, isEditMode]);

    const handleRoleChange = (roleId) => {
        setFormData(prev => {
            const currentRoles = prev.roleNames || [];
            const newRoles = currentRoles.includes(roleId)
                ? currentRoles.filter(r => r !== roleId)
                : [...currentRoles, roleId];
            return { ...prev, roleNames: newRoles };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        let newErrors = {};
        if (!formData.username?.trim()) newErrors.username = "Tên đăng nhập là bắt buộc";
        if (!isEditMode && !formData.password) newErrors.password = "Mật khẩu là bắt buộc";
        if (!formData.fullName?.trim()) newErrors.fullName = "Họ và tên là bắt buộc";
        if (!formData.email?.trim()) newErrors.email = "Email là bắt buộc";
        if (formData.roleNames.length === 0) newErrors.roleNames = "Vui lòng chọn ít nhất một vai trò";

        // Logic khớp với Backend: Chỉ cần cơ sở nếu KHÔNG PHẢI là ADMIN, EXAMINER hoặc OWNER
        const needsFacility = formData.roleNames.some(
            role => role !== 'ADMIN' && role !== 'OWNER' && role !== 'EXAMINER'
        );

        if (needsFacility && !formData.facilityId) {
            newErrors.facilityId = "Tài khoản này yêu cầu cơ sở quản lý, vui lòng chọn cơ sở!";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            if (isEditMode) {
                await axiosClient.put(`/admin/users/${id}`, formData);
            } else {
                await axiosClient.post('/admin/users/create', formData);
            }
            navigate('/admin/users');
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ server: err.response?.data?.message || "Thao tác thất bại." });
            }
        }
    };

    const inputStyle = `w-full border border-gray-200 bg-white p-3 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all text-sm outline-none`;
    const labelStyle = `text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block`;

    if (pageLoading) return <div className="p-6 text-center">Đang tải...</div>;

    return (
        <div className="p-6 bg-[#f5f7fa] h-full overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate('/admin/users')} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-blue-900 shadow-sm transition-colors">
                    <ArrowLeft size={18}/>
                </button>
                <h1 className="text-lg font-bold text-gray-900">{isEditMode ? "Chỉnh sửa tài khoản" : "Tạo tài khoản mới"}</h1>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 max-w-2xl">
                {errors.server && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2"><AlertCircle size={16}/> {errors.server}</div>}

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelStyle}>Tên đăng nhập (*)</label>
                            <input className={`${inputStyle} ${errors.username ? 'border-red-500' : ''} ${isEditMode ? 'bg-gray-50' : ''}`} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} disabled={isEditMode} />
                            <ErrorMsg field="username" />
                        </div>
                        {!isEditMode && (
                            <div>
                                <label className={labelStyle}>Mật khẩu (*)</label>
                                <input className={`${inputStyle} ${errors.password ? 'border-red-500' : ''}`} type="password" onChange={e => setFormData({...formData, password: e.target.value})} />
                                <ErrorMsg field="password" />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelStyle}>Họ và Tên (*)</label>
                            <input className={`${inputStyle} ${errors.fullName ? 'border-red-500' : ''}`} value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                            <ErrorMsg field="fullName" />
                        </div>
                        <div>
                            <label className={labelStyle}>Email (*)</label>
                            <input className={`${inputStyle} ${errors.email ? 'border-red-500' : ''}`} type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            <ErrorMsg field="email" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelStyle}>Vai trò (*)</label>
                            <div className="grid grid-cols-1 gap-2 mt-2">
                                {availableRoles.map(role => (
                                    <label key={role.id} className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={formData.roleNames.includes(role.id)} onChange={() => handleRoleChange(role.id)} className="accent-blue-900" />
                                        <span className="text-sm text-slate-700">{role.name}</span>
                                    </label>
                                ))}
                            </div>
                            <ErrorMsg field="roleNames" />
                        </div>
                        <div>
                            <label className={labelStyle}>Cơ sở</label>
                            <select className={`${inputStyle} ${errors.facilityId ? 'border-red-500' : ''}`} value={formData.facilityId} onChange={e => setFormData({...formData, facilityId: e.target.value})}>
                                <option value="">Chọn cơ sở...</option>
                                {options.facilities.map(f => <option key={f.id} value={f.id}>{f.facilityName}</option>)}
                            </select>
                            <ErrorMsg field="facilityId" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t mt-8">
                        <button type="button" onClick={() => navigate('/admin/users')} className="px-6 py-2.5 border rounded-xl text-sm font-bold">Hủy</button>
                        <button type="submit" className="px-8 py-2.5 bg-blue-900 text-white rounded-xl text-sm font-bold shadow-sm">Lưu</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default UserFormPage;