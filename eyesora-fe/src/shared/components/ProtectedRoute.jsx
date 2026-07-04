import { Navigate, Outlet } from 'react-router-dom';

const useAuth = () => {
    const accessToken = localStorage.getItem('accessToken');

    let roles = [];
    try {
        roles = JSON.parse(localStorage.getItem('roles')) || [];
    } catch (e) {
        console.error("Error parsing roles from localStorage", e);
    }

    return {
        isAuthenticated: !!accessToken,
        roles: roles
    };
};

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, roles } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 2. Nếu đã đăng nhập nhưng KHÔNG có quyền hợp lệ
    // Dùng .some() vì user.roles là một mảng, allowedRoles cũng là một mảng
    if (allowedRoles && !roles.some(role => allowedRoles.includes(role))) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;