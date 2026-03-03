import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosterUrl } from '../../utils/constants';
import { handleImageError, SECTION_PADDING } from '../../utils/helpers';
import SectionHeader from '../common/SectionHeader';

const Top10Section = memo(function Top10Section({ movies = [] }) {
    const navigate = useNavigate();
    const top10 = movies.slice(0, 10);

    if (top10.length === 0) return null;

    return (
        <section className={`${SECTION_PADDING} mb-10 relative`}>
            <SectionHeader title="Top 10 hôm nay" />

            <div className="flex gap-4 overflow-x-auto scroll-smooth pb-2.5 scrollbar-hide">
                {top10.map((movie, index) => {
                    const posterUrl = getPosterUrl(movie.poster_url || movie.thumb_url);
                    return (
                        <div
                            key={movie._id || movie.slug}
                            className="flex-[0_0_200px] max-md:flex-[0_0_160px] flex items-end relative cursor-pointer"
                            onClick={() => navigate(`/phim/${movie.slug}`)}
                        >
                            {/* So thu tu lon */}
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
                                    onError={handleImageError}
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
