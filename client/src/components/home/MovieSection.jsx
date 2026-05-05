import { memo } from 'react';
import MovieCard from '../common/MovieCard';
import SectionHeader from '../common/SectionHeader';
import HorizontalSlider from '../common/HorizontalSlider';
import { CONTENT_WRAP, SECTION_PADDING } from '../../utils/helpers';

const MovieSection = memo(function MovieSection({ title, movies = [], moreLink, landscape = false, cdnBase = '' }) {
  if (!movies.length) {
    return null;
  }

  return (
    <section className={`${SECTION_PADDING} ${CONTENT_WRAP} mt-10`}>
      <SectionHeader title={title} moreLink={moreLink} />
      <HorizontalSlider>
        {movies.map((movie) => (
          <MovieCard
            key={movie._id || movie.slug}
            movie={movie}
            landscape={landscape}
            inSlider={true}
            cdnBase={cdnBase}
          />
        ))}
      </HorizontalSlider>
    </section>
  );
});

export default MovieSection;
