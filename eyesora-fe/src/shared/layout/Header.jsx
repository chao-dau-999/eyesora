import  { useState, useRef, useEffect } from 'react';
import { Bell, User, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from "../../features/auth/store/authStore.js";

const Header = ({ onMenuClick }) => {
    const navigate = useNavigate();

    // Rút trích dữ liệu và hàm logout từ Zustand store toàn cục
    // Lưu ý: userRole ở store của bạn tương ứng với role ở file tham khảo
    const { id, username, userRole, isAuthenticated, logout } = useAuthStore();

    // State và Ref phục vụ cho Dropdown menu
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Xử lý đăng xuất
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between z-30 gap-4">

            {/* Khối Logo / Menu Button */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="p-2 bg-white border border-[#c2c6d5] rounded-lg md:hidden text-[#004194] flex items-center justify-center cursor-pointer"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <h1 className="text-base md:text-lg font-semibold text-blue-900 min-w-max">
                    Refractive Management
                </h1>
            </div>

            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                <button className="text-gray-500 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer relative">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Khu vực Dropdown cấu hình theo trạng thái Auth */}
                <div className="relative" ref={dropdownRef}>
                    {isAuthenticated ? (
                        // TRƯỜNG HỢP 1: ĐÃ ĐĂNG NHẬP
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 border-l pl-2 md:pl-4 border-gray-200 cursor-pointer text-left bg-transparent border-y-0 border-r-0 focus:outline-none group"
                        >
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium text-gray-900 whitespace-nowrap group-hover:text-blue-600 transition-colors">
                                    {username || 'Lê Minh Nhựt'}
                                </p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                                    {userRole === 'admin' ? 'SUPER ADMIN' : userRole || 'USER'}
                                </p>
                            </div>
                            <img
                                src={`https://ui-avatars.com/api/?name=${username || 'U'}&background=004194&color=fff&bold=true`}
                                alt="Avatar"
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-200 object-cover group-hover:border-blue-400 transition-all"
                            />
                            <ChevronDown size={14} className={`text-gray-400 hidden md:block transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                    ) : (
                        // TRƯỜNG HỢP 2: CHƯA ĐĂNG NHẬP (GUEST)
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 p-1.5 pr-3 rounded-full border border-gray-200 transition-colors cursor-pointer"
                        >
                            <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center">
                                <User size={16} className="text-gray-500" />
                            </div>
                            <span className="text-xs font-bold text-gray-700">Guest</span>
                            <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                    )}

                    {/* Nội dung chi tiết bên trong Dropdown */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-50 transform origin-top-right transition-all">
                            {isAuthenticated ? (
                                <>
                                    {/* Khối User Info hiển thị trên Mobile (Do trên Mobile phần text góc phải đã bị ẩn đi) */}
                                    <div className="px-4 py-2.5 border-b border-gray-100 md:hidden bg-gray-50/50">
                                        <p className="text-sm font-bold text-gray-900 truncate">{username}</p>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{userRole}</p>
                                    </div>

                                    {/* Khối quản trị nếu Role là Admin */}
                                    {userRole === 'admin' && (
                                        <button
                                            onClick={() => { setDropdownOpen(false); navigate('/admin'); }}
                                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors bg-transparent border-none cursor-pointer"
                                        >
                                            <LayoutDashboard size={16} />
                                            <span>Admin Dashboard</span>
                                        </button>
                                    )}

                                    {/* Menu Account cá nhân */}
                                    <button
                                        onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors bg-transparent border-none cursor-pointer"
                                    >
                                        <User size={16} className="text-gray-400" />
                                        <span>Tài khoản</span>
                                    </button>

                                    <div className="border-t border-gray-100 my-1"></div>

                                    {/* Nút đăng xuất */}
                                    <button
                                        onClick={() => { setDropdownOpen(false); handleLogout(); }}
                                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors bg-transparent border-none cursor-pointer"
                                    >
                                        <LogOut size={16} />
                                        <span>Đăng xuất</span>
                                    </button>
                                </>
                            ) : (
                                // Chưa đăng nhập -> Nút điều hướng tới Login
                                <button
                                    onClick={() => { setDropdownOpen(false); navigate('/login'); }}
                                    className="w-full text-left px-4 py-2.5 text-sm font-bold text-blue-600 hover:bg-gray-50 flex items-center gap-2.5 transition-colors bg-transparent border-none cursor-pointer"
                                >
                                    <LogOut size={16} className="transform rotate-180" />
                                    <span>Đăng nhập</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;