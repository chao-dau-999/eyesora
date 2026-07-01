import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from "../../../shared/axios/axiosClient.js";
import ClassActions from "../components/ClassActions.jsx";
import ClassTable from "../components/ClassTable.jsx";
import ClassDetailModal from "../components/ClassDetailModal.jsx";
import Pagination from "../../../shared/components/Pagination.jsx";

const ClassesPage = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageData, setPageData] = useState({ page: 0, totalPages: 0, totalElements: 0 });
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [detailData, setDetailData] = useState(null);

    useEffect(() => { fetchClasses(); }, []);

    const fetchClasses = async (page = 0) => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`/master-data/classes?page=${page}&size=10`);
            setClasses(res.data.content || []);
            setPageData({
                page: res.data.number ?? 0,
                totalPages: res.data.totalPages ?? 0,
                totalElements: res.data.totalElements ?? 0
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const openDetailModal = async (cls, page = 0) => {
        try {
            const res = await axiosClient.get(`/master-data/classes/${cls.id}/patients?page=${page}&size=10`);
            console.log("DỮ LIỆU TỪ API CHI TIẾT LỚP:", res.data); // <--- XEM LOG NÀY

            // CÓ THỂ LÀ CẤU TRÚC LÀ res.data.content thay vì res.data.patients.content
            setDetailData({
                ...res.data,
                patients: res.data.patients?.content || [], // Kiểm tra kỹ đường dẫn này
                classInfo: cls,
                number: res.data.patients?.number || 0,
                totalPages: res.data.patients?.totalPages || 0
            });
            setIsDetailOpen(true);
        } catch (error) { alert("Error loading details!"); }
    };

    return (
        <div className="p-6 bg-[#f5f7fa] h-full overflow-y-auto scrollbar-thin">
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Quản lí lớp học</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Tổng số: {pageData.totalElements} lớp</p>
                </div>
                <button
                    onClick={() => navigate('/classes/create')}
                    className="bg-blue-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-800 transition-all"
                >
                    + Thêm lớp học
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <ClassTable
                    classes={classes}
                    loading={loading}
                    page={pageData.page}
                    onOpenDetail={openDetailModal}
                    onEdit={(cls) => navigate(`/classes/edit/${cls.id}`)}
                />
                <div className="px-6 py-5 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-500">Trang {pageData.page + 1} / {pageData.totalPages || 1}</span>
                    <Pagination currentPage={pageData.page} totalPages={pageData.totalPages} onPageChange={fetchClasses} />
                </div>
            </div>

            {isDetailOpen && detailData && (
                <ClassDetailModal
                    onClose={() => setIsDetailOpen(false)}
                    data={detailData}
                    onPageChange={(p) => openDetailModal(detailData.classInfo, p)}
                />
            )}
        </div>
    );
};
export default ClassesPage;