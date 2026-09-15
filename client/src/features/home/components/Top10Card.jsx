import { Link } from 'react-router-dom';
import { getPosterUrl, handleImageError } from '@/shared/lib/helpers';
import { rampVar } from '@/shared/lib/ramp';

const Top10Card = ({ id = '#', rank, image, title, movie, cdnBase = '' }) => {
  const slug = movie?.slug || id;
  const movieTitle = movie?.name || title;
  const imageUrl = image || getPosterUrl(movie, cdnBase);

  return (
    <div className="flex-none flex items-center h-[200px] md:h-[280px]">
      <div
        className="font-mono text-[120px] md:text-[200px] font-bold leading-none tracking-tighter mr-[-30px] z-0 drop-shadow-lg"
        style={{ color: rampVar(Number(rank) - 1) }}
      >
        {rank}
      </div>
      <div className="movie-card w-[120px] md:w-[180px] rounded-lg overflow-hidden bg-surface-container-high relative z-10 border border-outline">
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

export default Top10Card;
