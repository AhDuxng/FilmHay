import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosterUrl } from '../../utils/constants';

/**
 * Top 10 section - hiển thị số thứ tự lớn phong cách Netflix
 */
const Top10Section = memo(function Top10Section({ movies = [] }) {
    const navigate = useNavigate();
    const top10 = movies.slice(0, 10);

    if (top10.length === 0) return null;

    return (
        <section className="px-12 max-lg:px-6 max-md:px-4 mb-10 relative">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[22px] max-md:text-lg font-bold text-white pl-3.5 relative">
                    <span className="absolute left-0 top-0.5 bottom-0.5 w-1 bg-primary rounded-sm" />
                    Top 10 hôm nay
                </h2>
            </div>

            <div className="flex gap-4 overflow-x-auto scroll-smooth pb-2.5 scrollbar-hide">
                {top10.map((movie, index) => {
                    const posterUrl = getPosterUrl(movie.poster_url || movie.thumb_url);
                    return (
                        <div
                            key={movie._id || movie.slug}
                            className="flex-[0_0_200px] max-md:flex-[0_0_160px] flex items-end relative cursor-pointer"
                            onClick={() => navigate(`/phim/${movie.slug}`)}
                        >
                            {/* Số thứ tự lớn */}
                            <span
                                className="text-[140px] max-md:text-[100px] font-black leading-[0.8] text-transparent mr-[-30px] z-[1] select-none"
                                style={{ WebkitTextStroke: '3px #1e90ff' }}
                            >
                                {index + 1}
                            </span>

                            {/* Poster */}
                            {posterUrl ? (
                                <img
                                    className="w-[140px] max-md:w-[110px] aspect-[2/3] object-cover rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:scale-105"
                                    src={posterUrl}
                                    alt={movie.name}
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.style.background = 'linear-gradient(135deg, #1a1a2e, #2196f3)';
                                        e.target.src = '';
                                    }}
                                />
                            ) : (
                                <div
                                    className="w-[140px] max-md:w-[110px] aspect-[2/3] rounded-lg flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #1a1a2e, #2196f3)' }}
                                >
                                    <span className="text-[28px]">🎬</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
});

export default Top10Section;
