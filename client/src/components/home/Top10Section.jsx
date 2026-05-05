import { memo } from 'react';
import { Link } from 'react-router-dom';
import { RiFireFill } from 'react-icons/ri';
import { CONTENT_WRAP, SECTION_PADDING } from '../../utils/helpers';
import SectionHeader from '../common/SectionHeader';
import MovieCard from '../common/MovieCard';

const Top10Section = memo(function Top10Section({ movies = [], cdnBase = '' }) {
  const top10 = movies.slice(0, 10);

  if (!top10.length) {
    return null;
  }

  return (
    <section className={`${SECTION_PADDING} ${CONTENT_WRAP} mt-10`}>
      <SectionHeader title="Top 10 hôm nay" />

      <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-2">
        {top10.map((movie, index) => (
          <div
            key={movie._id || movie.slug}
            className="flex items-end gap-2 shrink-0 pb-1"
          >
            <span
              className="text-6xl font-black leading-none text-transparent md:text-7xl mb-4"
              style={{ WebkitTextStroke: '2px var(--color-primary)' }}
            >
              {index + 1}
            </span>
            <MovieCard movie={movie} cdnBase={cdnBase} inSlider />
          </div>
        ))}
      </div>
    </section>
  );
});

export default Top10Section;
