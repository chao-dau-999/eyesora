import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import axiosClient from "../../../shared/axios/axiosClient.js";

const ExamRecordFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Lấy examId từ URL

    const [updateForm, setUpdateForm] = useState({
        examId: '', patientName: '', className: '', campaignTitle: '',
        vaLeftWithoutGlasses: '', vaLeftWithGlasses: '', sphLeft: '', cylLeft: '', axisLeft: '',
        vaRightWithoutGlasses: '', vaRightWithGlasses: '', sphRight: '', cylRight: '', axisRight: ''
    });

    const [pageLoading, setPageLoading] = useState(true);
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        const fetchRecordDetail = async () => {
            try {
                setPageLoading(true);
                const res = await axiosClient.get(`/eye-exam-records/${id}`);
                const data = res.data;

                setUpdateForm({
                    examId: data.examId || '',
                    patientName: data.patientName || '',
                    className: data.className || '',
                    campaignTitle: data.campaignTitle || '',
                    vaLeftWithoutGlasses: data.vaLeftWithoutGlasses ?? '',
                    vaLeftWithGlasses: data.vaLeftWithGlasses ?? '',
                    sphLeft: data.sphLeft ?? '',
                    cylLeft: data.cylLeft ?? '',
                    axisLeft: data.axisLeft ?? '',
                    vaRightWithoutGlasses: data.vaRightWithoutGlasses ?? '',
                    vaRightWithGlasses: data.vaRightWithGlasses ?? '',
                    sphRight: data.sphRight ?? '',
                    cylRight: data.cylRight ?? '',
                    axisRight: data.axisRight ?? ''
                });
            } catch (error) {
                console.error("Lỗi khi tải thông tin hồ sơ:", error);
                setServerError("Không thể tải thông tin hồ sơ để chỉnh sửa.");
            } finally {
                setPageLoading(false);
            }
        };

        if (id) {
            fetchRecordDetail();
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateForm(prev => ({ ...prev, [name]: value }));
    };

    const handleConfirmUpdate = async (e) => {
        e.preventDefault();
        setServerError('');
        try {
            const cleanedForm = { ...updateForm };
            const numericFields = [
                'vaLeftWithoutGlasses', 'vaLeftWithGlasses', 'sphLeft', 'cylLeft', 'axisLeft',
                'vaRightWithoutGlasses', 'vaRightWithGlasses', 'sphRight', 'cylRight', 'axisRight'
            ];

            numericFields.forEach(field => {
                if (cleanedForm[field] === '') {
                    cleanedForm[field] = null;
                } else if (cleanedForm[field] !== null && cleanedForm[field] !== undefined) {
                    cleanedForm[field] = parseFloat(cleanedForm[field]);
                }
            });

            await axiosClient.put(`/eye-exam-records/edit/${cleanedForm.examId}`, cleanedForm);
            navigate('/eye-exam-records');
        } catch (error) {
            setServerError(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật hồ sơ.");
        }
    };

    const inputStyle = `w-full border border-gray-200 bg-white px-3 py-2.5 rounded-xl font-semibold text-sm focus:outline-none focus:ring-2 transition-all outline-none`;
    const labelStyle = `block text-xs font-bold text-gray-500 uppercase mb-1`;

    if (pageLoading) {
        return <div className="p-6 text-center text-gray-500 font-semibold">Đang tải dữ liệu hồ sơ khám...</div>;
    }

    return (
        <div className="p-6 bg-[#f5f7fa] h-full overflow-y-auto scrollbar-thin text-gray-950">
            <div className="flex items-center gap-3 mb-6 w-full">
                <button type="button" onClick={() => navigate('/eye-exam-records')} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-blue-900 shadow-sm transition-colors cursor-pointer">
                    <ArrowLeft size={18}/>
                </button>
                <div>
                    <h1 className="text-lg font-bold text-gray-900">Chỉnh sửa hồ sơ khám</h1>
                    <p className="text-xs text-blue-900 font-semibold mt-0.5">
                        Học sinh: {updateForm.patientName} ({updateForm.className})
                    </p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full p-6 md:p-8">
                {serverError && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-bold flex items-center gap-2">
                        <AlertCircle size={16}/> {serverError}
                    </div>
                )}

                <form onSubmit={handleConfirmUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        <div className="border border-blue-100 rounded-2xl p-5 bg-blue-50/10">
                            <h4 className="text-sm font-black text-blue-900 uppercase tracking-wider mb-4 border-b border-blue-100 pb-2">Mắt Trái (L)</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelStyle}>Thị lực không kính</label>
                                    <input type="number" step="0.1" name="vaLeftWithoutGlasses" value={updateForm.vaLeftWithoutGlasses} onChange={handleInputChange} className={`${inputStyle} focus:ring-blue-900/20 focus:border-blue-900`} />
                                </div>
                                <div>
                                    <label className={labelStyle}>Thị lực có kính</label>
                                    <input type="number" step="0.1" name="vaLeftWithGlasses" value={updateForm.vaLeftWithGlasses} onChange={handleInputChange} className={`${inputStyle} focus:ring-blue-900/20 focus:border-blue-900`} />
                                </div>
                                <div>
                                    <label className={labelStyle}>Độ cầu (Sph L)</label>
                                    <input type="number" step="0.25" name="sphLeft" value={updateForm.sphLeft} onChange={handleInputChange} className={`${inputStyle} focus:ring-blue-900/20 focus:border-blue-900`} />
                                </div>
                                <div>
                                    <label className={labelStyle}>Độ trụ (Cyl L)</label>
                                    <input type="number" step="0.25" name="cylLeft" value={updateForm.cylLeft} onChange={handleInputChange} className={`${inputStyle} focus:ring-blue-900/20 focus:border-blue-900`} />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className={labelStyle}>Trục (Axis L)</label>
                                    <input type="number" min="0" max="180" name="axisLeft" value={updateForm.axisLeft} onChange={handleInputChange} className={`${inputStyle} focus:ring-blue-900/20 focus:border-blue-900`} placeholder="0° - 180°" />
                                </div>
                            </div>
                        </div>

                        <div className="border border-green-100 rounded-2xl p-5 bg-green-50/10">
                            <h4 className="text-sm font-black text-green-900 uppercase tracking-wider mb-4 border-b border-green-100 pb-2">Mắt Phải (R)</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelStyle}>Thị lực không kính</label>
                                    <input type="number" step="0.1" name="vaRightWithoutGlasses" value={updateForm.vaRightWithoutGlasses} onChange={handleInputChange} className={`${inputStyle} focus:ring-green-700/20 focus:border-green-700`} />
                                </div>
                                <div>
                                    <label className={labelStyle}>Thị lực có kính</label>
                                    <input type="number" step="0.1" name="vaRightWithGlasses" value={updateForm.vaRightWithGlasses} onChange={handleInputChange} className={`${inputStyle} focus:ring-green-700/20 focus:border-green-700`} />
                                </div>
                                <div>
                                    <label className={labelStyle}>Độ cầu (Sph R)</label>
                                    <input type="number" step="0.25" name="sphRight" value={updateForm.sphRight} onChange={handleInputChange} className={`${inputStyle} focus:ring-green-700/20 focus:border-green-700`} />
                                </div>
                                <div>
                                    <label className={labelStyle}>Độ trụ (Cyl R)</label>
                                    <input type="number" step="0.25" name="cylRight" value={updateForm.cylRight} onChange={handleInputChange} className={`${inputStyle} focus:ring-green-700/20 focus:border-green-700`} />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className={labelStyle}>Trục (Axis R)</label>
                                    <input type="number" min="0" max="180" name="axisRight" value={updateForm.axisRight} onChange={handleInputChange} className={`${inputStyle} focus:ring-green-700/20 focus:border-green-700`} placeholder="0° - 180°" />
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-8">
                        <button type="button" onClick={() => navigate('/eye-exam-records')} className="px-6 py-2.5 border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all rounded-xl text-sm cursor-pointer">
                            Hủy bỏ
                        </button>
                        <button type="submit" className="px-8 py-2.5 bg-blue-900 text-white font-bold hover:bg-blue-800 transition-all rounded-xl text-sm shadow-sm flex items-center gap-2 cursor-pointer">
                            <Save size={16}/> Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExamRecordFormPage;