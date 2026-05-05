import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { RiPlayFill, RiStarFill } from 'react-icons/ri';
import { buildMetaText, getPosterUrl, getThumbUrl, handleImageError, getYearFromMovie } from '../../utils/helpers';

const MovieCard = memo(function MovieCard({ movie, landscape = true, inSlider = true, cdnBase = '' }) {
  const imageUrl = landscape ? getThumbUrl(movie, cdnBase) : getPosterUrl(movie, cdnBase);
  const title = movie?.name || movie?.origin_name || 'Untitled';
  const genre = movie?.category?.[0]?.name || '';
  const metaText = buildMetaText(movie);
  const year = getYearFromMovie(movie);

  const badge = useMemo(() => {
    const quality = String(movie?.quality || '').toLowerCase();
    if (quality.includes('4k')) {
      return '4K';
    }
    if (String(movie?.episode_current || '').toLowerCase().includes('full')) {
      return 'FULL';
    }
    return movie?.quality || 'HD';
  }, [movie]);

  return (
    <Link
      to={`/phim/${movie.slug}`}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-surface-2 transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.35)] ${
        inSlider ? 'shrink-0 w-[300px] sm:w-[320px] md:w-[360px]' : 'w-full'
      }`}
    >
      <div className="relative overflow-hidden aspect-video">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          onError={handleImageError}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80" />

        <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
          {badge}
        </span>

        {year ? (
          <span className="absolute right-3 top-3 rounded-full border border-white/25 bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white">
            {year}
          </span>
        ) : null}

        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-[0_10px_30px_rgba(255,143,163,0.45)]">
            <RiPlayFill className="text-xl" />
          </span>
        </div>
      </div>

      <div className="space-y-1.5 p-3.5">
        <p className="line-clamp-1 text-sm font-semibold text-white md:text-[15px]">{title}</p>
        <p className="line-clamp-1 text-xs text-neutral-400">{movie?.origin_name || title}</p>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          {genre ? <span className="line-clamp-1">{genre}</span> : null}
          {metaText ? <span className="line-clamp-1">• {metaText}</span> : null}
        </div>
        {movie?.episode_current ? (
          <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white">
            <RiStarFill className="text-[12px] text-accent" />
            {movie.episode_current}
          </div>
        ) : null}
      </div>
    </Link>
  );
});

export default MovieCard;
