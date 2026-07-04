import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use(
    (config) => {
        if (!config.url.includes('/auth/refresh')) {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {

            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = 'Bearer ' + token;
                    return axiosClient(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const oldRefreshToken = localStorage.getItem('refreshToken');
                if (!oldRefreshToken) throw new Error("Không có refresh token");

                const res = await axiosClient.post('/auth/refresh', {
                    refreshToken: oldRefreshToken
                });

                const { accessToken, refreshToken } = res.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                // Giải phóng hàng đợi, báo cho các request đang chờ biết token mới đã có
                processQueue(null, accessToken);

                return axiosClient(originalRequest);

            } catch (refreshError) {
                processQueue(refreshError, null);

                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;