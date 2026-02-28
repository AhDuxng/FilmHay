// ===== HELPER FUNCTIONS DUNG CHUNG =====
// Tap trung cac ham xu ly lap di lap lai o nhieu component

/**
 * Parse response tu ophim API
 * API tra ve nhieu level nested: response.data.data.items
 * Ham nay chuan hoa ve { items, pagination }
 */
export const parseApiData = (data) => {
    if (!data) return { items: [], pagination: null };
    const innerData = data?.data || data;
    return {
        items: innerData?.items || [],
        pagination: innerData?.params?.pagination || null,
    };
};

/**
 * Xu ly loi khi load hinh anh
 * Thay bang gradient placeholder khi anh bi loi
 * Xoa onError de tranh vong lap vo han
 */
export const handleImageError = (e) => {
    e.target.onerror = null; // Ngan vong lap: error -> set src -> error
    e.target.style.background = 'linear-gradient(135deg, #1a1a2e, #16213e)';
    e.target.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
};

// ===== LAYOUT CONSTANTS =====
// Cac class Tailwind dung di dung lai o nhieu section/page

// Gradient placeholder khi hinh anh bi loi hoac chua co
export const GRADIENT_PLACEHOLDER = 'linear-gradient(135deg, #1a1a2e, #16213e)';

// Padding chuan cho section trang chu
export const SECTION_PADDING = 'px-12 max-lg:px-6 max-md:px-4';

// Padding chuan cho page (co pt cho navbar)
export const PAGE_PADDING = 'pt-20 max-md:pt-[72px] px-12 max-lg:px-6 max-md:px-4 pb-10 max-md:pb-8';

// Grid hien thi danh sach phim dang luoi
export const MOVIE_GRID_CLASS = 'grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] max-md:grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4 max-md:gap-2.5 [&>*]:flex-none [&>*]:w-full';

// Nút thử lại chung
export const RETRY_BUTTON_CLASS = 'px-7 py-2.5 bg-primary text-white text-sm font-semibold rounded hover:bg-primary-light transition-colors';

/**
 * Cuon ve dau trang - dung chung o tat ca page/card khi chuyen route
 */
export const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
};
