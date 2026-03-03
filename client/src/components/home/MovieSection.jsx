import { memo } from 'react';
import MovieCard from '../common/MovieCard';
import SectionHeader from '../common/SectionHeader';
import HorizontalSlider from '../common/HorizontalSlider';
import { SECTION_PADDING } from '../../utils/helpers';

const MovieSection = memo(function MovieSection({
    title,
    movies = [],
    moreLink,
    landscape = false,
}) {
    if (!movies || movies.length === 0) return null;

    return (
        <section className={`${SECTION_PADDING} mb-10 relative`}>
            <SectionHeader title={title} moreLink={moreLink} />

            {/* Slider phim cuon ngang */}
            <HorizontalSlider>
                {movies.map((movie) => (
                    <MovieCard
                        key={movie._id || movie.slug}
                        movie={movie}
                        landscape={landscape}
                    />
                ))}
            </HorizontalSlider>
        </section>
    );
});

export default MovieSection;
