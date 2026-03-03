import { memo, useState, useMemo } from 'react';
import MovieCard from '../common/MovieCard';
import SectionHeader from '../common/SectionHeader';
import HorizontalSlider from '../common/HorizontalSlider';
import { CATEGORY_TABS } from '../../utils/constants';
import { SECTION_PADDING } from '../../utils/helpers';

const TrendingSection = memo(function TrendingSection({ movies = [] }) {
    const [activeTab, setActiveTab] = useState('all');

    // Loc phim theo quoc gia tu tab dang chon
    const filteredMovies = useMemo(() => {
        if (activeTab === 'all') return movies;
        return movies.filter((movie) => {
            const countries = movie.country || [];
            return countries.some((c) => c.slug === activeTab);
        });
    }, [movies, activeTab]);

    if (!movies || movies.length === 0) return null;

    return (
        <section className={`${SECTION_PADDING} mb-10 relative`}>
            <SectionHeader title="Đang thịnh hành" moreLink="#" />

            {/* Category tabs */}
            <div className="flex gap-3 mb-5 overflow-x-auto scrollbar-hide pb-1">
                {CATEGORY_TABS.map((tab) => (
                    <button
                        key={tab.value}
                        className={`px-5 py-2 text-[13px] font-medium rounded-full whitespace-nowrap transition-all
                            ${activeTab === tab.value
                                ? 'bg-primary text-white'
                                : 'bg-white/[0.08] text-neutral-300 hover:bg-white/15 hover:text-white'
                            }`}
                        onClick={() => setActiveTab(tab.value)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Slider phim cuon ngang */}
            <HorizontalSlider>
                {filteredMovies.map((movie) => (
                    <MovieCard
                        key={movie._id || movie.slug}
                        movie={movie}
                        landscape
                    />
                ))}
            </HorizontalSlider>
        </section>
    );
});

export default TrendingSection;
