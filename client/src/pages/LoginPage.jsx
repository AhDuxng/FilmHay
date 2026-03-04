import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/LoginPage.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Xoa error khi user bat dau nhap lai
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.identifier.trim() || !formData.password) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        setLoading(true);

        try {
            const result = await login(formData.identifier, formData.password);
            
            if (result.success) {
                // Redirect ve trang chu
                navigate('/', { replace: true });
            } else {
                setError(result.error || 'Đăng nhập thất bại. Vui lòng thử lại');
            }
        } catch (err) {
            setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-box">
                    {/* Header */}
                    <div className="login-header">
                        <div className="logo-section">
                            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.3"/>
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <h1>PhimHay</h1>
                        </div>
                        <h2>Đăng nhập</h2>
                        <p>Vui lòng đăng nhập để tiếp tục</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="login-form">
                        {error && (
                            <div className="error-message">
                                <svg className="error-icon" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    <circle cx="12" cy="16" r="1" fill="currentColor"/>
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="identifier">
                                <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                                Username hoặc Email
                            </label>
                            <input
                                type="text"
                                id="identifier"
                                name="identifier"
                                value={formData.identifier}
                                onChange={handleChange}
                                placeholder="Nhập username hoặc email"
                                disabled={loading}
                                autoComplete="username"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                                <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <circle cx="12" cy="16" r="1" fill="currentColor"/>
                                </svg>
                                Mật khẩu
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Nhập mật khẩu"
                                    disabled={loading}
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex="-1"
                                >
                                    {showPassword ? (
                                        <svg viewBox="0 0 24 24" fill="none">
                                            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
                                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" fill="none">
                                            <path d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.68192 3.96914 7.65663 6.06 6.06M9.9 4.24C10.5883 4.0789 11.2931 3.99836 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2048 20.84 15.19M14.12 14.12C13.8454 14.4147 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.4811 9.80385 14.1962C9.51897 13.9113 9.29439 13.5719 9.14351 13.1984C8.99262 12.8248 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4859 9.58525 10.1546 9.88 9.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Đang đăng nhập...
                                </>
                            ) : (
                                <>
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Đăng nhập
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
