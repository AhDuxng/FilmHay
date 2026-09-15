import { Link } from 'react-router-dom';
import { RiPlayFill } from 'react-icons/ri';
import { buildMetaText, getPosterUrl, getThumbUrl, getYearFromMovie, handleImageError } from '@/shared/lib/helpers';

const MovieCard = ({
  movie,
  cdnBase = '',
  landscape = false,
  inSlider = false,
  id = '#',
  title,
  image,
  badgeText,
  badgeColor = 'text-secondary',
}) => {
  const movieSlug = movie?.slug || id;
  const movieTitle = movie?.name || title || 'Đang cập nhật';
  const imageUrl = image || (landscape ? getThumbUrl(movie, cdnBase) : getPosterUrl(movie, cdnBase));
  const metaText = badgeText || buildMetaText(movie) || getYearFromMovie(movie) || movie?.episode_current || '';
  const widthClass = inSlider ? (landscape ? 'w-[250px] md:w-[340px]' : 'w-[140px] md:w-[200px]') : 'w-full';
  const aspectClass = landscape ? 'aspect-video' : 'aspect-[2/3]';

  return (
    <article className={`movie-card ${inSlider ? 'flex-none' : ''} ${widthClass} ${aspectClass} rounded-lg overflow-hidden bg-surface-container-high relative cursor-pointer group/card border border-outline`}>
      <Link to={`/movie/${movieSlug}`} className="block h-full">
        <img
          alt={movieTitle}
          className="w-full h-full object-cover"
          src={imageUrl}
          loading="lazy"
          decoding="async"
          onError={handleImageError}
        />
        <div className="movie-card-overlay on-dark absolute inset-0 flex flex-col justify-end p-4">
          <h3 className="font-headline-md text-body-md font-bold truncate mb-1 text-white">{movieTitle}</h3>
          {movie?.origin_name ? (
            <p className="mb-2 truncate text-xs text-secondary">{movie.origin_name}</p>
          ) : null}
          <div className="flex items-center justify-between">
            <span className={`font-label-sm text-label-sm ${badgeColor}`}>{metaText}</span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/50 text-white transition-colors group-hover/card:bg-white group-hover/card:text-black">
              <RiPlayFill className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default MovieCard;
