import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Khoi tao auth state tu localStorage
    const initializeAuth = useCallback(async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                // Verify token voi server
                try {
                    const response = await authApi.verifyToken(token);
                    if (response.success) {
                        setUser(response.data.user);
                        setIsAuthenticated(true);
                    } else {
                        // Token khong hop le, xoa
                        clearAuth();
                    }
                } catch (error) {
                    // Token het han hoac khong hop le
                    clearAuth();
                }
            }
        } catch (error) {
            console.error('Error initializing auth:', error);
            clearAuth();
        } finally {
            setLoading(false);
        }
    }, []);

    // Clear auth data
    const clearAuth = useCallback(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
    }, []);

    // Login
    const login = useCallback(async (identifier, password) => {
        try {
            const response = await authApi.login(identifier, password);
            
            if (response.success) {
                const { token, user } = response.data;
                
                // Luu vao localStorage
                localStorage.setItem('auth_token', token);
                localStorage.setItem('user', JSON.stringify(user));
                
                // Update state
                setUser(user);
                setIsAuthenticated(true);
                
                return { success: true };
            }
        } catch (error) {
            return { 
                success: false, 
                error: error.message || 'Đăng nhập thất bại' 
            };
        }
    }, []);

    // Logout
    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearAuth();
        }
    }, [clearAuth]);

    // Refresh user data
    const refreshUser = useCallback(async () => {
        try {
            const response = await authApi.getCurrentUser();
            if (response.success) {
                setUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
        } catch (error) {
            console.error('Error refreshing user:', error);
            clearAuth();
        }
    }, [clearAuth]);

    // Listen for auth changes (tu cac component khac)
    useEffect(() => {
        const handleAuthChange = () => {
            initializeAuth();
        };

        window.addEventListener('auth-change', handleAuthChange);
        return () => window.removeEventListener('auth-change', handleAuthChange);
    }, [initializeAuth]);

    // Initialize auth on mount
    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
