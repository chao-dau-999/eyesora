import {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {ArrowLeft, AlertCircle} from "lucide-react";
import axiosClient from "../../../shared/axios/axiosClient.js";

const PatientFormPage = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        patientName: '', dob: '', gender: 'MALE', parentPhone: '',
        campaignId: '', facilityId: '', classId: '', wardId: '', patientId: null
    });

    const [options, setOptions] = useState({campaigns: [], facilities: [], classes: [], wards: []});
    const [errors, setErrors] = useState({});
    const [pageLoading, setPageLoading] = useState(isEditMode);

    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const [c, f, cl, w] = await Promise.all([
                    axiosClient.get('/campaigns?size=999').catch(() => ({data: []})),
                    axiosClient.get('/master-data/facilities?size=999').catch(() => ({data: []})),
                    axiosClient.get('/master-data/classes?size=999').catch(() => ({data: []})),
                    axiosClient.get('/master-data/wards?size=999').catch(() => ({data: []}))
                ]);

                setOptions({
                    campaigns: c.data.content || c.data || [],
                    facilities: f.data.content || f.data || [],
                    classes: cl.data.content || cl.data || [],
                    wards: w.data.content || w.data || []
                });
            } catch (err) {
                console.error("Lỗi fetch master data:", err);
            }
        };
        fetchMasterData();
    }, []);

    useEffect(() => {
        if (isEditMode) {
            const fetchPatientDetail = async () => {
                try {

                    const res = await axiosClient.get(`/patients/${id}`);
                    const patient = res.data;
                    if (patient) {
                        setFormData({
                            patientName: patient.patientName || '',
                            dob: patient.dob || '',
                            gender: patient.gender || 'MALE',
                            parentPhone: patient.parentPhone || '',
                            campaignId: String(patient.campaignId || ''),
                            facilityId: String(patient.facilityId || ''),
                            classId: String(patient.classId || ''),
                            wardId: String(patient.wardId || ''),
                            patientId: patient.patientId || null
                        });
                    }
                } catch (err) {
                    console.error("Lỗi fetch chi tiết bệnh nhân:", err);
                    setErrors({server: "Không thể tải dữ liệu bệnh nhân này."});
                } finally {
                    setPageLoading(false);
                }
            };
            fetchPatientDetail();
        }
    }, [id, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const payload = {
            patientName: formData.patientName,
            classId: formData.classId,
            dob: formData.dob ? formData.dob : null,
            gender: formData.gender,
            parentPhone: formData.parentPhone ? formData.parentPhone : null,
            campaignId: formData.campaignId,
            facilityId: formData.facilityId,
            wardId: formData.wardId ? formData.wardId : null
        };

        try {
            if (isEditMode) {
                await axiosClient.put(`/patients/${id}`, payload);
            } else {
                await axiosClient.post('/patients', payload);
            }
            navigate('/patients');
        } catch (err) {
            try {
                const errorObj = JSON.parse(err.message);
                setErrors(errorObj);
            } catch (e) {
                setErrors({server: err.response?.data?.message || err.message});
            }
        }
    };

    const inputStyle = `w-full border border-gray-200 bg-white p-3 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all text-sm outline-none`;
    const labelStyle = `text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block`;
    const ErrorMsg = ({field}) => errors[field] ?
        <p className="text-red-500 text-[10px] font-bold mt-1">{errors[field]}</p> : null;

    if (pageLoading) {
        return (
            <div className="p-6 flex items-center justify-center h-full">
                <p className="text-gray-500 font-medium">Đang tải dữ liệu hồ sơ...</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-[#f5f7fa] h-full overflow-y-auto scrollbar-thin">

            <div className="flex items-center gap-3 mb-6 w-full">
                <button
                    onClick={() => navigate('/patients')}
                    className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-blue-900 shadow-sm transition-colors cursor-pointer flex items-center justify-center"
                >
                    <ArrowLeft size={18}/>
                </button>
                <div>
                    <h1 className="text-lg font-bold text-gray-900">
                        {isEditMode ? "Chỉnh sửa hồ sơ học sinh" : "Thêm mới hồ sơ học sinh"}
                    </h1>
                    <p className="text-xs text-gray-500">Quản lý và cập nhật thông tin y tế khúc xạ</p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full p-6 md:p-8">

                {errors.server && (
                    <div
                        className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-bold flex items-center gap-2 w-full">
                        <AlertCircle size={16}/>
                        {errors.server}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelStyle}>Mã bệnh nhân (Mặc định)</label>
                            <input className={`${inputStyle} bg-gray-50 cursor-not-allowed`}
                                   value={formData.patientId || 'Hệ thống tự động tạo'} disabled/>
                        </div>
                        <div>
                            <label className={labelStyle}>Họ và Tên (*)</label>
                            <input className={inputStyle} value={formData.patientName}
                                   onChange={e => setFormData({...formData, patientName: e.target.value})}
                                   placeholder="Nhập họ và tên học sinh"/>
                            <ErrorMsg field="patientName"/>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelStyle}>Số điện thoại phụ huynh</label>
                            <input className={inputStyle} value={formData.parentPhone}
                                   onChange={e => setFormData({...formData, parentPhone: e.target.value})}
                                   placeholder="Ví dụ: 0912345678"/>
                            <ErrorMsg field="parentPhone"/>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className={labelStyle}>Ngày sinh</label>
                                <input className={inputStyle} type="date" value={formData.dob}
                                       onChange={e => setFormData({...formData, dob: e.target.value})}/>
                                <ErrorMsg field="dob"/>
                            </div>
                            <div>
                                <label className={labelStyle}>Giới tính</label>
                                <select className={inputStyle} value={formData.gender}
                                        onChange={e => setFormData({...formData, gender: e.target.value})}>
                                    <option value="MALE">Nam</option>
                                    <option value="FEMALE">Nữ</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-6 pt-4"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelStyle}>Địa chỉ (Phường/Xã)</label>
                            <select className={inputStyle} value={formData.wardId}
                                    onChange={e => setFormData({...formData, wardId: e.target.value})}>
                                <option value="">Chọn Phường/Xã...</option>
                                {options.wards.map(w => <option key={w.id} value={String(w.id)}>{w.wardName}</option>)}
                            </select>
                            <ErrorMsg field="wardId"/>
                        </div>
                        <div>
                            <label className={labelStyle}>Chiến dịch khám (*)</label>
                            <select className={inputStyle} value={formData.campaignId}
                                    onChange={e => setFormData({...formData, campaignId: e.target.value})}>
                                <option value="">Chọn chiến dịch...</option>
                                {options.campaigns.map(i => <option key={i.campaignId}
                                                                    value={String(i.campaignId)}>{i.campaignTitle}</option>)}
                            </select>
                            <ErrorMsg field="campaignId"/>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelStyle}>Cơ sở khám (*)</label>
                            <select className={inputStyle} value={formData.facilityId}
                                    onChange={e => setFormData({...formData, facilityId: e.target.value})}>
                                <option value="">Chọn cơ sở...</option>
                                {options.facilities.map(i => <option key={i.id}
                                                                     value={String(i.id)}>{i.facilityName}</option>)}
                            </select>
                            <ErrorMsg field="facilityId"/>
                        </div>
                        <div>
                            <label className={labelStyle}>Lớp học (*)</label>
                            <select className={inputStyle} value={formData.classId}
                                    onChange={e => setFormData({...formData, classId: e.target.value})}>
                                <option value="">Chọn lớp học...</option>
                                {options.classes.map(i => <option key={i.id}
                                                                  value={String(i.id)}>{i.className}</option>)}
                            </select>
                            <ErrorMsg field="classId"/>
                        </div>
                    </div>

                    {/* Các nút thao tác cuối trang */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-8 w-full">
                        <button
                            type="button"
                            onClick={() => navigate('/patients')}
                            className="px-6 py-2.5 border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all rounded-xl text-sm cursor-pointer"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-2.5 bg-blue-900 text-white font-bold hover:bg-blue-800 active:scale-95 transition-all rounded-xl text-sm shadow-sm cursor-pointer"
                        >
                            Lưu hồ sơ bệnh nhân
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default PatientFormPage;