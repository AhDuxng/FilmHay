import { memo, useMemo, useState } from 'react';
import SectionHeader from '../common/SectionHeader';
import HorizontalSlider from '../common/HorizontalSlider';
import MovieCard from '../common/MovieCard';
import { CONTENT_WRAP, SECTION_PADDING } from '../../utils/helpers';

const FILTERS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'series', label: 'Phim bộ' },
  { key: 'single', label: 'Phim lẻ' },
  { key: 'hoathinh', label: 'Hoạt hình' },
  { key: 'han-quoc', label: 'Hàn Quốc' },
  { key: 'trung-quoc', label: 'Trung Quốc' },
  { key: 'au-my', label: 'Âu Mỹ' },
];

const TrendingSection = memo(function TrendingSection({ movies = [], cdnBase = '' }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = useMemo(() => {
    if (activeFilter === 'all') {
      return movies;
    }

    if (['series', 'single', 'hoathinh', 'tvshows'].includes(activeFilter)) {
      return movies.filter((movie) => movie.type === activeFilter);
    }

    return movies.filter((movie) => (movie.country || []).some((country) => country.slug === activeFilter));
  }, [activeFilter, movies]);

  if (!movies.length) {
    return null;
  }

  return (
    <section className={`${SECTION_PADDING} ${CONTENT_WRAP} mt-8`}>
      <SectionHeader title="Đang thịnh hành" />

      <div className="scrollbar-hide mb-5 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => setActiveFilter(filter.key)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition md:text-[13px] ${
              activeFilter === filter.key
                ? 'border-primary bg-primary text-white'
                : 'border-white/15 bg-white/5 text-neutral-300 hover:border-white/35 hover:bg-white/10'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <HorizontalSlider>
        {filtered.map((movie) => (
          <MovieCard key={movie._id || movie.slug} movie={movie} landscape inSlider cdnBase={cdnBase} />
        ))}
      </HorizontalSlider>
    </section>
  );
});

export default TrendingSection;
