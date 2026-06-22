import { useState, useEffect } from 'react';
import axiosClient from "../axios/axiosClient";
import { Trash, SquarePen, X } from "lucide-react";
import ClassActions from "../components/ClassActions";

const ClassesPage = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [formData, setFormData] = useState({ className: '', grade: '', facilityId: '', schoolYear: '' });
    const [errors, setErrors] = useState({});

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get("/master-data/classes");
            setClasses(response.data.content || []);
        } catch (error) {
            console.error("Error fetching classes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchClasses(); }, []);

    const validateField = (name, value) => {
        let error = "";
        if (!value || value.toString().trim() === "") {
            error = "This field is required";
        } else if (name === "grade" && (parseInt(value) < 1 || parseInt(value) > 12)) {
            error = "Grade must be between 1 and 12";
        }
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const updateFormData = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const handleSave = async () => {
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            if (!formData[key]) newErrors[key] = "Required";
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            alert("Please fix the errors in the form!");
            return;
        }

        try {
            if (selectedClass) {
                await axiosClient.put(`/master-data/classes/${selectedClass.id}`, formData);
                alert("Class updated successfully!");
            } else {
                await axiosClient.post("/master-data/classes", formData);
                alert("Class added successfully!");
            }
            setIsModalOpen(false);
            fetchClasses();
        } catch (error) {
            alert("Error saving class information!");
        }
    };

    return (
        <div className="p-6 h-full overflow-y-auto scrollbar-thin">
            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-base font-bold text-gray-900">Class Management</h2>
                    <p className="text-sm text-gray-500">Total: {classes.length} classes</p>
                </div>
                <ClassActions
                    onAdd={() => {
                        setSelectedClass(null);
                        setFormData({ className: '', grade: '', facilityId: '', schoolYear: '' });
                        setErrors({});
                        setIsModalOpen(true);
                    }}
                    onImport={() => alert("Import feature coming soon")}
                    onExport={() => alert("Download template feature coming soon")}
                />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50">
                    <tr className="text-xs font-semibold text-gray-500 uppercase">
                        <th className="px-6 py-4">Class Name</th>
                        <th className="px-4 py-4">Grade</th>
                        <th className="px-4 py-4">Facility ID</th>
                        <th className="px-4 py-4">School Year</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {loading ? (
                        <tr><td colSpan="5" className="text-center py-8 text-gray-500">Loading data...</td></tr>
                    ) : (
                        classes.map((cls) => (
                            <tr key={cls.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900 text-sm">{cls.className}</td>
                                <td className="px-4 py-4 text-sm">{cls.grade}</td>
                                <td className="px-4 py-4 text-sm text-gray-600">{cls.facilityName}</td>
                                <td className="px-4 py-4 text-sm text-gray-600">{cls.schoolYear}</td>
                                <td className="px-6 py-4 text-right flex justify-end gap-3">
                                    <button onClick={() => { setSelectedClass(cls); setFormData(cls); setErrors({}); setIsModalOpen(true); }} className="text-gray-400 hover:text-blue-900 transition-colors"><SquarePen size={18}/></button>
                                    <button className="text-gray-400 hover:text-red-600 transition-colors"><Trash size={18}/></button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-extrabold text-blue-900">
                                {selectedClass ? "Edit Class" : "Add New Class"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                        </div>
                        <div className="space-y-4">
                            {['className', 'grade', 'facilityId', 'schoolYear'].map(field => (
                                <div key={field}>
                                    <label className="block text-sm font-bold text-gray-900 mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                                    <input
                                        className={`w-full p-3 border rounded-lg outline-none focus:ring-2 text-gray-900 placeholder-gray-400 ${errors[field] ? 'border-red-600 ring-2 ring-red-100' : 'border-gray-400 focus:ring-blue-500'}`}
                                        type={field === 'grade' ? 'number' : 'text'}
                                        value={formData[field]}
                                        onChange={(e) => updateFormData(field, e.target.value)}
                                    />
                                    {errors[field] && (
                                        <p className="text-red-700 text-xs mt-1 font-extrabold bg-red-50 p-1 rounded inline-block">
                                            {errors[field]}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button onClick={handleSave} className="w-full mt-8 bg-blue-900 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg active:scale-[0.98]">
                            {selectedClass ? "Update Class" : "Save Class"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassesPage;