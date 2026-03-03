import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieApi } from '../../services/api';
import { useDebounce } from '../../hooks/useDebounce';
import { getPosterUrl } from '../../utils/constants';
import { handleImageError, scrollToTop } from '../../utils/helpers';

/**
 * @param {string} query - tu khoa tim kiem hien tai
 * @param {boolean} isFocused - input dang duoc focus hay khong
 * @param {function} onSelect - callback khi chon 1 goi y (reset input)
 * @param {function} onKeyDown - expose handleKeyDown ra ngoai de gan vao input
 */
const SearchSuggestions = memo(function SearchSuggestions({ query, isFocused, onSelect, onKeyDown: exposeKeyDown }) {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const navigate = useNavigate();
    const listRef = useRef(null);
    const mountedRef = useRef(true);

    // Debounce tu khoa - chi goi API sau 400ms ngung go
    const debouncedQuery = useDebounce(query, 400);

    // Goi API suggest khi tu khoa thay doi
    useEffect(() => {
        // Can it nhat 2 ky tu de goi API
        if (!debouncedQuery || debouncedQuery.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        let cancelled = false;
        const fetchSuggestions = async () => {
            try {
                setLoading(true);
                const response = await movieApi.suggestMovies(debouncedQuery.trim());
                if (!cancelled && mountedRef.current) {
                    setSuggestions(response.data?.items || []);
                    setActiveIndex(-1);
                }
            } catch {
                // Im lang khi loi - khong hien loi cho dropdown goi y
                if (!cancelled && mountedRef.current) {
                    setSuggestions([]);
                }
            } finally {
                if (!cancelled && mountedRef.current) {
                    setLoading(false);
                }
            }
        };

        fetchSuggestions();

        return () => {
            cancelled = true;
        };
    }, [debouncedQuery]);

    // Cleanup khi unmount
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    // Xu ly chon 1 goi y phim
    const handleSelect = useCallback((slug) => {
        if (slug) {
            scrollToTop();
            navigate(`/phim/${slug}`);
            onSelect?.();
            setSuggestions([]);
        }
    }, [navigate, onSelect]);

    // Xu ly keyboard navigation trong dropdown
    const handleKeyDown = useCallback((e) => {
        if (suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
                break;
            case 'Enter':
                if (activeIndex >= 0 && suggestions[activeIndex]) {
                    e.preventDefault();
                    handleSelect(suggestions[activeIndex].slug);
                }
                break;
            case 'Escape':
                setSuggestions([]);
                setActiveIndex(-1);
                break;
        }
    }, [suggestions, activeIndex, handleSelect]);

    useEffect(() => {
        if (exposeKeyDown) exposeKeyDown(handleKeyDown);
    }, [handleKeyDown, exposeKeyDown]);

    // Scroll item active vao view khi dung keyboard
    useEffect(() => {
        if (activeIndex >= 0 && listRef.current) {
            const activeItem = listRef.current.children[activeIndex];
            if (activeItem) {
                activeItem.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [activeIndex]);

    // Khong hien khi: khong focus, khong co ket qua, query qua ngan
    const shouldShow = isFocused && (loading || suggestions.length > 0) && query.trim().length >= 2;
    if (!shouldShow) return null;

    return (
        <div
            className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/15 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] overflow-hidden z-[1001] backdrop-blur-sm"
            ref={listRef}
        >
            {/* Loading state */}
            {loading && suggestions.length === 0 && (
                <div className="px-4 py-3 text-sm text-neutral-500 text-center">
                    Đang tìm kiếm...
                </div>
            )}

            {/* Danh sach goi y */}
            {suggestions.map((movie, index) => {
                const posterUrl = getPosterUrl(movie.poster_url || movie.thumb_url);
                const isActive = index === activeIndex;

                return (
                    <div
                        key={movie.slug}
                        className={`flex items-center gap-3 px-3.5 py-2.5 cursor-pointer transition-colors duration-150
                            ${isActive ? 'bg-white/[0.12]' : 'hover:bg-white/[0.08]'}
                            ${index < suggestions.length - 1 ? 'border-b border-white/[0.06]' : ''}
                        `}
                        onClick={() => handleSelect(movie.slug)}
                        onMouseEnter={() => setActiveIndex(index)}
                    >
                        {/* Poster nho */}
                        <div className="w-11 h-[60px] shrink-0 rounded overflow-hidden bg-dark-light">
                            {posterUrl ? (
                                <img
                                    className="w-full h-full object-cover"
                                    src={posterUrl}
                                    alt={movie.name}
                                    loading="lazy"
                                    onError={handleImageError}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center">
                                    <span className="text-lg">🎬</span>
                                </div>
                            )}
                        </div>

                        {/* Thong tin phim */}
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-white truncate">{movie.name}</p>
                            {movie.origin_name && (
                                <p className="text-[11px] text-neutral-500 truncate mt-0.5">{movie.origin_name}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400">
                                {movie.year && <span>{movie.year}</span>}
                                {movie.quality && (
                                    <span className="px-1.5 py-px bg-primary/20 text-primary rounded text-[10px] font-bold">
                                        {movie.quality}
                                    </span>
                                )}
                                {movie.episode_current && <span>{movie.episode_current}</span>}
                            </div>
                        </div>

                        {/* Icon mui ten */}
                        <svg className="w-4 h-4 fill-neutral-600 shrink-0" viewBox="0 0 24 24">
                            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                        </svg>
                    </div>
                );
            })}

            {/* Link xem tat ca ket qua */}
            {suggestions.length > 0 && !loading && (
                <div
                    className="px-4 py-2.5 text-center text-[12px] text-primary font-medium cursor-pointer hover:bg-white/[0.06] transition-colors border-t border-white/[0.08]"
                    onClick={() => {
                        navigate(`/tim-kiem?keyword=${encodeURIComponent(query.trim())}`);
                        onSelect?.();
                        setSuggestions([]);
                    }}
                >
                    Xem tất cả kết quả cho &quot;{query.trim()}&quot; →
                </div>
            )}
        </div>
    );
});

export default SearchSuggestions;
