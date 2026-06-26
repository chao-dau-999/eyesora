import { useState, useEffect } from 'react';
import axiosClient from "../../../shared/axios/axiosClient.js";
import { UserCog, ChevronLeft, ChevronRight, Lock, Unlock, Eye, X } from "lucide-react";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageData, setPageData] = useState({ page: 0, totalPages: 0, totalElements: 0 });
    const [notification, setNotification] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

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
            showNotification("Failed to load users.", "error");
        } finally {
            setLoading(false);
        }
    };

    const openDetail = async (u) => {
        try {
            const res = await axiosClient.get(`/admin/users/${u.id}`);
            setSelectedUser(res.data);
            setIsDetailOpen(true);
        } catch (error) {
            showNotification("Failed to load user details.", "error");
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
                    {users.map((u, index) => (
                        <tr key={u.id} className="hover:bg-blue-50/50 transition-colors">
                            <td className="px-6 py-4 text-gray-500 font-bold text-sm">{(pageData.page * 10) + index + 1}</td>
                            <td className="px-6 py-4 font-bold text-gray-900 text-sm">{u.username}</td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${u.status === 'ACTIVE' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
                                    {u.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                <button onClick={() => openDetail(u)} className="p-2 bg-gray-50 rounded-lg border hover:bg-gray-100"><Eye size={18} className="text-gray-600"/></button>
                                <button onClick={() => toggleStatus(u)} className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-100">
                                    {u.status === 'ACTIVE' ? <Lock size={18} className="text-gray-700"/> : <Unlock size={18} className="text-blue-900"/>}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Detail */}
            {isDetailOpen && selectedUser && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-sm shadow-2xl">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-black text-gray-950">User Profile</h2>
                            <button onClick={() => setIsDetailOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} className="text-gray-400"/>
                            </button>
                        </div>

                        {/* User Info List */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <span className="text-sm font-bold text-gray-500">Full Name</span>
                                <span className="text-sm font-black text-blue-900">{selectedUser.fullName || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <span className="text-sm font-bold text-gray-500">Username</span>
                                <span className="text-sm font-black text-gray-800">{selectedUser.username}</span>
                            </div>

                            <div className="border-b border-gray-100 pb-4">
                                <span className="block text-sm font-bold text-gray-500 mb-1">Email Address</span>
                                <span className="block text-sm font-black text-gray-800 break-words break-all">
                        {selectedUser.email}
                    </span>
                            </div>

                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <span className="text-sm font-bold text-gray-500">Facility</span>
                                <span className="text-sm font-black text-gray-800 text-right ml-4">{selectedUser.facilityName || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <span className="text-sm font-bold text-gray-500">Roles</span>
                                <div className="flex gap-1.5">
                                    {selectedUser.roles.map(role => (
                                        <span key={role} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg font-black text-[10px] uppercase tracking-wide">
                                {role}
                            </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsDetailOpen(false)}
                            className="w-full mt-10 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-gray-800 transition-all shadow-lg"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default UsersPage;