import { useState, useEffect } from 'react';
import axiosClient from "../../../shared/axios/axiosClient.js";
import { UserCog, Eye, Lock, Unlock } from "lucide-react";
import Pagination from "../../../shared/components/Pagination.jsx";
import UserDetailModal from "../components/UserDetailModal.jsx";
import ConfirmModal from "../../../shared/components/ConfirmModal.jsx";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageData, setPageData] = useState({ page: 0, totalPages: 0, totalElements: 0 });
    const [notification, setNotification] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmData, setConfirmData] = useState(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchUsers = async (page = 0) => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`/admin/users?page=${page}&size=10`);
            setUsers(res.data.content || []);
            setPageData({
                page: res.data.number ?? 0,
                totalPages: res.data.totalPages ?? 0,
                totalElements: res.data.totalElements ?? 0
            });
        } catch (error) {
            showNotification("Tải dữ liệu thất bại.", "error");
        } finally {
            setLoading(false);
        }
    };

    const requestToggleStatus = (user) => {
        const action = user.status === 'ACTIVE' ? 'KHÓA' : 'MỞ KHÓA';
        setConfirmData({
            user,
            title: `Xác nhận ${action} tài khoản`,
            message: `Bạn có chắc chắn muốn ${action.toLowerCase()} người dùng ${user.username} không?`
        });
    };

    const confirmToggle = async () => {
        const { user } = confirmData;
        const newStatus = user.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
        try {
            await axiosClient.put(`/admin/users/${user.id}/status`, { status: newStatus });
            showNotification(`Đã cập nhật trạng thái người dùng ${user.username}.`, "success");
            fetchUsers(pageData.page);
        } catch (error) {
            showNotification("Thao tác thất bại.", "error");
        }
        setConfirmData(null);
    };

    useEffect(() => { fetchUsers(); }, []);

    return (
        <div className="p-6 bg-[#f5f7fa] h-full overflow-y-auto scrollbar-thin">
            {notification && (
                <div className={`fixed top-5 right-5 z-[1000] px-6 py-4 rounded-xl shadow-2xl text-white font-bold ${notification.type === 'success' ? 'bg-emerald-600' : 'bg-red-700'}`}>
                    {notification.message}
                </div>
            )}

            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <UserCog className="text-blue-900" size={28} /> Quản lý Người dùng
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Tổng số: {pageData.totalElements} tài khoản</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <tr>
                        <th className="px-8 py-5">STT</th>
                        <th className="px-8 py-5">Tên đăng nhập</th>
                        <th className="px-8 py-5">Trạng thái</th>
                        <th className="px-8 py-5 text-right">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {users.map((u, index) => (
                        <tr key={u.id} className="hover:bg-blue-50/50 transition-colors">
                            <td className="px-8 py-5 font-bold text-gray-500 text-sm">{(Number(pageData.page || 0) * 10) + index + 1}</td>
                            <td className="px-8 py-5 font-bold text-gray-900 text-sm">{u.username}</td>
                            <td className="px-8 py-5">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${u.status === 'ACTIVE' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
                                    {u.status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
                                </span>
                            </td>
                            <td className="px-8 py-5 text-right flex justify-end gap-2">
                                <button onClick={async () => { const res = await axiosClient.get(`/admin/users/${u.id}`); setSelectedUser(res.data); }} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-blue-900 shadow-sm transition-all"><Eye size={16}/></button>
                                <button onClick={() => requestToggleStatus(u)} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-blue-900 shadow-sm transition-all">
                                    {u.status === 'ACTIVE' ? <Lock size={16}/> : <Unlock size={16}/>}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="px-6 py-5 border-t border-gray-100 flex justify-between items-center bg-white">
                    <span className="text-xs font-black text-gray-400 uppercase">Trang {pageData.page + 1} / {pageData.totalPages || 1}</span>
                    <Pagination currentPage={pageData.page} totalPages={pageData.totalPages} onPageChange={fetchUsers} />
                </div>
            </div>

            <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
            <ConfirmModal
                isOpen={!!confirmData}
                onClose={() => setConfirmData(null)}
                onConfirm={confirmToggle}
                title={confirmData?.title}
                message={confirmData?.message}
            />
        </div>
    );
};
export default UsersPage;