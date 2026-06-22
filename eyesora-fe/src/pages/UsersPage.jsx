import { useState, useEffect } from 'react';
import axiosClient from "../axios/axiosClient";
import { UserCog } from "lucide-react";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
   
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get("/admin/users");
            setUsers(res.data.content || []);
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
            fetchUsers();
        } catch (error) {
            showNotification("Failed to update user status.", "error");
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    return (
        <div className="p-6 h-full overflow-y-auto">
            {/* Popup Thông báo */}
            {notification && (
                <div className={`fixed top-5 right-5 z-[100] px-6 py-3 rounded-lg shadow-lg text-white font-bold animate-in slide-in-from-right-10 ${
                    notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                }`}>
                    {notification.message}
                </div>
            )}

            <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                    <UserCog className="text-blue-900" /> User Management
                </h2>
                <p className="text-gray-500 text-sm">Manage system access and account status</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/80">
                    <tr className="text-gray-600 text-xs font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Username</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {loading ? (
                        <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-500">Loading users...</td></tr>
                    ) : (
                        users.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900 text-sm">{u.username}</td>
                                <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            u.status === 'ACTIVE'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                            {u.status}
                                        </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => toggleStatus(u)}
                                        className="text-blue-900 font-bold text-sm bg-blue-50 px-4 py-1.5 rounded-lg hover:bg-blue-100 transition-all cursor-pointer"
                                    >
                                        Toggle Status
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default UsersPage;