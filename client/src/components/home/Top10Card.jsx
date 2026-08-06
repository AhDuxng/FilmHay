import { Link } from 'react-router-dom';
import { getPosterUrl, handleImageError } from '../../utils/helpers';

export const Top10Card = ({ id = '#', rank, image, title, movie, cdnBase = '' }) => {
  const slug = movie?.slug || id;
  const movieTitle = movie?.name || title;
  const imageUrl = image || getPosterUrl(movie, cdnBase);

  return (
    <div className="flex-none flex items-center h-[200px] md:h-[280px]">
      <div className="font-display-lg text-[120px] md:text-[200px] font-bold leading-none tracking-tighter text-outline-variant mr-[-30px] z-0 drop-shadow-lg">
        {rank}
      </div>
      <div className="movie-card w-[120px] md:w-[180px] rounded-lg overflow-hidden bg-surface-container-high relative z-10 border border-white/5">
        <Link to={`/movie/${slug}`}>
          <img 
            alt={movieTitle} 
            className="w-full h-full object-cover" 
            src={imageUrl}
            loading="lazy"
            decoding="async"
            onError={handleImageError}
          />
        </Link>
      </div>
    </div>
  );
};
