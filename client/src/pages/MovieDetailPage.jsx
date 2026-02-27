import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMovieDetail } from '../hooks/useMovies';
import { getPosterUrl, getThumbUrl } from '../utils/constants';
import Loading from '../components/common/Loading';

// Số tập hiển thị mỗi trang (range tab)
const EPISODES_PER_RANGE = 30;

/**
 * Trang chi tiết phim - thiết kế theo kiểu VieON
 * Video player trên cùng, thông tin phim bên dưới, danh sách tập dạng card ngang
 * Sử dụng group/ep pattern cho hiệu ứng hover card tập phim
 */
function MovieDetailPage() {
    const { slug } = useParams();
    const { data, loading, error, refetch } = useMovieDetail(slug);
    const [activeEpisode, setActiveEpisode] = useState(null);
    const [activeRange, setActiveRange] = useState(0);
    const playerRef = useRef(null);
    const episodeScrollRef = useRef(null);

    // Parse movie data
    const movie = useMemo(() => {
        if (!data) return null;
        return data?.data?.item || data?.item || data;
    }, [data]);

    // Parse episodes từ tất cả server
    const episodes = useMemo(() => {
        if (!movie) return [];
        const eps = movie.episodes || [];
        if (eps.length > 0 && eps[0]?.server_data) {
            return eps[0].server_data;
        }
        return [];
    }, [movie]);

    // Scroll lên đầu trang khi vào trang chi tiết phim
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [slug]);

    // Tự động phát tập 1 khi load xong data
    useEffect(() => {
        if (episodes.length > 0 && activeEpisode === null) {
            setActiveEpisode(0);
        }
    }, [episodes]);

    // Tạo range tabs (01-30, 31-60, ...)
    const episodeRanges = useMemo(() => {
        if (episodes.length <= EPISODES_PER_RANGE) return [];
        const ranges = [];
        for (let i = 0; i < episodes.length; i += EPISODES_PER_RANGE) {
            const start = i + 1;
            const end = Math.min(i + EPISODES_PER_RANGE, episodes.length);
            ranges.push({
                label: `${String(start).padStart(2, '0')}-${String(end).padStart(2, '0')}`,
                start: i,
                end,
            });
        }
        return ranges;
    }, [episodes]);

    // Lấy danh sách tập theo range hiện tại
    const visibleEpisodes = useMemo(() => {
        if (episodeRanges.length === 0) return episodes;
        const range = episodeRanges[activeRange];
        if (!range) return episodes;
        return episodes.slice(range.start, range.end);
    }, [episodes, episodeRanges, activeRange]);

    // Xử lý chọn tập phim
    const handleEpisodeClick = useCallback((globalIndex) => {
        setActiveEpisode(globalIndex);
        if (playerRef.current) {
            playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    // Chuyển tập tiếp theo
    const handleNextEpisode = useCallback(() => {
        if (activeEpisode !== null && activeEpisode < episodes.length - 1) {
            const nextIndex = activeEpisode + 1;
            setActiveEpisode(nextIndex);
            if (episodeRanges.length > 0) {
                const rangeIndex = Math.floor(nextIndex / EPISODES_PER_RANGE);
                if (rangeIndex !== activeRange) {
                    setActiveRange(rangeIndex);
                }
            }
        }
    }, [activeEpisode, episodes.length, episodeRanges, activeRange]);

    // Reset scroll episode list khi đổi range
    useEffect(() => {
        if (episodeScrollRef.current) {
            episodeScrollRef.current.scrollLeft = 0;
        }
    }, [activeRange]);

    // Scroll episode list bằng nút
    const scrollEpisodes = useCallback((direction) => {
        if (episodeScrollRef.current) {
            const scrollAmount = direction === 'left' ? -400 : 400;
            episodeScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }, []);

    if (loading) return <Loading fullScreen />;

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-10 mt-20">
                <h2 className="text-2xl text-white mb-3">Không thể tải phim</h2>
                <p className="text-neutral-500 mb-6">{error}</p>
                <button
                    onClick={refetch}
                    className="px-7 py-2.5 bg-primary text-white text-sm font-semibold rounded hover:bg-primary-light transition-colors"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    if (!movie) return null;

    const posterUrl = getPosterUrl(movie.poster_url);
    const thumbUrl = getThumbUrl(movie.thumb_url);
    const categories = movie.category || [];
    const countries = movie.country || [];
    const actors = movie.actor || [];
    const directors = movie.director || [];
    const isPlaying = activeEpisode !== null && episodes[activeEpisode]?.link_embed;

    return (
        <div className="pt-16 min-h-screen" ref={playerRef}>
            {/* ===== VIDEO PLAYER / BANNER ===== */}
            <div className="relative w-full bg-black">
                {isPlaying ? (
                    <div className="relative w-full aspect-video max-h-[80vh] bg-black">
                        <iframe
                            className="absolute top-0 left-0 w-full h-full border-none"
                            src={episodes[activeEpisode].link_embed}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allowFullScreen
                            allow="autoplay; encrypted-media"
                            title={`Tập ${activeEpisode + 1}`}
                        />
                    </div>
                ) : (
                    <div className="relative w-full h-[60vh] min-h-[400px] max-md:h-[45vh] max-md:min-h-[250px] overflow-hidden">
                        {thumbUrl ? (
                            <img className="w-full h-full object-cover" src={thumbUrl} alt={movie.name} />
                        ) : (
                            <div
                                className="w-full h-full"
                                style={{ background: 'linear-gradient(135deg, #1a0a2e, #2d1b69)' }}
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent" />
                        {episodes.length > 0 && (
                            <button
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-primary/85 border-[3px] border-white text-white flex items-center justify-center cursor-pointer z-[3] transition-all hover:bg-primary hover:scale-110 hover:shadow-[0_0_30px_rgba(30,144,255,0.5)]"
                                onClick={() => handleEpisodeClick(0)}
                                aria-label="Xem phim"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* ===== THÔNG TIN PHIM DƯỚI PLAYER ===== */}
            <div className="px-12 max-lg:px-6 max-md:px-4 pt-6 pb-10 max-md:pb-8 max-w-[1400px] mx-auto">
                {/* Tiêu đề + meta + actions */}
                <div className="flex max-md:flex-col justify-between items-start gap-6 max-md:gap-4 mb-5">
                    <div className="flex-1">
                        {isPlaying && (
                            <p className="text-sm text-primary font-semibold mb-2">
                                Tập {episodes[activeEpisode]?.name || activeEpisode + 1}
                            </p>
                        )}

                        <h1 className="text-[28px] max-md:text-[22px] font-black text-white mb-1.5 leading-tight">
                            {movie.name}
                        </h1>

                        {movie.origin_name && (
                            <p className="text-base text-neutral-500 mb-3">{movie.origin_name}</p>
                        )}

                        {/* Lượt xem */}
                        <div className="flex items-center gap-4 mb-3 text-sm text-neutral-400">
                            {movie.view && (
                                <span className="text-neutral-300">
                                    {Number(movie.view).toLocaleString('vi-VN')} lượt xem
                                </span>
                            )}
                        </div>

                        {/* Year | Country | Quality */}
                        <div className="flex items-center gap-2 flex-wrap text-sm">
                            {movie.year && (
                                <span className="text-neutral-400">{movie.year}</span>
                            )}
                            {countries.length > 0 && (
                                <>
                                    <span className="text-neutral-600">|</span>
                                    <span className="text-neutral-400">{countries.map(c => c.name).join(', ')}</span>
                                </>
                            )}
                            {movie.episode_current && (
                                <>
                                    <span className="text-neutral-600">|</span>
                                    <span className="text-neutral-400">{movie.episode_current}</span>
                                </>
                            )}
                            {movie.quality && (
                                <>
                                    <span className="text-neutral-600">|</span>
                                    <span className="text-primary font-bold">{movie.quality}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-6 shrink-0 max-md:justify-start">
                        <div className="flex flex-col items-center gap-1.5 cursor-pointer text-neutral-500 hover:text-primary transition-colors text-xs">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                            <span>Yêu thích</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 cursor-pointer text-neutral-500 hover:text-primary transition-colors text-xs">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                            <span>Bình luận</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 cursor-pointer text-neutral-500 hover:text-primary transition-colors text-xs">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                            </svg>
                            <span>Chia sẻ</span>
                        </div>
                    </div>
                </div>

                {/* Diễn viên, đạo diễn, thể loại */}
                <div className="mb-5 border-t border-white/[0.08] pt-4">
                    {actors.length > 0 && (
                        <p className="text-sm text-neutral-400 mb-2 leading-relaxed">
                            <strong className="text-neutral-300 mr-2">Diễn viên:</strong>
                            {actors.join(', ')}
                        </p>
                    )}
                    {directors.length > 0 && (
                        <p className="text-sm text-neutral-400 mb-2 leading-relaxed">
                            <strong className="text-neutral-300 mr-2">Đạo diễn:</strong>
                            {directors.join(', ')}
                        </p>
                    )}
                    {categories.length > 0 && (
                        <p className="text-sm text-neutral-400 mb-2 leading-relaxed">
                            <strong className="text-neutral-300 mr-2">Thể loại:</strong>{' '}
                            {categories.map((cat, i) => (
                                <span key={cat.slug}>
                                    <Link to={`/the-loai/${cat.slug}`} className="text-primary hover:text-primary-light hover:underline transition-colors">
                                        {cat.name}
                                    </Link>
                                    {i < categories.length - 1 && ', '}
                                </span>
                            ))}
                        </p>
                    )}
                </div>

                {/* Mô tả phim */}
                {movie.content && (
                    <div className="text-[15px] text-neutral-400 leading-[1.8] mb-8 py-4 border-t border-white/[0.08]">
                        <div dangerouslySetInnerHTML={{ __html: movie.content }} />
                    </div>
                )}

                {/* ===== DANH SÁCH TẬP - KIỂU VieON ===== */}
                {episodes.length > 0 && (
                    <div className="mt-2 border-t border-white/[0.08] pt-6">
                        <div className="flex max-md:flex-col items-center max-md:items-start gap-6 max-md:gap-3 mb-5 flex-wrap">
                            <h2 className="text-[22px] font-extrabold text-white flex items-center gap-3">
                                Danh sách tập
                                <span className="text-sm font-normal text-neutral-500">
                                    {movie.episode_current || episodes.length}/{movie.episode_total || episodes.length} tập
                                </span>
                            </h2>

                            {/* Range tabs: 01-30, 31-60, ... */}
                            {episodeRanges.length > 0 && (
                                <div className="flex gap-2">
                                    {episodeRanges.map((range, index) => (
                                        <button
                                            key={index}
                                            className={`px-4 py-1.5 text-[13px] font-medium bg-transparent cursor-pointer border-b-2 transition-all
                                                ${activeRange === index
                                                    ? 'text-white border-b-primary font-bold'
                                                    : 'text-neutral-500 border-b-transparent hover:text-white'
                                                }`}
                                            onClick={() => setActiveRange(index)}
                                        >
                                            {range.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Episode cards - scroll ngang */}
                        <div className="relative">
                            {/* Nút cuộn trái */}
                            <button
                                className="absolute top-1/2 -translate-y-1/2 left-[-4px] z-[5] w-10 h-20 border-none bg-black/70 text-white text-[28px] cursor-pointer flex items-center justify-center rounded transition-colors hover:bg-primary/80 max-md:hidden"
                                onClick={() => scrollEpisodes('left')}
                                aria-label="Cuộn trái"
                            >
                                ‹
                            </button>

                            <div className="flex gap-4 overflow-x-auto scroll-smooth py-1 pb-4 scrollbar-hide" ref={episodeScrollRef}>
                                {visibleEpisodes.map((ep, localIndex) => {
                                    const globalIndex = episodeRanges.length > 0
                                        ? episodeRanges[activeRange].start + localIndex
                                        : localIndex;
                                    const isActive = activeEpisode === globalIndex;

                                    return (
                                        <div
                                            key={globalIndex}
                                            className={`group/ep flex-[0_0_220px] max-md:flex-[0_0_180px] cursor-pointer rounded-lg overflow-hidden bg-dark-light transition-all duration-300 border-2
                                                hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]
                                                ${isActive
                                                    ? 'border-primary shadow-[0_0_16px_rgba(30,144,255,0.3)]'
                                                    : 'border-transparent hover:border-primary/40'
                                                }`}
                                            onClick={() => handleEpisodeClick(globalIndex)}
                                        >
                                            {/* Thumbnail tập */}
                                            <div className="relative w-full aspect-video overflow-hidden bg-surface">
                                                {thumbUrl ? (
                                                    <img
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover/ep:scale-105"
                                                        src={thumbUrl}
                                                        alt={ep.name || `Tập ${globalIndex + 1}`}
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div
                                                        className="w-full h-full"
                                                        style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}
                                                    />
                                                )}
                                                {/* Play icon overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover/ep:opacity-100 transition-opacity duration-300">
                                                    <svg className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                                {isActive && (
                                                    <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-primary text-white text-[11px] font-semibold rounded">
                                                        Đang phát
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info tập */}
                                            <div className="px-3 py-2.5">
                                                <p className="text-sm font-semibold text-neutral-200 mb-1.5 truncate">
                                                    Tập {ep.name || globalIndex + 1}
                                                </p>
                                                <div className="flex gap-1.5 mb-1">
                                                    {movie.quality && (
                                                        <span className="text-[11px] px-1.5 py-px bg-white/10 text-neutral-400 rounded-[3px] font-medium">
                                                            {movie.quality}
                                                        </span>
                                                    )}
                                                    {movie.lang && (
                                                        <span className="text-[11px] px-1.5 py-px bg-white/10 text-neutral-400 rounded-[3px] font-medium">
                                                            {movie.lang}
                                                        </span>
                                                    )}
                                                </div>
                                                {movie.time && (
                                                    <p className="text-xs text-neutral-600">{movie.time}</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Nút cuộn phải */}
                            <button
                                className="absolute top-1/2 -translate-y-1/2 right-[-4px] z-[5] w-10 h-20 border-none bg-black/70 text-white text-[28px] cursor-pointer flex items-center justify-center rounded transition-colors hover:bg-primary/80 max-md:hidden"
                                onClick={() => scrollEpisodes('right')}
                                aria-label="Cuộn phải"
                            >
                                ›
                            </button>
                        </div>
                    </div>
                )}

                {/* Tập tiếp theo */}
                {isPlaying && activeEpisode < episodes.length - 1 && (
                    <button
                        className="mt-5 px-7 py-3 bg-primary text-white border-none rounded-lg text-[15px] font-semibold cursor-pointer transition-all hover:bg-[#1a7de0] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(30,144,255,0.4)]"
                        onClick={handleNextEpisode}
                    >
                        ▶ Tập tiếp theo
                    </button>
                )}
            </div>
        </div>
    );
}

export default MovieDetailPage;
