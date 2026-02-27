import { memo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../common/MovieCard';

/**
 * Section phim với slider ngang
 * Dùng cho: phim bộ, phim lẻ, hành động, tình cảm, hoạt hình...
 * group/slider pattern cho hiệu ứng hover hiện mũi tên
 */
const MovieSection = memo(function MovieSection({
    title,
    movies = [],
    moreLink,
    landscape = false,
}) {
    const rowRef = useRef(null);

    // Scroll slider trái/phải
    const scroll = useCallback((direction) => {
        if (!rowRef.current) return;
        const scrollAmount = direction === 'left' ? -600 : 600;
        rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }, []);

    if (!movies || movies.length === 0) return null;

    return (
        <section className="px-12 max-lg:px-6 max-md:px-4 mb-10 relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[22px] max-md:text-lg font-bold text-white pl-3.5 relative">
                    <span className="absolute left-0 top-0.5 bottom-0.5 w-1 bg-primary rounded-sm" />
                    {title}
                </h2>
                {moreLink && (
                    <Link to={moreLink} className="text-[13px] text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
                        Xem thêm →
                    </Link>
                )}
            </div>

            {/* Slider */}
            <div className="group/slider relative">
                <div className="flex gap-3 overflow-x-auto scroll-smooth pb-2.5 scrollbar-hide" ref={rowRef}>
                    {movies.map((movie) => (
                        <MovieCard
                            key={movie._id || movie.slug}
                            movie={movie}
                            landscape={landscape}
                        />
                    ))}
                </div>

                {/* Mũi tên trái */}
                <div
                    className="absolute top-0 bottom-2.5 left-[-10px] w-12 z-[5] flex items-center justify-center text-white text-2xl cursor-pointer opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(to right, rgba(13,13,13,0.9), transparent)' }}
                    onClick={() => scroll('left')}
                >
                    ❮
                </div>

                {/* Mũi tên phải */}
                <div
                    className="absolute top-0 bottom-2.5 right-[-10px] w-12 z-[5] flex items-center justify-center text-white text-2xl cursor-pointer opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(to left, rgba(13,13,13,0.9), transparent)' }}
                    onClick={() => scroll('right')}
                >
                    ❯
                </div>
            </div>
        </section>
    );
});

export default MovieSection;
