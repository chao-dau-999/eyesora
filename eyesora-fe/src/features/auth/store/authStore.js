import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    user: localStorage.getItem("accessToken")
        ? {
            id: localStorage.getItem("userId"),
            name: localStorage.getItem("name"),
            username: localStorage.getItem("username"),
            img: localStorage.getItem("userImg"),
            roles: JSON.parse(localStorage.getItem("roles") || "[]"),
        }
        : null,

    isAuthenticated: !!localStorage.getItem('accessToken'),

    loginSuccess: (tokenData) => {
        localStorage.setItem("accessToken", tokenData.accessToken);
        localStorage.setItem("refreshToken", tokenData.refreshToken);

        localStorage.setItem("userId", tokenData.id);
        localStorage.setItem("name", tokenData.name);
        localStorage.setItem("username", tokenData.username);
        localStorage.setItem("userImg", tokenData.img || "");
        localStorage.setItem(
            "roles",
            JSON.stringify(tokenData.roles || [])
        );

        set({
            isAuthenticated: true,
            user: {
                id: tokenData.id,
                name: tokenData.name,
                username: tokenData.username,
                img: tokenData.img,
                roles: tokenData.roles || [],
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