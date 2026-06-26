import { useState, useEffect } from 'react';
import { X, AlertCircle } from "lucide-react";
import axiosClient from "../../../shared/axios/axiosClient.js";

const PatientFormModal = ({ patient, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        patientName: '', dob: '', gender: 'MALE', parentPhone: '',
        campaignId: '', facilityId: '', classId: '', patientId: null
    });

    const [options, setOptions] = useState({ campaigns: [], facilities: [], classes: [] });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [c, f, cl] = await Promise.all([
                    axiosClient.get('/campaigns?size=999').catch(() => ({ data: [] })),
                    axiosClient.get('/master-data/facilities?size=999').catch(() => ({ data: [] })),
                    axiosClient.get('/master-data/classes?size=999').catch(() => ({ data: [] }))
                ]);
                setOptions({
                    campaigns: c.data.content || c.data || [],
                    facilities: f.data.content || f.data || [],
                    classes: cl.data.content || cl.data || []
                });
            } catch (err) { console.error("Lỗi fetch:", err); }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (patient) {
            setFormData({
                patientName: patient.patientName || '',
                dob: patient.dob || '',
                gender: patient.gender || 'MALE',
                parentPhone: patient.parentPhone || '',
                campaignId: String(patient.campaignId || ''),
                facilityId: String(patient.facilityId || ''),
                classId: String(patient.classId || ''),
                patientId: patient.patientId || null
            });
        }
    }, [patient]);

    const handleSubmit = async () => {
        setErrors({});
        const payload = {
            patientName: formData.patientName,
            classId: formData.classId,
            dob: formData.dob,
            gender: formData.gender,
            parentPhone: formData.parentPhone,
            campaignId: formData.campaignId,
            facilityId: formData.facilityId
        };

        try {
            await onSave(payload);
        } catch (err) {
            try {
                const errorObj = JSON.parse(err.message);
                setErrors(errorObj);
            } catch (e) {
                setErrors({ server: err.message });
            }
        }
    };

    const inputStyle = `w-full border-2 p-3 rounded-xl bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`;
    const labelStyle = `text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block`;
    const ErrorMsg = ({ field }) => errors[field] ? <p className="text-red-500 text-[10px] font-bold mt-1">{errors[field]}</p> : null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-7">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-xl text-slate-900">{patient ? "Chỉnh sửa" : "Thêm mới"}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full"><X size={20}/></button>
                </div>

                {errors.server && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-bold flex items-center gap-2"><AlertCircle size={16}/>{errors.server}</div>}

                <div className="space-y-4">
                    <div>
                        <label className={labelStyle}>Mã bệnh nhân</label>
                        <input className={`${inputStyle} bg-slate-50`} value={formData.patientId || 'Tự động tạo'} disabled />
                    </div>
                    <div>
                        <label className={labelStyle}>Họ và Tên (*)</label>
                        <input className={inputStyle} value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} />
                        <ErrorMsg field="patientName" />
                    </div>
                    <div>
                        <label className={labelStyle}>Số điện thoại (*)</label>
                        <input className={inputStyle} value={formData.parentPhone} onChange={e => setFormData({...formData, parentPhone: e.target.value})} />
                        <ErrorMsg field="parentPhone" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelStyle}>Ngày sinh (*)</label>
                            <input className={inputStyle} type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                            <ErrorMsg field="dob" />
                        </div>
                        <div>
                            <label className={labelStyle}>Giới tính</label>
                            <select className={inputStyle} value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                                <option value="MALE">Nam</option>
                                <option value="FEMALE">Nữ</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className={labelStyle}>Chiến dịch (*)</label>
                        <select className={inputStyle} value={formData.campaignId} onChange={e => setFormData({...formData, campaignId: e.target.value})}>
                            <option value="">Chọn...</option>
                            {options.campaigns.map(i => <option key={i.campaignId} value={String(i.campaignId)}>{i.campaignTitle}</option>)}
                        </select>
                        <ErrorMsg field="campaignId" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelStyle}>Cơ sở (*)</label>
                            <select className={inputStyle} value={formData.facilityId} onChange={e => setFormData({...formData, facilityId: e.target.value})}>
                                <option value="">Chọn...</option>
                                {options.facilities.map(i => <option key={i.id} value={String(i.id)}>{i.facilityName}</option>)}
                            </select>
                            <ErrorMsg field="facilityId" />
                        </div>
                        <div>
                            <label className={labelStyle}>Lớp (*)</label>
                            <select className={inputStyle} value={formData.classId} onChange={e => setFormData({...formData, classId: e.target.value})}>
                                <option value="">Chọn...</option>
                                {options.classes.map(i => <option key={i.id} value={String(i.id)}>{i.className}</option>)}
                            </select>
                            <ErrorMsg field="classId" />
                        </div>
                    </div>
                </div>

                <button onClick={handleSubmit} className="w-full mt-8 bg-blue-900 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-all">
                    Lưu thông tin
                </button>
            </div>
        </div>
    );
};
export default PatientFormModal;