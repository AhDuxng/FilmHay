import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosterUrl, getThumbUrl } from '../../utils/constants';
import PlayIcon from '../common/PlayIcon';

/**
 * HeroCarousel - banner chinh trang chu
 * Tu dong chuyen slide, hover thi dung
 * group/hero pattern hieu ung hover hien mui ten
 */
function HeroCarousel({ movies = [] }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const autoSlideRef = useRef(null);
    const navigate = useNavigate();

    // Chi lay toi da 5 phim cho carousel
    const slides = movies.slice(0, 5);
    const totalSlides = slides.length;

    // Chuyen slide
    const goToSlide = useCallback((index) => {
        setCurrentSlide(index);
    }, []);

    const changeSlide = useCallback((dir) => {
        setCurrentSlide((prev) => {
            let next = prev + dir;
            if (next < 0) next = totalSlides - 1;
            if (next >= totalSlides) next = 0;
            return next;
        });
    }, [totalSlides]);

    // Auto-play
    const startAutoSlide = useCallback(() => {
        autoSlideRef.current = setInterval(() => changeSlide(1), 5000);
    }, [changeSlide]);

    const stopAutoSlide = useCallback(() => {
        if (autoSlideRef.current) {
            clearInterval(autoSlideRef.current);
            autoSlideRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (totalSlides > 1) startAutoSlide();
        return () => stopAutoSlide();
    }, [totalSlides, startAutoSlide, stopAutoSlide]);

    // Trang thai placeholder khi chua co data
    if (slides.length === 0) {
        return (
            <section className="relative w-full h-[85vh] min-h-[500px] max-md:h-[65vh] overflow-hidden">
                <div className="flex h-full">
                    <div className="min-w-full h-full relative">
                        <div
                            className="w-full h-full"
                            style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b69 40%, #11001c 100%)' }}
                        />
                        <div
                            className="absolute inset-0 after:content-[''] after:absolute after:bottom-0 after:inset-x-0 after:h-[200px] after:bg-gradient-to-t after:from-dark after:to-transparent"
                            style={{ background: 'linear-gradient(to right, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.7) 30%, rgba(13,13,13,0.2) 60%, transparent 100%)' }}
                        />
                        <div className="absolute bottom-1/4 left-12 max-md:left-4 max-w-[550px] max-md:max-w-none max-md:right-4 z-[2]">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/90 rounded-[3px] text-[11px] font-bold uppercase tracking-wide mb-4">
                                🔥 PhimHay
                            </div>
                            <h1 className="text-5xl max-lg:text-4xl max-md:text-[28px] font-black leading-[1.1] mb-3 drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]">
                                Đang tải phim...
                            </h1>
                            <p className="text-[15px] max-md:text-[13px] text-neutral-300 leading-relaxed mb-6 line-clamp-3 max-md:line-clamp-2">
                                Vui lòng chờ trong giây lát
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            className="group/hero relative w-full h-[85vh] min-h-[500px] max-md:h-[65vh] overflow-hidden"
            onMouseEnter={stopAutoSlide}
            onMouseLeave={startAutoSlide}
        >
            {/* Slides container */}
            <div
                className="flex h-full"
                style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                    transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
            >
                {slides.map((movie, index) => {
                    const thumbUrl = getThumbUrl(movie.thumb_url) || getPosterUrl(movie.poster_url);
                    const categories = movie.category || [];
                    const genreText = categories.map(c => c.name).slice(0, 3).join(', ');

                    return (
                        <div className="min-w-full h-full relative" key={movie.slug || index}>
                            {/* Background image */}
                            {thumbUrl ? (
                                <img
                                    className="w-full h-full object-cover"
                                    src={thumbUrl}
                                    alt={movie.name}
                                    loading={index === 0 ? 'eager' : 'lazy'}
                                />
                            ) : (
                                <div
                                    className="w-full h-full"
                                    style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b69 40%, #11001c 100%)' }}
                                />
                            )}

                            {/* Gradient overlay (trai -> phai + duoi -> tren) */}
                            <div
                                className="absolute inset-0 after:content-[''] after:absolute after:bottom-0 after:inset-x-0 after:h-[200px] after:bg-gradient-to-t after:from-dark after:to-transparent"
                                style={{ background: 'linear-gradient(to right, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.7) 30%, rgba(13,13,13,0.2) 60%, transparent 100%)' }}
                            />

                            {/* Noi dung slide */}
                            <div className="absolute bottom-1/4 max-md:bottom-[20%] left-12 max-lg:left-6 max-md:left-4 max-w-[550px] max-lg:max-w-[420px] max-md:max-w-none max-md:right-4 z-[2]">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/90 rounded-[3px] text-[11px] font-bold uppercase tracking-wide mb-4">
                                    {index === 0 ? '🔥 Độc quyền' : index === 1 ? '🎬 Phim mới' : '⭐ HOT'}
                                </div>

                                <h1 className="text-5xl max-lg:text-4xl max-md:text-[28px] font-black leading-[1.1] mb-3 drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]">
                                    {movie.name}
                                </h1>

                                {/* Meta info */}
                                <div className="flex items-center gap-3 mb-3.5 text-sm text-neutral-400">
                                    {movie.quality && (
                                        <span className="px-1.5 py-0.5 border border-primary text-primary text-[11px] font-bold rounded-sm">
                                            {movie.quality}
                                        </span>
                                    )}
                                    {movie.year && <span className="text-neutral-300">{movie.year}</span>}
                                    {movie.episode_current && (
                                        <>
                                            <span>•</span>
                                            <span className="text-neutral-300">{movie.episode_current}</span>
                                        </>
                                    )}
                                    {genreText && (
                                        <>
                                            <span>•</span>
                                            <span>{genreText}</span>
                                        </>
                                    )}
                                </div>

                                <p className="text-[15px] max-md:text-[13px] text-neutral-300 leading-relaxed mb-6 line-clamp-3 max-md:line-clamp-2">
                                    {movie.origin_name || movie.name}
                                    {movie.lang ? ` - ${movie.lang}` : ''}
                                </p>

                                {/* Action buttons */}
                                <div className="flex gap-3 max-md:flex-wrap">
                                    <button
                                        className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white text-[15px] font-bold rounded transition-all hover:bg-primary-light hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(30,144,255,0.4)]"
                                        onClick={() => navigate(`/phim/${movie.slug}`)}
                                    >
                                        <PlayIcon className="w-5 h-5 fill-current" />
                                        Xem ngay
                                    </button>
                                    <button
                                        className="inline-flex items-center gap-2 px-7 py-3 bg-white/15 text-white text-[15px] font-medium rounded backdrop-blur-sm transition-all hover:bg-white/25"
                                        onClick={() => navigate(`/phim/${movie.slug}`)}
                                    >
                                        Chi tiết
                                    </button>
                                </div>

                                {/* Genre pills */}
                                {categories.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2.5">
                                        {categories.slice(0, 3).map((cat) => (
                                            <span key={cat.slug} className="px-2.5 py-[3px] bg-white/10 rounded-xl text-[11px] text-neutral-400">
                                                {cat.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mui ten dieu huong + Dots */}
            {totalSlides > 1 && (
                <>
                    <button
                        className="absolute top-1/2 left-4 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center text-xl opacity-0 group-hover/hero:opacity-100 transition-all hover:bg-white/20"
                        onClick={() => changeSlide(-1)}
                    >
                        ❮
                    </button>
                    <button
                        className="absolute top-1/2 right-4 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center text-xl opacity-0 group-hover/hero:opacity-100 transition-all hover:bg-white/20"
                        onClick={() => changeSlide(1)}
                    >
                        ❯
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-15 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {slides.map((_, i) => (
                            <div
                                key={i}
                                className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${
                                    i === currentSlide
                                        ? 'bg-primary scale-120'
                                        : 'bg-white/30 hover:bg-white/60'
                                }`}
                                onClick={() => goToSlide(i)}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}

export default HeroCarousel;
