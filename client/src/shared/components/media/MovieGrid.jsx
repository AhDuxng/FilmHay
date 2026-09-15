import { memo } from 'react';
import MovieCard from '@/shared/components/media/MovieCard';
import { MOVIE_GRID_CLASS } from '@/shared/lib/helpers';

const MovieGrid = memo(function MovieGrid({ movies = [], cdnBase = '' }) {
  if (!movies.length) {
    return null;
  }

  return (
    <div className={MOVIE_GRID_CLASS}>
      {movies.map((movie) => (
        <MovieCard key={movie._id || movie.slug} movie={movie} cdnBase={cdnBase} />
      ))}
    </div>
  );
});

export default MovieGrid;
