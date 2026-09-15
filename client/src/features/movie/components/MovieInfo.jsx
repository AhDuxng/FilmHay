import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import { getImageUrl } from '@/shared/lib/helpers';

function getPeopleImage(path) {
  if (!path) {
    return '';
  }
  return `https://image.tmdb.org/t/p/w185${path}`;
}

const MovieInfo = ({ movie, cdnBase = '', peoples = [], keywords = [] }) => {
  const cast = peoples.slice(0, 8);
  const actors = movie?.actor || [];
  const directors = movie?.director || [];

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
      <div className="lg:col-span-2 space-y-16">
        <section>
          <h2 className="text-ramp font-headline-lg text-headline-lg mb-6">Nội dung phim</h2>
          <div
            className="font-body-lg text-body-lg text-secondary-fixed-dim leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(movie?.content || 'Đang cập nhật mô tả.'),
            }}
          />
        </section>

        {cast.length || actors.length ? (
        <section>
          <h2 className="text-ramp font-headline-lg text-headline-lg mb-6">Diễn viên</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {cast.length ? cast.map((person) => (
              <div key={`${person.tmdb_people_id || person.name}-${person.character || ''}`} className="flex flex-col gap-3 group">
                <div className="w-full aspect-square rounded-full overflow-hidden border border-outline group-hover:border-primary-container/50 transition-colors">
                  <img alt={person.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={getPeopleImage(person.profile_path) || getImageUrl(movie?.thumb_url, cdnBase)} />
                </div>
                <div className="text-center">
                  <p className="font-body-lg text-body-md text-on-surface font-semibold line-clamp-1">{person.name}</p>
                  <p className="font-body-md text-label-sm text-secondary line-clamp-1">{person.character || person.known_for_department}</p>
                </div>
              </div>
            )) : actors.slice(0, 8).map((actor) => (
              <div key={actor} className="rounded-lg border border-outline bg-surface-container p-4 text-center text-on-surface">
                {actor}
              </div>
            ))}
          </div>
        </section>
        ) : null}
      </div>

      <div className="space-y-12">
        <div className="bg-[#252526] border border-outline rounded-xl p-6 glass-panel">
          <h3 className="font-headline-md text-body-lg text-on-surface mb-4">Thông tin</h3>
          <ul className="space-y-4 font-body-md text-body-md">
            {directors.length ? (
              <li className="flex flex-col">
                <span className="text-secondary font-label-sm text-label-sm uppercase tracking-wider mb-1">Đạo diễn</span>
                <span className="text-on-surface">{directors.join(', ')}</span>
              </li>
            ) : null}
            {(movie?.country || []).length ? (
              <li className="flex flex-col">
                <span className="text-secondary font-label-sm text-label-sm uppercase tracking-wider mb-1">Quốc gia</span>
                <span className="text-on-surface">{movie.country.map((country) => country.name).join(', ')}</span>
              </li>
            ) : null}
            {(movie?.category || []).length ? (
              <li className="flex flex-col">
                <span className="text-secondary font-label-sm text-label-sm uppercase tracking-wider mb-1">Thể loại</span>
                <div className="flex flex-wrap gap-2">
                  {movie.category.map((category) => (
                    <Link key={category.slug} to={`/the-loai/${category.slug}`} className="rounded bg-surface-container-high px-2 py-1 text-sm text-on-surface hover:bg-surface-container-highest">
                      {category.name}
                    </Link>
                  ))}
                </div>
              </li>
            ) : null}
            {keywords.length ? (
              <li className="flex flex-col">
                <span className="text-secondary font-label-sm text-label-sm uppercase tracking-wider mb-1">Từ khóa</span>
                <div className="flex flex-wrap gap-2">
                  {keywords.slice(0, 12).map((keyword, index) => (
                    <span key={`${keyword.id || keyword.name || keyword.keyword}-${index}`} className="rounded bg-surface-container-high px-2 py-1 text-sm text-on-surface">
                      {keyword.name || keyword.keyword || keyword.original_name}
                    </span>
                  ))}
                </div>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MovieInfo;
