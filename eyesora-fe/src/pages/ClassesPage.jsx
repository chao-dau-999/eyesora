import { useState, useEffect } from 'react';
import axiosClient from "../axios/axiosClient";
import { Trash, SquarePen, X, ChevronLeft, ChevronRight } from "lucide-react";
import ClassActions from "../components/ClassActions";

const ClassesPage = () => {
    const [classes, setClasses] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageData, setPageData] = useState({ page: 0, totalPages: 0, totalElements: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [formData, setFormData] = useState({ className: '', grade: '', facilityId: '', schoolYear: '' });
    const [errors, setErrors] = useState({});

    const fetchClasses = async (page = 0) => {
        setLoading(true);
        try {
            const response = await axiosClient.get(`/master-data/classes?page=${page}&size=10`);
            setClasses(response.data.content || []);
            setPageData({
                page: response.data.number,
                totalPages: response.data.totalPages,
                totalElements: response.data.totalElements
            });
        } catch (error) { console.error("Error fetching classes:", error); }
        finally { setLoading(false); }
    };

    const openModal = async (cls = null) => {
        const fRes = await axiosClient.get("/master-data/facilities?size=100");
        setFacilities(fRes.data.content || []);

        setSelectedClass(cls);
        setFormData(cls ? { ...cls, grade: String(cls.grade), facilityId: String(cls.facilityId) } : { className: '', grade: '', facilityId: '', schoolYear: '' });
        setErrors({});
        setIsModalOpen(true);
    };

    useEffect(() => { fetchClasses(); }, []);

    const validate = () => {
        let newErrors = {};
        if (!formData.className?.trim()) newErrors.className = "Class name is required";
        const gradeNum = parseInt(formData.grade);
        if (!formData.grade || isNaN(gradeNum) || gradeNum < 1 || gradeNum > 12) newErrors.grade = "Grade must be between 1 and 12";
        if (!formData.facilityId) newErrors.facilityId = "Facility is required";
        if (!formData.schoolYear?.trim()) newErrors.schoolYear = "School year is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        try {
            const dataToSave = { ...formData, grade: parseInt(formData.grade) };
            if (selectedClass) {
                await axiosClient.put(`/master-data/classes/${selectedClass.id}`, dataToSave);
            } else {
                await axiosClient.post("/master-data/classes", dataToSave);
            }
            setIsModalOpen(false);
            fetchClasses(pageData.page);
        } catch (error) { alert("Error saving class!"); }
    };

    return (
        <div className="p-8 h-full bg-gray-50 overflow-y-auto">
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-950">Class Management</h2>
                    <p className="text-sm text-gray-500 mt-1">Total: {pageData.totalElements} classes</p>
                </div>
                <ClassActions onAdd={() => openModal()} />
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs uppercase font-black text-gray-500">
                    <tr>
                        <th className="p-6 w-16">STT</th>
                        <th className="p-6">Class Name</th>
                        <th className="p-6">Grade</th>
                        <th className="p-6">Facility</th>
                        <th className="p-6">School Year</th>
                        <th className="p-6 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {loading ? (
                        <tr><td colSpan="6" className="text-center py-10 text-gray-500 font-bold">Loading...</td></tr>
                    ) : (
                        classes.map((cls, index) => (
                            <tr key={cls.id} className="hover:bg-blue-50/50 transition-colors">
                                <td className="p-6 text-gray-500 font-bold text-sm">{(pageData.page * 10) + index + 1}</td>
                                <td className="p-6 font-bold text-gray-900 text-sm">{cls.className}</td>
                                <td className="p-6 text-gray-600 text-sm">{cls.grade}</td>
                                <td className="p-6 text-sm text-gray-600">{cls.facilityName || 'N/A'}</td>
                                <td className="p-6 text-sm text-gray-600">{cls.schoolYear}</td>
                                <td className="p-6 text-right flex justify-end gap-3">
                                    <button onClick={() => openModal(cls)} className="text-blue-900 hover:text-blue-700 transition-colors"><SquarePen size={20}/></button>
                                    <button className="text-red-600 hover:text-red-800 transition-colors"><Trash size={20}/></button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>

                <div className="flex items-center justify-between px-6 py-5 bg-white border-t border-gray-100">
                    <div className="text-sm font-semibold text-gray-500">Trang <span className="text-blue-900 font-bold">{pageData.page + 1}</span> / {pageData.totalPages || 1}</div>
                    <div className="flex items-center gap-1.5">
                        <button disabled={pageData.page === 0} onClick={() => fetchClasses(pageData.page - 1)} className="flex items-center justify-center w-9 h-9 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-all"><ChevronLeft size={18} className="text-gray-700"/></button>
                        {[...Array(pageData.totalPages)].map((_, i) => {
                            if (i === 0 || i === pageData.totalPages - 1 || (i >= pageData.page - 1 && i <= pageData.page + 1)) return (
                                <button key={i} onClick={() => fetchClasses(i)} className={`w-9 h-9 rounded-lg font-bold text-sm transition-all shadow-sm ${pageData.page === i ? 'bg-blue-900 text-white shadow-blue-200' : 'bg-white border border-gray-200 text-gray-600 hover:bg-blue-50'}`}>{i + 1}</button>
                            );
                            if (i === pageData.page - 2 || i === pageData.page + 2) return <span key={i} className="px-2 text-gray-400 font-bold tracking-widest">...</span>;
                            return null;
                        })}
                        <button disabled={pageData.page >= pageData.totalPages - 1} onClick={() => fetchClasses(pageData.page + 1)} className="flex items-center justify-center w-9 h-9 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-all"><ChevronRight size={18} className="text-gray-700"/></button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-gray-950">{selectedClass ? "Edit Class" : "Create New Class"}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400 hover:text-gray-600"/></button>
                        </div>
                        <div className="space-y-4">
                            {[ {key:'className', label:'Class Name', ph:'ENTER CLASS NAME'}, {key:'grade', label:'Grade Level', ph:'1-12'}, {key:'schoolYear', label:'School Year', ph:'e.g., 2025-2026'} ].map(field => (
                                <div key={field.key}>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase mb-1 ml-1">{field.label}</label>
                                    <input
                                        className={`w-full p-3 border-2 rounded-xl text-gray-950 bg-white placeholder-gray-300 focus:border-blue-900 outline-none transition-all ${errors[field.key] ? 'border-red-500' : 'border-gray-200'}`}
                                        type={field.key === 'grade' ? 'number' : 'text'}
                                        placeholder={field.ph}
                                        value={formData[field.key]}
                                        onChange={e => { setFormData({...formData, [field.key]: e.target.value}); if(errors[field.key]) setErrors({...errors, [field.key]: null}) }}
                                    />
                                    {errors[field.key] && <p className="text-red-600 text-[10px] font-bold mt-1 ml-1">{errors[field.key]}</p>}
                                </div>
                            ))}
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase mb-1 ml-1">Facility</label>
                                <select
                                    className={`w-full p-3 border-2 rounded-xl text-gray-950 bg-white focus:border-blue-900 outline-none transition-all ${errors.facilityId ? 'border-red-500' : 'border-gray-200'}`}
                                    value={formData.facilityId}
                                    onChange={e => { setFormData({...formData, facilityId: e.target.value}); if(errors.facilityId) setErrors({...errors, facilityId: null}) }}
                                >
                                    <option value="">SELECT FACILITY</option>
                                    {facilities.map(f => <option key={f.id} value={String(f.id)}>{f.facilityName}</option>)}
                                </select>
                                {errors.facilityId && <p className="text-red-600 text-[10px] font-bold mt-1 ml-1">{errors.facilityId}</p>}
                            </div>
                        </div>
                        <button onClick={handleSave} className="w-full mt-8 bg-blue-950 text-white py-4 rounded-2xl font-black hover:bg-blue-900 transition-all shadow-lg active:scale-[0.98]">
                            {selectedClass ? "Update Information" : "Save Class"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ClassesPage;