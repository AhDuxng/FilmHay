import { Component } from 'react';

/**
 * Error Boundary - bắt lỗi render của component con
 * Hiển thị UI fallback thay vì crash toàn bộ app
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('[ErrorBoundary]', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen text-center p-10">
                    <h2 className="text-2xl text-white mb-3">Có lỗi xảy ra!</h2>
                    <p className="text-neutral-500 mb-6">Ứng dụng gặp sự cố. Vui lòng thử lại.</p>
                    <button
                        onClick={this.handleRetry}
                        className="px-7 py-2.5 bg-primary text-white text-sm font-semibold rounded hover:bg-primary-light transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
