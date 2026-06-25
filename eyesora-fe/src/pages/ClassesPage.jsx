import { useState, useEffect } from 'react';
import axiosClient from "../axios/axiosClient";
import { Trash, SquarePen, X, Users, ChevronLeft, ChevronRight } from "lucide-react";
import ClassActions from "../components/ClassActions";

const ClassesPage = () => {
    const [classes, setClasses] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageData, setPageData] = useState({ page: 0, totalPages: 0, totalElements: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedClassDetail, setSelectedClassDetail] = useState(null);
    const [pageDetail, setPageDetail] = useState({ page: 0, totalPages: 0 });

    const [formData, setFormData] = useState({ className: '', grade: '', facilityId: '', schoolYear: '' });

    const renderPagination = (currentPage, totalPages, onPageChange) => (
        <div className="flex items-center gap-1">
            <button
                disabled={currentPage === 0}
                onClick={() => onPageChange(currentPage - 1)}
                className="flex items-center justify-center w-9 h-9 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft size={16}/>
            </button>


            {[...Array(totalPages)].map((_, i) => {
                if (i === 0 || i === totalPages - 1 || (i >= currentPage - 1 && i <= currentPage + 1)) {
                    return (
                        <button
                            key={i}
                            onClick={() => onPageChange(i)}
                            className={`w-9 h-9 rounded-lg font-bold text-xs transition-all ${
                                currentPage === i
                                    ? 'bg-blue-900 text-white shadow-lg shadow-blue-200'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {i + 1}
                        </button>
                    );
                }
                if (i === currentPage - 2 || i === currentPage + 2) {
                    return <span key={i} className="px-2 text-gray-400 font-bold select-none">...</span>;
                }
                return null;
            })}
            <button
                disabled={currentPage >= totalPages - 1}
                onClick={() => onPageChange(currentPage + 1)}
                className="flex items-center justify-center w-9 h-9 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <ChevronRight size={16}/>
            </button>
        </div>
    );

    const fetchClasses = async (page = 0) => {
        setLoading(true);
        try {
            const response = await axiosClient.get(`/master-data/classes?page=${page}&size=10`);
            setClasses(response.data.content || []);
            setPageData({ page: response.data.number, totalPages: response.data.totalPages, totalElements: response.data.totalElements });
        } catch (error) { console.error("Error fetching classes:", error); }
        finally { setLoading(false); }
    };

    const openModal = async (cls = null) => {
        const fRes = await axiosClient.get("/master-data/facilities?size=100");
        setFacilities(fRes.data.content || []);
        setSelectedClass(cls);
        setFormData(cls ? { ...cls, grade: String(cls.grade), facilityId: String(cls.facilityId) } : { className: '', grade: '', facilityId: '', schoolYear: '' });
        setIsModalOpen(true);
    };

    const openDetailModal = async (cls, page = 0) => {
        try {
            const res = await axiosClient.get(`/master-data/classes/${cls.id}/patients?page=${page}&size=10`);
            setSelectedClassDetail({
                ...res.data,
                patients: res.data.patients.content
            });
            setPageDetail({ page: res.data.patients.number, totalPages: res.data.patients.totalPages });
            setIsDetailModalOpen(true);
            setSelectedClass(cls);
        } catch (error) { alert("Error loading class details!"); }
    };

    useEffect(() => { fetchClasses(); }, []);

    const handleSave = async () => {
        try {
            const dataToSave = { ...formData, grade: parseInt(formData.grade) };
            if (selectedClass) await axiosClient.put(`/master-data/classes/${selectedClass.id}`, dataToSave);
            else await axiosClient.post("/master-data/classes", dataToSave);
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
                        <th className="p-6 w-16">STT</th><th className="p-6">Class Name</th><th className="p-6">Grade</th><th className="p-6">Patients</th><th className="p-6">Facility</th><th className="p-6">School Year</th><th className="p-6 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {loading ? (<tr><td colSpan="7" className="text-center py-10 text-gray-500 font-bold">Loading...</td></tr>) : (
                        classes.map((cls, index) => (
                            <tr key={cls.id} className="hover:bg-blue-50/50 transition-colors">
                                <td className="p-6 text-gray-500 font-bold text-sm">{(pageData.page * 10) + index + 1}</td>
                                <td className="p-6 font-bold text-gray-900 text-sm">{cls.className}</td>
                                <td className="p-6 text-gray-600 text-sm">{cls.grade}</td>
                                <td className="p-6 font-bold text-blue-900 text-sm">{cls.patientCount || 0}</td>
                                <td className="p-6 text-sm text-gray-600">{cls.facilityName || 'N/A'}</td>
                                <td className="p-6 text-sm text-gray-600">{cls.schoolYear}</td>
                                <td className="p-6 text-right flex justify-end gap-3">
                                    <button onClick={() => openDetailModal(cls)} className="text-green-600 hover:text-green-800 transition-colors"><Users size={20}/></button>
                                    <button onClick={() => openModal(cls)} className="text-blue-900 hover:text-blue-700 transition-colors"><SquarePen size={20}/></button>
                                    <button className="text-red-600 hover:text-red-800 transition-colors"><Trash size={20}/></button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
                <div className="flex items-center justify-between px-6 py-5 bg-white border-t border-gray-100">
                    <div className="text-sm font-semibold text-gray-500">Trang {pageData.page + 1} / {pageData.totalPages || 1}</div>
                    {renderPagination(pageData.page, pageData.totalPages, fetchClasses)}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-black mb-6">{selectedClass ? "Edit Class" : "Create New Class"}</h3>
                        <div className="space-y-4">
                            {[ {key:'className', label:'Class Name', ph:'ENTER CLASS NAME'}, {key:'grade', label:'Grade Level', ph:'1-12'}, {key:'schoolYear', label:'School Year', ph:'e.g., 2025-2026'} ].map(field => (
                                <div key={field.key}>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase mb-1 ml-1">{field.label}</label>
                                    <input className="w-full p-3 border-2 rounded-xl" type={field.key === 'grade' ? 'number' : 'text'} placeholder={field.ph} value={formData[field.key]} onChange={e => setFormData({...formData, [field.key]: e.target.value})} />
                                </div>
                            ))}
                            <select className="w-full p-3 border-2 rounded-xl" value={formData.facilityId} onChange={e => setFormData({...formData, facilityId: e.target.value})}>
                                <option value="">SELECT FACILITY</option>
                                {facilities.map(f => <option key={f.id} value={String(f.id)}>{f.facilityName}</option>)}
                            </select>
                        </div>
                        <button onClick={handleSave} className="w-full mt-8 bg-blue-950 text-white py-4 rounded-2xl font-black">Save</button>
                    </div>
                </div>
            )}

            {isDetailModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-2xl shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <div><h3 className="text-xl font-black text-gray-950">{selectedClassDetail.className}</h3><p className="text-sm font-bold text-blue-900">{selectedClassDetail.patientCount} Patients</p></div>
                            <button onClick={() => setIsDetailModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="text-gray-500"/></button>
                        </div>
                        <div className="overflow-y-auto flex-1 pr-2">
                            <table className="w-full text-left text-sm">
                                <thead className="sticky top-0 bg-white border-b border-gray-100">
                                <tr className="text-gray-400 uppercase text-[10px] font-black tracking-widest"><th className="pb-3 pl-2">Name</th><th className="pb-3">DOB</th><th className="pb-3">Ward</th></tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                {selectedClassDetail.patients.map((p, idx) => (
                                    <tr key={p.patientId} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}>
                                        <td className="py-4 pl-2 font-bold text-gray-900">{p.patientName}</td>
                                        <td className="py-4 text-gray-600">{p.dob}</td>
                                        <td className="py-4 text-gray-600 italic">{p.wardName || 'N/A'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 pt-4 border-t flex justify-between items-center">
                            <span className="text-xs font-black text-gray-400">Trang {pageDetail.page + 1} / {pageDetail.totalPages}</span>
                            {renderPagination(pageDetail.page, pageDetail.totalPages, (p) => openDetailModal(selectedClass, p))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ClassesPage;