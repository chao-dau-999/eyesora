import { useState, useEffect } from 'react';
import axiosClient from "../../../shared/axios/axiosClient.js";
import ClassActions from "../components/ClassActions.jsx";
import ClassTable from "../components/ClassTable.jsx";
import ClassModal from "../components/ClassModal.jsx";
import ClassDetailModal from "../components/ClassDetailModal.jsx";
import Pagination from "../../../shared/components/Pagination.jsx";

const ClassesPage = () => {
    const [classes, setClasses] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageData, setPageData] = useState({ page: 0, totalPages: 0, totalElements: 0 });
    const [errors, setErrors] = useState({});

    const [modals, setModals] = useState({ edit: false, detail: false });
    const [selectedClass, setSelectedClass] = useState(null);
    const [detailData, setDetailData] = useState(null);
    const [formData, setFormData] = useState({ className: '', grade: '', facilityId: '', schoolYear: '' });

    useEffect(() => { fetchClasses(); }, []);

    const fetchClasses = async (page = 0) => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`/master-data/classes?page=${page}&size=10`);
            setClasses(res.data.content || []);
            setPageData({
                page: res.data.number,
                totalPages: res.data.totalPages,
                totalElements: res.data.totalElements
            });
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const openModal = async (cls = null) => {
        const fRes = await axiosClient.get("/master-data/facilities?size=100");
        const facilityList = fRes.data.content || [];
        setFacilities(facilityList);
        setSelectedClass(cls);

        const foundFacility = facilityList.find(f => f.facilityName === cls?.facilityName);

        setFormData(cls ? {
            className: cls.className || '',
            grade: String(cls.grade || ''),
            facilityId: foundFacility ? String(foundFacility.id) : '',
            schoolYear: cls.schoolYear || ''
        } : { className: '', grade: '', facilityId: '', schoolYear: '' });

        setModals(prev => ({ ...prev, edit: true }));
    };

    const openDetailModal = async (cls, page = 0) => {
        try {
            const res = await axiosClient.get(`/master-data/classes/${cls.id}/patients?page=${page}&size=10`);
            setDetailData({
                ...res.data,
                patients: res.data.patients.content,
                classInfo: cls,
                number: res.data.patients.number,
                totalPages: res.data.patients.totalPages
            });
            setModals(prev => ({ ...prev, detail: true }));
        } catch (error) { alert("Error loading details!"); }
    };

    const handleSave = async () => {
        setErrors({});
        let newErrors = {};
        if (!formData.className || formData.className.trim() === '') newErrors.className = "Class Name is required";
        if (!formData.grade || formData.grade.trim() === '') newErrors.grade = "Grade Level is required";
        if (!formData.facilityId || formData.facilityId.trim() === '') newErrors.facilityId = "Facility is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const dataToSave = {
                className: formData.className,
                grade: parseInt(formData.grade),
                schoolYear: formData.schoolYear,
                facilityId: formData.facilityId
            };

            console.log("Dữ liệu đang gửi lên server:", dataToSave);

            if (selectedClass) {
                await axiosClient.put(`/master-data/classes/${selectedClass.id}`, dataToSave);
            } else {
                await axiosClient.post("/master-data/classes", dataToSave);
            }

            setModals(prev => ({ ...prev, edit: false }));
            fetchClasses(selectedClass ? pageData.page : 0);
        } catch (error) {
            console.error("Lỗi server:", error.response?.data);
            const serverErrors = error.response?.data;
            if (serverErrors && typeof serverErrors === 'object') {
                setErrors(serverErrors);
            } else {
                alert("Save failed!");
            }
        }
    };

    return (
        <div className="p-6 bg-[#f5f7fa] h-full overflow-y-auto scrollbar-thin">
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        Quản lí lớp học
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Tổng số: {pageData.totalElements} học sinh</p>
                </div>
                <ClassActions onAdd={() => openModal()} />
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <ClassTable
                    classes={classes}
                    loading={loading}
                    page={pageData.page}
                    onOpenDetail={openDetailModal}
                    onEdit={openModal}
                />
                <div className="flex items-center justify-between px-6 py-5 bg-white border-t border-gray-100">
                    <span className="text-sm font-semibold text-gray-500">
                        Trang {pageData.page + 1} / {pageData.totalPages || 1}
                    </span>
                    <Pagination
                        currentPage={pageData.page}
                        totalPages={pageData.totalPages}
                        onPageChange={fetchClasses}
                    />
                </div>
            </div>

            {modals.edit && (
                <ClassModal
                    key={selectedClass ? selectedClass.id : 'create'}
                    onClose={() => {
                        setModals(prev => ({ ...prev, edit: false }));
                        setErrors({});
                    }}
                    selectedClass={selectedClass}
                    formData={formData}
                    setFormData={setFormData}
                    onSave={handleSave}
                    facilities={facilities}
                    errors={errors}
                />
            )}
            {modals.detail && detailData && (
                <ClassDetailModal
                    onClose={() => setModals(prev => ({ ...prev, detail: false }))}
                    data={detailData}
                    onPageChange={(p) => openDetailModal(detailData.classInfo, p)}
                />
            )}
        </div>
    );
};
export default ClassesPage;