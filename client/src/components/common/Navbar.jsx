import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../../utils/constants';
import SearchSuggestions from './SearchSuggestions';
import { useAuth } from '../../contexts/AuthContext';

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const searchWrapperRef = useRef(null);
    const suggestKeyDownRef = useRef(null);
    const userMenuRef = useRef(null);
    const { user, logout } = useAuth();

    // them nen dam khi cuon xuong
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Xu ly tim kiem + chuyen keyboard events cho dropdown goi y
    const handleSearch = useCallback((e) => {
        
        if (suggestKeyDownRef.current) {
            suggestKeyDownRef.current(e);
            
            if (['ArrowDown', 'ArrowUp'].includes(e.key)) return;
            if (e.key === 'Enter' && e.defaultPrevented) return;
        }
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/tim-kiem?keyword=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setSearchFocused(false);
        }
    }, [searchQuery, navigate]);

    // Dong dropdown khi click ra ngoai vung search
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
                setSearchFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Dong dropdown khi chuyen trang
    useEffect(() => {
        setSearchFocused(false);
        setSearchQuery('');
        setUserMenuOpen(false);
    }, [location.pathname]);

    // Dong user menu khi click ra ngoai
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Xu ly logout
    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

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

            {/* Navigation links - an tren mobile */}
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

            {/* search, buttons */}
            <div className="flex items-center gap-4">
                {/* Search box + dropdown goi y */}
                <div className="relative" ref={searchWrapperRef}>
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
                            onFocus={() => setSearchFocused(true)}
                            className="bg-transparent border-none outline-none text-white text-[13px] w-40 max-md:w-[100px] placeholder:text-neutral-500"
                        />
                    </div>

                    {/* goi y tim kiem */}
                    <SearchSuggestions
                        query={searchQuery}
                        isFocused={searchFocused}
                        onSelect={() => {
                            setSearchQuery('');
                            setSearchFocused(false);
                        }}
                        onKeyDown={(handler) => { suggestKeyDownRef.current = handler; }}
                    />
                </div>

                {/* User menu */}
                <div className="relative" ref={userMenuRef}>
                    <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/15 rounded-full hover:bg-white/15 transition-all"
                    >
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-cyan flex items-center justify-center text-white text-sm font-semibold">
                            {user?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <span className="text-white text-sm font-medium max-md:hidden">
                            {user?.username || 'User'}
                        </span>
                        <svg 
                            className={`w-4 h-4 fill-white transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} 
                            viewBox="0 0 24 24"
                        >
                            <path d="M7 10l5 5 5-5z"/>
                        </svg>
                    </button>

                    {/* Dropdown menu */}
                    {userMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl overflow-hidden animate-slideDown">
                            <div className="px-4 py-3 border-b border-white/10">
                                <p className="text-white font-semibold text-sm">{user?.full_name || user?.username}</p>
                                <p className="text-neutral-400 text-xs mt-0.5">{user?.email}</p>
                                {user?.role === 'admin' && (
                                    <span className="inline-block mt-2 px-2 py-0.5 bg-primary/20 text-primary text-xs font-medium rounded">
                                        Admin
                                    </span>
                                )}
                            </div>
                            <div className="py-1">
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2.5 text-left text-white hover:bg-white/10 transition-colors flex items-center gap-2 text-sm"
                                >
                                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                                    </svg>
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <button className="hidden max-md:block bg-transparent text-white text-2xl">☰</button>
            </div>
        </nav>
    );
}

export default Navbar;
