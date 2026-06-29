import React from 'react';
import { X, Save } from "lucide-react";

const ExamRecordModal = ({ isOpen, onClose, updateForm, handleInputChange, handleConfirmUpdate }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white p-8 rounded-3xl w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <div>
                        <h2 className="text-2xl font-black text-gray-950">Chỉnh sửa hồ sơ khám</h2>
                        <p className="text-sm font-semibold text-blue-900 mt-1">Học sinh: {updateForm.patientName} ({updateForm.className})</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                        <X size={22} className="text-gray-400"/>
                    </button>
                </div>
                <form onSubmit={handleConfirmUpdate} className="space-y-6">
                    <div className="border border-blue-100 rounded-2xl p-5 bg-blue-50/10">
                        <h4 className="text-sm font-black text-blue-900 uppercase tracking-wider mb-4 border-b border-blue-100 pb-2">Mắt Trái (L)</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Thị lực không kính</label>
                                <input type="number" step="0.1" name="vaLeftWithoutGlasses" value={updateForm.vaLeftWithoutGlasses} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl font-semibold text-sm focus:outline-blue-900" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Thị lực có kính</label>
                                <input type="number" step="0.1" name="vaLeftWithGlasses" value={updateForm.vaLeftWithGlasses} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl font-semibold text-sm focus:outline-blue-900" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Độ cầu (Sph L)</label>
                                <input type="number" step="0.25" name="sphLeft" value={updateForm.sphLeft} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl font-semibold text-sm focus:outline-blue-900" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Độ trụ (Cyl L)</label>
                                <input type="number" step="0.25" name="cylLeft" value={updateForm.cylLeft} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl font-semibold text-sm focus:outline-blue-900" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Trục (Axis L)</label>
                                <input type="number" min="0" max="180" name="axisLeft" value={updateForm.axisLeft} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl font-semibold text-sm focus:outline-blue-900" placeholder="0° - 180°" />
                            </div>
                        </div>
                    </div>
                    <div className="border border-green-100 rounded-2xl p-5 bg-green-50/10">
                        <h4 className="text-sm font-black text-green-900 uppercase tracking-wider mb-4 border-b border-green-100 pb-2">Mắt Phải (R)</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Thị lực không kính</label>
                                <input type="number" step="0.1" name="vaRightWithoutGlasses" value={updateForm.vaRightWithoutGlasses} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl font-semibold text-sm focus:outline-green-700" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Thị lực có kính</label>
                                <input type="number" step="0.1" name="vaRightWithGlasses" value={updateForm.vaRightWithGlasses} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl font-semibold text-sm focus:outline-green-700" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Độ cầu (Sph R)</label>
                                <input type="number" step="0.25" name="sphRight" value={updateForm.sphRight} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl font-semibold text-sm focus:outline-green-700" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Độ trụ (Cyl R)</label>
                                <input type="number" step="0.25" name="cylRight" value={updateForm.cylRight} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl font-semibold text-sm focus:outline-green-700" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Trục (Axis R)</label>
                                <input type="number" min="0" max="180" name="axisRight" value={updateForm.axisRight} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl font-semibold text-sm focus:outline-green-700" placeholder="0° - 180°" />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="w-1/2 py-3.5 bg-gray-100 text-gray-700 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all cursor-pointer">Hủy bỏ</button>
                        <button type="submit" className="w-1/2 py-3.5 bg-blue-900 text-white rounded-2xl font-black text-sm hover:bg-blue-950 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 cursor-pointer"><Save size={18}/> Lưu thay đổi</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExamRecordModal;