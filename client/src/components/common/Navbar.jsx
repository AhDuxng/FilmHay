import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../../utils/constants';

/**
 * Navbar - thanh điều hướng chính
 * Fixed top, đổi nền khi cuộn, responsive mobile
 */
function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Scroll effect - thêm nền đậm khi cuộn xuống
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Xử lý tìm kiếm
    const handleSearch = useCallback((e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/tim-kiem?keyword=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    }, [searchQuery, navigate]);

    return (
        <nav
            className={`fixed top-0 inset-x-0 z-[1000] flex items-center
                px-12 max-lg:px-6 max-md:px-4
                h-16 max-md:h-14
                transition-all duration-300
                ${scrolled
                    ? 'bg-[rgba(13,13,13,0.97)] shadow-[0_2px_12px_rgba(0,0,0,0.5)]'
                    : 'bg-gradient-to-b from-black/90 via-black/60 to-transparent'
                }`}
        >
            {/* Logo */}
            <Link
                to="/"
                className="text-[26px] max-md:text-[22px] font-black bg-gradient-to-br from-primary to-cyan bg-clip-text text-transparent mr-10 max-md:mr-5 -tracking-wide"
            >
                PhimHay
            </Link>

            {/* Navigation links - ẩn trên mobile */}
            <div className="flex gap-7 flex-1 max-md:hidden">
                {NAV_LINKS.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`text-sm font-medium transition-colors py-1 relative
                            ${location.pathname === link.path
                                ? 'text-white after:content-[""] after:absolute after:-bottom-1 after:inset-x-0 after:h-0.5 after:bg-primary after:rounded-sm'
                                : 'text-neutral-400 hover:text-white'
                            }`}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>

            {/* Phần bên phải: search, buttons */}
            <div className="flex items-center gap-4">
                <div className="flex items-center bg-white/10 border border-white/15 rounded-full px-3.5 py-1.5 transition-all focus-within:bg-white/15 focus-within:border-white/30">
                    <svg className="w-4 h-4 fill-neutral-500 mr-2 shrink-0" viewBox="0 0 24 24">
                        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Tìm phim, diễn viên..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="bg-transparent border-none outline-none text-white text-[13px] w-40 max-md:w-[100px] placeholder:text-neutral-500"
                    />
                </div>
                <button className="px-5 py-[7px] bg-gradient-to-br from-primary to-primary-dark text-white text-[13px] font-semibold rounded transition-all hover:-translate-y-px hover:shadow-[0_4px_15px_rgba(30,144,255,0.4)]">
                    Mua VIP
                </button>
                <button className="px-5 py-[7px] bg-primary text-white text-[13px] font-semibold rounded hover:bg-primary-light transition-colors">
                    Đăng nhập
                </button>
                <button className="hidden max-md:block bg-transparent text-white text-2xl">☰</button>
            </div>
        </nav>
    );
}

export default Navbar;
