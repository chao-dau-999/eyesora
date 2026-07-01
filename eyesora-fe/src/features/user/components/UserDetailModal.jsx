import { X } from "lucide-react";

const UserDetailModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white p-8 rounded-3xl w-full max-w-sm shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-black text-gray-950">Thông tin người dùng</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-400"/>
                    </button>
                </div>

                <div className="space-y-6">
                    <InfoRow label="Họ và Tên" value={user.fullName} />
                    <InfoRow label="Tên đăng nhập" value={user.username} />
                    <InfoRow label="Email" value={user.email} />
                    <InfoRow label="Cơ sở" value={user.facilityName} />
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-sm font-bold text-gray-500">Vai trò</span>
                        <div className="flex gap-1.5">
                            {user.roles.map(role => (
                                <span key={role} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg font-black text-[10px] uppercase tracking-wide">
                                    {role}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-10 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-gray-800 transition-all shadow-lg"
                >
                    Đóng
                </button>
            </div>
        </div>
    );
};

const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <span className="text-sm font-bold text-gray-500">{label}</span>
        <span className="text-sm font-black text-gray-800 text-right">{value || 'N/A'}</span>
    </div>
);

export default UserDetailModal;