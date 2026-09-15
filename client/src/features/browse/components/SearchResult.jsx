import { Link } from 'react-router-dom';
import { RiGridFill } from 'react-icons/ri';
import { getPosterUrl, getYearFromMovie, handleImageError } from '@/shared/lib/helpers';

const SearchResult = ({ movies = [], cdnBase = '', totalItems = 0 }) => {
  return (
    <section className="flex-grow flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <h3 className="font-body-lg text-body-lg text-secondary">Hiển thị <span className="font-mono font-semibold text-on-surface">{totalItems.toLocaleString('vi-VN')}</span> kết quả</h3>
        <div className="flex gap-2 bg-surface-container-high p-1 rounded-lg">
          <span aria-label="Hiển thị dạng lưới" className="flex h-9 w-9 items-center justify-center rounded-md bg-surface text-on-surface shadow-sm"><RiGridFill className="h-5 w-5" aria-hidden="true" /></span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {movies.map((movie) => (
          <article key={movie._id || movie.slug} className="movie-card relative aspect-[2/3] overflow-hidden rounded-lg border border-outline bg-surface-container-high transition-all duration-300 group">
          <Link to={`/movie/${movie.slug}`} className="block h-full">
            <img alt={movie.name} className="w-full h-full object-cover" src={getPosterUrl(movie, cdnBase)} loading="lazy" decoding="async" onError={handleImageError} />
            <div className="on-dark absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/20 to-transparent p-3 opacity-100 transition-opacity duration-300 md:p-4 md:opacity-0 md:group-hover:opacity-100">
              <h4 className="font-headline-md text-body-lg font-bold text-on-surface mb-1 line-clamp-2">{movie.name}</h4>
              <div className="flex items-center gap-2 font-label-sm text-label-sm text-secondary mb-2">
                <span>{getYearFromMovie(movie) || movie.episode_current || movie.lang}</span>
              </div>
              <div className="flex gap-2">
                {(movie.category || []).slice(0, 1).map((category) => (
                  <span key={category.slug} className="px-2 py-1 bg-white/15 rounded-md font-label-sm text-label-sm text-on-surface backdrop-blur-sm">{category.name}</span>
                ))}
              </div>
            </div>
          </Link>
        </article>
        ))}
      </div>
      {!movies.length ? (
        <div className="rounded-xl border border-outline bg-surface-container p-10 text-center text-secondary">
          Không tìm thấy phim phù hợp.
        </div>
      ) : null}
    </section>
  );
};

export default SearchResult;
