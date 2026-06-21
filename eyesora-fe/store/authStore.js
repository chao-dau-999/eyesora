import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    // Trạng thái ban đầu: Thử lấy dữ liệu cũ từ localStorage nếu có
    user: localStorage.getItem('username')
        ? {
            id: localStorage.getItem('userId'),
            username: localStorage.getItem('username'),
            // img: localStorage.getItem('userImg'),
            role: localStorage.getItem('userRole'),
        }
        : null,
    isAuthenticated: !!localStorage.getItem('accessToken'),

    // Hành động Đăng nhập thành công
    loginSuccess: (tokenData) => {
        localStorage.setItem('accessToken', tokenData.accessToken);
        localStorage.setItem('refreshToken', tokenData.refreshToken);
        localStorage.setItem('userId', tokenData.id);
        localStorage.setItem('username', tokenData.username);
        localStorage.setItem('userImg', tokenData.img || '');
        localStorage.setItem('userRole', tokenData.role);

        set({
            isAuthenticated: true,
            user: {
                id: tokenData.id,
                username: tokenData.username,
                img: tokenData.img,
                role: tokenData.role
            }
        });
    },

    // Hành động Đăng xuất
    logout: () => {
        localStorage.clear(); // Hoặc xóa từng item cụ thể
        set({ isAuthenticated: false, user: null });
        window.location.href = '/login';
    }
}));