import { useState, useEffect } from 'react';
import axiosClient from "../axios/axiosClient";
import { UserCog, ChevronLeft, ChevronRight, Lock, Unlock } from "lucide-react";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageData, setPageData] = useState({ page: 0, totalPages: 0, totalElements: 0 });
    const [notification, setNotification] = useState(null);

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
                page: res.data.number,
                totalPages: res.data.totalPages,
                totalElements: res.data.totalElements
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            showNotification("Failed to load users.", "error");
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (user) => {
        const newStatus = user.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
        try {
            await axiosClient.put(`/admin/users/${user.id}/status`, { status: newStatus });
            showNotification(`User ${user.username} is now ${newStatus}`, "success");
            fetchUsers(pageData.page);
        } catch (error) {
            showNotification("Failed to update user status.", "error");
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    return (
        <div className="p-8 h-full bg-gray-50 overflow-y-auto">
            {notification && (
                <div className={`fixed top-5 right-5 z-[1000] px-6 py-4 rounded-xl shadow-2xl text-white font-bold ${notification.type === 'success' ? 'bg-green-700' : 'bg-red-700'}`}>
                    {notification.message}
                </div>
            )}

            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-gray-950 flex items-center gap-3">
                        <UserCog className="text-blue-900" size={28} /> User Management
                    </h2>
                    <p className="text-sm text-gray-500 font-semibold mt-1">Total: {pageData.totalElements} users</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[11px] font-black uppercase text-gray-500 tracking-widest">
                    <tr>
                        <th className="px-6 py-4">STT</th>
                        <th className="px-6 py-4">Username</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {loading ? (
                        <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500 font-bold">Loading users...</td></tr>
                    ) : (
                        users.map((u, index) => (
                            <tr key={u.id} className="hover:bg-blue-50/50 transition-colors">
                                <td className="px-6 py-4 text-gray-500 font-bold text-sm">{(pageData.page * 10) + index + 1}</td>
                                <td className="px-6 py-4 font-bold text-gray-900 text-sm">{u.username}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${u.status === 'ACTIVE' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
                                        {u.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => toggleStatus(u)}
                                        className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer"
                                    >
                                        {u.status === 'ACTIVE' ? <Lock size={18} className="text-gray-700"/> : <Unlock size={18} className="text-blue-900"/>}
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>

                <div className="flex items-center justify-between px-6 py-5 bg-white border-t border-gray-100">
                    <div className="text-sm font-semibold text-gray-500">
                        Trang <span className="text-blue-900 font-bold">{pageData.page + 1}</span> / {pageData.totalPages || 1}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button disabled={pageData.page === 0} onClick={() => fetchUsers(pageData.page - 1)} className="flex items-center justify-center w-9 h-9 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-all"><ChevronLeft size={18} className="text-gray-700"/></button>
                        {[...Array(pageData.totalPages)].map((_, i) => {
                            if (i === 0 || i === pageData.totalPages - 1 || (i >= pageData.page - 1 && i <= pageData.page + 1)) return (
                                <button key={i} onClick={() => fetchUsers(i)} className={`w-9 h-9 rounded-lg font-bold text-sm transition-all shadow-sm ${pageData.page === i ? 'bg-blue-900 text-white shadow-blue-200' : 'bg-white border border-gray-200 text-gray-600 hover:bg-blue-50'}`}>{i + 1}</button>
                            );
                            if (i === pageData.page - 2 || i === pageData.page + 2) return <span key={i} className="px-2 text-gray-400 font-bold tracking-widest">...</span>;
                            return null;
                        })}
                        <button disabled={pageData.page >= pageData.totalPages - 1} onClick={() => fetchUsers(pageData.page + 1)} className="flex items-center justify-center w-9 h-9 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-all"><ChevronRight size={18} className="text-gray-700"/></button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default UsersPage;