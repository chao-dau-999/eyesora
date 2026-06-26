import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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

        // 🌟 CHỈ BẮT LỖI 500 (Server Error). KHÔNG BẮT LỖI NETWORK ERROR DO CHUYỂN TRANG NỮA!
        if (error.response && error.response.status === 500 && !originalRequest._retry) {

            // Nếu đang có 1 luồng khác đi xin Token rồi, luồng này phải xếp hàng chờ
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

                // Xin cấp lại cặp Token mới
                const res = await axios.post('http://localhost:8080/api/auth/refresh', {
                    refreshToken: oldRefreshToken
                });

                const { accessToken, refreshToken } = res.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                // Cập nhật Token mới vào request hiện tại
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                // Giải phóng hàng đợi, báo cho các request đang chờ biết token mới đã có
                processQueue(null, accessToken);

                return axiosClient(originalRequest);

            } catch (refreshError) {
                processQueue(refreshError, null);
                // Xóa dữ liệu và đá ra login nếu không thể tự làm mới
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                // Mở khóa luồng
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;