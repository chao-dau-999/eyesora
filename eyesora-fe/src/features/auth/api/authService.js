import axiosClient from "../../../shared/axios/axiosClient.js";

export const authService = {
    login: async (username, password) => {
        const response = await axiosClient.post('/auth/login', { username, password });
        return response.data;
    },

    createForgotPwRequest: async (email) => {
        const response = await axiosClient.post('auth/forgot-password', email, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    },

    resetPassword: async ({token, newPassword}) => {
        const response = await axiosClient.post('auth/reset-password',
            { token, newPassword }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        return response;
    }
}