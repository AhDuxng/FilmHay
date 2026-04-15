import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from './Loading';

const AUTH_DISABLED = true;

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // Temporary switch: bypass auth checks until login is enabled again.
    if (AUTH_DISABLED) {
        return children;
    }

    // Dang kiem tra authentication state
    if (loading) {
        return <Loading fullScreen />;
    }

    // Chua dang nhap -> redirect ve login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Da dang nhap -> render component
    return children;
};

export default PrivateRoute;
