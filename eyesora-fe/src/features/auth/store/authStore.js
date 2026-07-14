import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import axiosClient from "../../../shared/axios/axiosClient.js"; // Import axiosClient của bạn vào đây

const getUserFromToken = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
            return null;
        }
        return {
            id: localStorage.getItem("userId"),
            name: localStorage.getItem("name"),
            username: localStorage.getItem("username"),
            img: localStorage.getItem("userImg"),
            roles: decoded.roles || decoded.role || [],
            facilityId: null // Mặc định ban đầu chưa có, sẽ bổ sung sau khi fetchProfile
        };
    } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        return null;
    }
};

const initialUser = getUserFromToken();

export const useAuthStore = create((set, get) => ({
    user: initialUser,
    isAuthenticated: !!initialUser,

    // Hàm mới: Chủ động fetch thông tin chi tiết User từ BE
    fetchProfile: async () => {
        const currentUser = get().user;
        if (!currentUser || !currentUser.id) return null;

        try {
            // Gọi API lấy chi tiết user (thay đổi endpoint đúng với BE của bạn, ví dụ /users/me hoặc /users/{id})
            const res = await axiosClient.get(`/admin/users/${currentUser.id}`);
            const profileData = res.data; // Giả sử BE trả về: { id, name, username, facilityId, ... }

            // Cập nhật đè thông tin facilityId vào state user hiện tại
            set((state) => ({
                user: {
                    ...state.user,
                    facilityId: profileData.facilityId // Lưu facID lấy từ BE vào store
                }
            }));
            return profileData.facilityId;
        } catch (error) {
            console.error("Lỗi khi fetch thông tin profile user:", error);
            return null;
        }
    },

    loginSuccess: (tokenData) => {
        localStorage.setItem("accessToken", tokenData.accessToken);
        localStorage.setItem("refreshToken", tokenData.refreshToken);
        localStorage.setItem("userId", tokenData.id);
        localStorage.setItem("name", tokenData.name);
        localStorage.setItem("username", tokenData.username);
        localStorage.setItem("userImg", tokenData.img || "");

        let verifiedRoles = tokenData.roles || [];
        try {
            const decoded = jwtDecode(tokenData.accessToken);
            verifiedRoles = decoded.roles || decoded.role || tokenData.roles || [];
        } catch (e) {
            console.error("Token mã hóa lỗi");
        }

        set({
            isAuthenticated: true,
            user: {
                id: tokenData.id,
                name: tokenData.name,
                username: tokenData.username,
                img: tokenData.img,
                roles: verifiedRoles,
                facilityId: null // Sẽ được cập nhật sau khi gọi fetchProfile
            }
        });
    },

    logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("name");
        localStorage.removeItem("username");
        localStorage.removeItem("userImg");
        localStorage.removeItem("roles");
        set({ isAuthenticated: false, user: null });
        window.location.href = '/login';
    }
}));