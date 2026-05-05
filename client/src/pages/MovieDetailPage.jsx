import { useEffect, useMemo, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import { Link, useParams } from 'react-router-dom';
import {
  RiCalendarLine,
  RiClapperboardLine,
  RiEyeLine,
  RiGlobalLine,
  RiPlayCircleFill,
  RiPriceTag3Line,
  RiStarSmileLine,
  RiTimeLine,
} from 'react-icons/ri';
import { useMovieDetail } from '../hooks/useMovies';
import { usePageTitle } from '../hooks/usePageTitle';
import { CONTENT_WRAP, PAGE_PADDING, getImageUrl, getPosterUrl, getThumbUrl } from '../utils/helpers';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';

const CAST_LIMIT = 18;
const IMAGE_LIMIT = 16;

function getPeopleImage(path) {
  if (!path) {
    return '';
  }
  return `https://image.tmdb.org/t/p/w185${path}`;
}

function getBackdropImage(path) {
  if (!path) {
    return '';
  }
  return `https://image.tmdb.org/t/p/w1280${path}`;
}

function MovieDetailPage() {
  const { slug } = useParams();
  const { data, loading, error, refetch } = useMovieDetail(slug);
  const [activeServer, setActiveServer] = useState(0);
  const [activeEpisode, setActiveEpisode] = useState(0);
  const playerRef = useRef(null);

  const movie = data.movie;
  const servers = movie?.episodes || [];
  const serverData = servers[activeServer]?.server_data || [];
  const currentEpisode = serverData[activeEpisode] || null;
  const viewCount = Number(movie?.view || 0);

  useEffect(() => {
    setActiveServer(0);
    setActiveEpisode(0);
  }, [slug]);

  usePageTitle(movie?.name || 'Chi tiết phim');

  const cast = useMemo(() => data.peoples.slice(0, CAST_LIMIT), [data.peoples]);
  const images = useMemo(() => data.images.slice(0, IMAGE_LIMIT), [data.images]);
  const keywords = useMemo(() => data.keywords.slice(0, 16), [data.keywords]);

  if (loading) {
    return <Loading fullScreen />;
  }

  if (error) {
    return (
      <ErrorState
        title="Không thể tải chi tiết phim"
        message={error}
        onRetry={refetch}
        hasTopPadding
      />
    );
  }

  if (!movie) {
    return null;
  }

  const backdropUrl = images.find((image) => image.type === 'backdrop')?.file_path
    ? getBackdropImage(images.find((image) => image.type === 'backdrop')?.file_path)
    : getThumbUrl(movie, data.cdn);

  const posterUrl = getPosterUrl(movie, data.cdn);
  const episodeLabel = currentEpisode?.name || (serverData.length ? `Tập ${activeEpisode + 1}` : 'Trailer');

  return (
    <main className="pb-12 pt-[72px]">
      <section className="relative min-h-[420px] overflow-hidden md:min-h-[520px]">
        <img src={backdropUrl} alt={movie.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080a10] via-transparent to-transparent" />

        <div className={`${PAGE_PADDING} ${CONTENT_WRAP} relative z-10 flex flex-col gap-8 md:flex-row`}>
          <img
            src={posterUrl}
            alt={movie.name}
            className="mx-auto h-[360px] w-[240px] rounded-2xl border border-white/15 object-cover shadow-[0_30px_50px_rgba(0,0,0,0.45)] md:mx-0"
          />

          <div className="max-w-3xl">
            <p className="inline-flex rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              {movie.quality || 'HD'}
            </p>
            <h1 className="mt-4 text-3xl font-black text-white md:text-5xl">{movie.name}</h1>
            <p className="mt-2 text-base text-neutral-300">{movie.origin_name || movie.name}</p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-neutral-200">
              {movie.year ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1">
                  <RiCalendarLine /> {movie.year}
                </span>
              ) : null}
              {movie.time ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1">
                  <RiTimeLine /> {movie.time}
                </span>
              ) : null}
              {viewCount > 0 ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1">
                  <RiEyeLine /> {viewCount.toLocaleString('vi-VN')} lượt xem
                </span>
              ) : null}
              {movie.lang ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1">
                  <RiGlobalLine /> {movie.lang}
                </span>
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              {(movie.category || []).map((category) => (
                <Link
                  key={category.slug}
                  to={`/the-loai/${category.slug}`}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-white/40 hover:bg-white/20"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={playerRef} className={`${PAGE_PADDING} ${CONTENT_WRAP} pt-8`}>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
          {currentEpisode?.link_embed ? (
            <iframe
              title={episodeLabel}
              src={currentEpisode.link_embed}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="aspect-video w-full"
              referrerPolicy="no-referrer"
            />
          ) : currentEpisode?.link_m3u8 ? (
            <video controls autoPlay className="aspect-video w-full" src={currentEpisode.link_m3u8} />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center text-sm text-neutral-400">
              Nguồn phát hiện chưa sẵn sàng
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-neutral-400">Đang phát</p>
            <h2 className="text-xl font-bold text-white">{episodeLabel}</h2>
          </div>
        </div>

        {servers.length > 1 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {servers.map((server, index) => (
              <button
                key={`${server.server_name}-${index}`}
                type="button"
                onClick={() => {
                  setActiveServer(index);
                  setActiveEpisode(0);
                }}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  activeServer === index
                    ? 'border-primary bg-primary text-white'
                    : 'border-white/15 bg-white/5 text-neutral-300 hover:border-white/35 hover:bg-white/10'
                }`}
              >
                {server.server_name || `Server ${index + 1}`}
              </button>
            ))}
          </div>
        ) : null}

        {serverData.length ? (
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <RiPlayCircleFill className="text-lg text-primary" />
              Danh sách tập
            </div>
            <div className="grid max-h-[300px] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              {serverData.map((episode, index) => (
                <button
                  key={episode.slug || `${episode.name}-${index}`}
                  type="button"
                  onClick={() => setActiveEpisode(index)}
                  className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                    index === activeEpisode
                      ? 'border-primary bg-primary text-white'
                      : 'border-white/15 bg-black/25 text-neutral-200 hover:border-white/35 hover:bg-white/10'
                  }`}
                >
                  {episode.name || `Tập ${index + 1}`}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className={`${PAGE_PADDING} ${CONTENT_WRAP} pt-3`}>
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
            <h3 className="text-xl font-bold text-white">Nội dung phim</h3>
            <div
              className="prose prose-invert mt-3 max-w-none text-sm leading-7 text-neutral-300"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(movie.content || 'Đang cập nhật mô tả.'),
              }}
            />

            {(movie.actor || []).length ? (
              <div className="mt-5">
                <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-white">
                  <RiStarSmileLine className="text-primary" /> Diễn viên
                </p>
                <p className="text-sm leading-relaxed text-neutral-300">{movie.actor.join(', ')}</p>
              </div>
            ) : null}

            {(movie.director || []).length ? (
              <div className="mt-4">
                <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-white">
                  <RiClapperboardLine className="text-primary" /> Đạo diễn
                </p>
                <p className="text-sm leading-relaxed text-neutral-300">{movie.director.join(', ')}</p>
              </div>
            ) : null}

            {(movie.country || []).length ? (
              <div className="mt-4">
                <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-white">
                  <RiGlobalLine className="text-primary" /> Quốc gia
                </p>
                <div className="flex flex-wrap gap-2">
                  {movie.country.map((country) => (
                    <Link
                      key={country.slug}
                      to={`/quoc-gia/${country.slug}`}
                      className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white transition hover:border-white/35"
                    >
                      {country.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {keywords.length ? (
              <div className="mt-5">
                <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-white">
                  <RiPriceTag3Line className="text-primary" /> Từ khóa
                </p>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword, index) => (
                    <span
                      key={`${keyword.id || keyword.name || keyword.keyword || 'kw'}-${index}`}
                      className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs text-neutral-200"
                    >
                      {keyword.name || keyword.keyword || keyword.original_name || `Keyword ${index + 1}`}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {cast.length ? (
            <aside className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
              <h3 className="text-lg font-bold text-white">Diễn viên nổi bật</h3>
              <div className="mt-4 grid gap-3">
                {cast.map((person) => (
                  <div key={`${person.tmdb_people_id}-${person.character || ''}`} className="flex items-center gap-3">
                    <img
                      src={getPeopleImage(person.profile_path) || getImageUrl(movie.thumb_url, data.cdn)}
                      alt={person.name}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="line-clamp-1 text-sm font-semibold text-white">{person.name}</p>
                      <p className="line-clamp-1 text-xs text-neutral-400">{person.character || person.known_for_department}</p>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          ) : null}
        </div>
      </section>

      {images.length ? (
        <section className={`${PAGE_PADDING} ${CONTENT_WRAP} pt-2`}>
          <h3 className="mb-4 text-xl font-bold text-white">Gallery</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {images.map((image, index) => (
              <a
                key={`${image.file_path}-${index}`}
                href={getBackdropImage(image.file_path)}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-2xl border border-white/10"
              >
                <img
                  src={getBackdropImage(image.file_path)}
                  alt={`Backdrop ${index + 1}`}
                  className="aspect-video w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

export default MovieDetailPage;
