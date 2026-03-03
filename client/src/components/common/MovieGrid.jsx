import { memo } from 'react';
import MovieCard from './MovieCard';
import { MOVIE_GRID_CLASS } from '../../utils/helpers';

const MovieGrid = memo(function MovieGrid({ movies = [] }) {
    if (movies.length === 0) return null;

    return (
        <div className={MOVIE_GRID_CLASS}>
            {movies.map((movie) => (
                <MovieCard key={movie._id || movie.slug} movie={movie} />
            ))}
        </div>
    );
});

export default MovieGrid;
