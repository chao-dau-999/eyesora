import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from "../../../shared/axios/axiosClient.js";
import UserTable from "../components/UserTable.jsx";
import UserAction from "../components/UserAction.jsx";
import UserDetailModal from "../components/UserDetailModal.jsx";
import ConfirmModal from "../../../shared/components/ConfirmModal.jsx";
import Pagination from "../../../shared/components/Pagination.jsx";

const UsersPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [pageData, setPageData] = useState({ page: 0, totalPages: 0, totalElements: 0 });
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmData, setConfirmData] = useState(null);

    const fetchUsers = async (page = 0) => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`/admin/users?page=${page}&size=10`);
            setUsers(res.data.content || []);
            setPageData({
                page: res.data.number,
                totalPages: res.data.totalPages,
                totalElements: res.data.totalElements
            });
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleToggleStatus = async () => {
        const { user } = confirmData;
        const newStatus = user.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
        await axiosClient.put(`/admin/users/${user.id}/status`, { status: newStatus });
        fetchUsers(pageData.page);
        setConfirmData(null);
    };

    return (
        <div className="p-6 bg-[#f5f7fa] h-full overflow-y-auto scrollbar-thin">
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Quản lý Người dùng</h2>
                    <p className="text-xs text-gray-500 mt-1">Tổng số: {pageData.totalElements} tài khoản</p>
                </div>
                <UserAction onAddClick={() => navigate('/admin/users/create')} />
            </div>

            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <UserTable
                    users={users}
                    loading={loading}
                    onDetail={async (u) => { const res = await axiosClient.get(`/admin/users/${u.id}`); setSelectedUser(res.data); }}
                    onEdit={(u) => navigate(`/users/edit/${u.id}`)}
                    onToggle={(u) => setConfirmData({ user: u, title: 'Xác nhận trạng thái', message: `Bạn có muốn đổi trạng thái ${u.username}?` })}
                />
                <div className="px-6 py-5 border-t flex justify-between items-center bg-white">
                    <span className="text-xs font-black text-gray-400 uppercase">Trang {pageData.page + 1} / {pageData.totalPages || 1}</span>
                    <Pagination currentPage={pageData.page} totalPages={pageData.totalPages} onPageChange={fetchUsers} />
                </div>
            </div>

            <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
            <ConfirmModal isOpen={!!confirmData} onClose={() => setConfirmData(null)} onConfirm={handleToggleStatus}
                          title={confirmData?.title} message={confirmData?.message} />
        </div>
    );
};
export default UsersPage;