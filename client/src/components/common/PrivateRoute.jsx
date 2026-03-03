import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from './Loading';

/**
 * PrivateRoute - Component bao ve routes can authentication
 * Neu chua dang nhap, redirect ve trang login
 */
const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // Dang kiem tra authentication state
    if (loading) {
        return <Loading fullScreen />;
    }

    // Chua dang nhap -> redirect ve login, ghi nho location de redirect lai sau khi login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Da dang nhap -> render component
    return children;
};

export default PrivateRoute;
