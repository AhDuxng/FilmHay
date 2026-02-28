import { memo } from 'react';
import { RETRY_BUTTON_CLASS } from '../../utils/helpers';

/**
 * Trang thai loi dung chung cho tat ca page
 * Hien thi thong bao loi + nut thu lai
 * Dung o: HomePage, MovieDetailPage, SearchPage, CategoryPage
 *
 * @param {string} title - tieu de loi
 * @param {string} message - noi dung loi chi tiet
 * @param {function} onRetry - ham goi khi nhan "Thu lai"
 * @param {boolean} hasTopPadding - co them padding top cho navbar khong
 */
const ErrorState = memo(function ErrorState({
    title = 'Có lỗi xảy ra',
    message,
    onRetry,
    hasTopPadding = false,
}) {
    return (
        <div className={`${hasTopPadding ? 'pt-20 px-12 max-lg:px-6 max-md:px-4 min-h-screen' : ''}`}>
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-10">
                <h2 className="text-2xl text-white mb-3">{title}</h2>
                <p className="text-neutral-500 mb-6">{message}</p>
                {onRetry && (
                    <button onClick={onRetry} className={RETRY_BUTTON_CLASS}>
                        Thử lại
                    </button>
                )}
            </div>
        </div>
    );
});

export default ErrorState;
