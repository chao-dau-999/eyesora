import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

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
            // Lấy roles trực tiếp từ Payload của Token được mã hóa ở Back-end
            roles: decoded.roles || decoded.role || [],
        };
    } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        return null;
    }
};

const initialUser = getUserFromToken();

export const useAuthStore = create((set) => ({
    user: initialUser,
    isAuthenticated: !!initialUser,

    loginSuccess: (tokenData) => {
        localStorage.setItem("accessToken", tokenData.accessToken);
        localStorage.setItem("refreshToken", tokenData.refreshToken);
        localStorage.setItem("userId", tokenData.id);
        localStorage.setItem("name", tokenData.name);
        localStorage.setItem("username", tokenData.username);
        localStorage.setItem("userImg", tokenData.img || "");


        // Giải mã token vừa nhận để nạp vào State lưu trên RAM
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

        set({
            isAuthenticated: false,
            user: null,
        });
        window.location.href = '/login';
    }
}));