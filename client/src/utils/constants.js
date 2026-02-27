// Base URL cho hinh anh tu ophim CDN
export const IMG_CDN_URL = 'https://img.ophim.live/uploads/movies';

// Tao URL poster tu path
export const getPosterUrl = (posterUrl) => {
    if (!posterUrl) return '';
    if (posterUrl.startsWith('http')) return posterUrl;
    // ophim tra ve ten file, can ghep voi CDN domain
    return `${IMG_CDN_URL}/${posterUrl}`;
};

// Tao URL thumbnail tu path
export const getThumbUrl = (thumbUrl) => {
    if (!thumbUrl) return '';
    if (thumbUrl.startsWith('http')) return thumbUrl;
    return `${IMG_CDN_URL}/${thumbUrl}`;
};

// Map badge type
export const BADGE_MAP = {
    'trailer': { className: 'badge-new', text: 'Trailer' },
    'completed': { className: 'badge-free', text: 'Full' },
    'ongoing': { className: 'badge-hot', text: 'Đang chiếu' },
};

// Category tabs trang chủ
export const CATEGORY_TABS = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Phim Việt', value: 'viet-nam' },
    { label: 'Phim Hàn', value: 'han-quoc' },
    { label: 'Phim Trung', value: 'trung-quoc' },
    { label: 'Phim Âu Mỹ', value: 'au-my' },
    { label: 'Phim Nhật', value: 'nhat-ban' },
];

// Nav links
export const NAV_LINKS = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Phim bộ', path: '/danh-sach/phim-bo' },
    { label: 'Phim lẻ', path: '/danh-sach/phim-le' },
    { label: 'Hoạt hình', path: '/danh-sach/hoat-hinh' },
    { label: 'TV Shows', path: '/danh-sach/tv-shows' },
];

// Kênh truyền hình trực tiếp (static data)
export const LIVE_CHANNELS = [
    { name: 'Kênh Thời Sự', desc: 'Đang phát sóng', emoji: '📺', color: '#1a237e, #283593' },
    { name: 'Kênh Thể Thao', desc: 'V-League 2026', emoji: '⚽', color: '#004d40, #00695c' },
    { name: 'Kênh Âm Nhạc', desc: 'Top Hits 2026', emoji: '🎵', color: '#0d47a1, #1565c0' },
    { name: 'Kênh Gaming', desc: 'Esports Live', emoji: '🎮', color: '#0d47a1, #1565c0' },
    { name: 'Kênh Giải Trí', desc: 'Game Show', emoji: '🎭', color: '#4a148c, #6a1b9a' },
    { name: 'Kênh Tổng Hợp', desc: 'Đang phát sóng', emoji: '📰', color: '#1b5e20, #2e7d32' },
];
