import { Link } from 'react-router-dom';
import { RiPlayFill, RiStarFill } from 'react-icons/ri';
import { buildMetaText, getPosterUrl, getThumbUrl, getYearFromMovie, handleImageError } from '@/shared/lib/helpers';

function getTmdbBackdrop(images = []) {
  const backdrop = images.find((image) => image.type === 'backdrop' && image.file_path);
  return backdrop ? `https://image.tmdb.org/t/p/w1280${backdrop.file_path}` : '';
}

const MovieBanner = ({ movie, cdnBase = '', images = [] }) => {
  const backdropUrl = getTmdbBackdrop(images) || getThumbUrl(movie, cdnBase);
  const posterUrl = getPosterUrl(movie, cdnBase);
  const meta = [
    movie?.tmdb?.vote_average ? Number(movie.tmdb.vote_average).toFixed(1) : '',
    getYearFromMovie(movie),
    movie?.time,
    movie?.quality,
    movie?.lang,
  ].filter(Boolean);
  const categoryText = (movie?.category || []).slice(0, 3).map((item) => item.name).join(' / ');

  return (
    <section className="relative w-full h-[70vh] min-h-[600px] flex items-end pb-12 pt-32">
      <div className="absolute inset-0 z-0">
        <img
          alt={movie.name}
          className="bg-cover bg-center w-full h-full absolute inset-0 object-cover"
          src={backdropUrl}
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent w-2/3"></div>
      </div>
      <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full flex flex-col md:flex-row gap-8 items-end">
        <div className="hidden md:block w-64 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-outline shrink-0 mb-4">
          <img 
            alt={movie.name} 
            className="w-full h-full object-cover" 
            src={posterUrl}
            onError={handleImageError}
          />
        </div>
        <div className="flex-grow max-w-3xl pb-4">
          <h1 className="mb-4 line-clamp-3 font-display-lg text-4xl font-bold leading-tight text-on-surface sm:text-5xl lg:text-6xl">{movie.name}</h1>
          <p className="mb-4 font-body-md text-body-md text-secondary-fixed-dim">{movie.origin_name || movie.name}</p>
          <div className="flex flex-wrap items-center gap-3 mb-8">
            {meta.map((item, index) => (
              <span key={`${item}-${index}`} className="text-secondary-fixed-dim px-2 py-1 bg-surface-container-high rounded font-label-sm text-label-sm backdrop-blur-sm">
                {index === 0 && movie?.tmdb?.vote_average ? (
                  <span className="inline-flex items-center gap-1 text-primary-container">
                    <RiStarFill className="h-4 w-4" aria-hidden="true" />
                    {item}
                  </span>
                ) : item}
              </span>
            ))}
            {categoryText ? (
              <span className="text-secondary-fixed-dim px-2 py-1 bg-surface-container-high rounded font-label-sm text-label-sm backdrop-blur-sm">{categoryText}</span>
            ) : null}
          </div>
          <div className="flex items-center gap-4">
            <Link to={`/watch/${movie.slug}`} className="flex min-h-12 items-center gap-2 fill-ramp rounded-lg px-6 py-3 font-headline-md text-base font-bold sm:px-8">
              <RiPlayFill className="h-5 w-5 shrink-0" aria-hidden="true" />
              Xem phim
            </Link>
            <span className="hidden md:inline text-secondary-fixed-dim font-body-md text-body-md">{buildMetaText(movie)}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovieBanner;
