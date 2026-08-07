import { useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useMovieDetail } from '../hooks/useMovies';
import { usePageTitle } from '../hooks/usePageTitle';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import { CONTENT_WRAP, PAGE_PADDING } from '../utils/helpers';
import { RiPlayCircleFill, RiArrowLeftLine } from 'react-icons/ri';

export const WatchMovie = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, loading, error, refetch } = useMovieDetail(id);
  
  const movie = data?.movie;
  const serverIndex = Number(searchParams.get('server') || 0);
  const episodeIndex = Number(searchParams.get('episode') || 0);
  
  const servers = movie?.episodes || [];
  const activeServer = servers[serverIndex] || servers[0] || null;
  const episodes = activeServer?.server_data || [];
  const currentEpisode = episodes[episodeIndex] || episodes[0] || null;
  const episodeLabel = currentEpisode?.name || (episodes.length ? `Tập ${episodeIndex + 1}` : 'Nguồn phát');

  // Sync state if params are invalid
  useEffect(() => {
    if (servers.length > 0) {
      if (!servers[serverIndex]) {
        setSearchParams({ server: 0, episode: 0 }, { replace: true });
      } else if (!servers[serverIndex].server_data[episodeIndex]) {
        setSearchParams({ server: serverIndex, episode: 0 }, { replace: true });
      }
    }
  }, [servers, serverIndex, episodeIndex, setSearchParams]);

  usePageTitle(movie ? `Đang xem ${movie.name} - ${episodeLabel}` : 'Xem phim');

  if (loading) {
    return <Loading fullScreen />;
  }

  if (error) {
    return (
      <ErrorState
        title="Không thể tải phim"
        message={error}
        onRetry={refetch}
        hasTopPadding
      />
    );
  }

  if (!movie) return null;

  return (
    <main className="pb-12 pt-[72px]">
      <section className="bg-black py-4 md:py-8">
        <div className={`${PAGE_PADDING} ${CONTENT_WRAP} mx-auto max-w-6xl`}>
          <div className="mb-4 flex items-center justify-between">
            <Link 
              to={`/phim/${movie.slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-400 transition hover:text-white"
            >
              <RiArrowLeftLine className="text-lg" />
              Quay lại chi tiết
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black aspect-video relative shadow-2xl">
            {currentEpisode?.link_embed ? (
              <iframe
                title={episodeLabel}
                src={currentEpisode.link_embed}
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
                Nguồn phát hiện chưa sẵn sàng
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <h1 className="text-2xl font-black text-white md:text-3xl">{movie.name}</h1>
            <p className="text-lg font-semibold text-primary">Đang xem: {episodeLabel}</p>
          </div>
        </div>
      </section>

      <section className={`${PAGE_PADDING} ${CONTENT_WRAP} mx-auto max-w-6xl pt-8`}>
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
              <div className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                <RiPlayCircleFill className="text-primary" />
                Danh sách tập phim
              </div>

              {/* Luôn hiển thị Server API kể cả khi chỉ có 1 để người dùng biết */}
              <div className="mb-6 flex flex-wrap gap-2">
                <span className="flex items-center text-sm font-semibold text-neutral-400 mr-2">Server:</span>
                {servers.map((server, idx) => (
                  <button
                    key={`${server.server_name}-${idx}`}
                    type="button"
                    onClick={() => setSearchParams({ server: idx, episode: 0 })}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${serverIndex === idx
                        ? 'border-primary bg-primary text-white'
                        : 'border-white/15 bg-black/20 text-neutral-300 hover:border-white/35 hover:bg-white/10'
                      }`}
                  >
                    {server.server_name || `Server ${idx + 1}`}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                {episodes.map((episode, idx) => {
                  const isActive = idx === episodeIndex;
                  return (
                    <Link
                      key={episode.slug || `${episode.name}-${idx}`}
                      to={`/watch/${movie.slug}?server=${serverIndex}&episode=${idx}`}
                      className={`rounded-lg border px-2 py-2.5 text-center text-sm font-semibold transition ${isActive
                          ? 'border-primary bg-primary text-white shadow-[0_0_15px_rgba(var(--color-primary),0.4)]'
                          : 'border-white/10 bg-black/40 text-neutral-300 hover:border-white/30 hover:bg-white/10'
                        }`}
                    >
                      {episode.name || `${idx + 1}`}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
              <h3 className="mb-3 text-lg font-bold text-white">Nội dung phim</h3>
              <div 
                className="text-sm leading-relaxed text-neutral-300"
                dangerouslySetInnerHTML={{ __html: movie.content }}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
             <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="mb-4 font-bold text-white">Thông tin thêm</h3>
                <div className="flex flex-col gap-3 text-sm text-neutral-300">
                  <p><span className="text-neutral-500">Trạng thái:</span> {movie.episode_current}</p>
                  <p><span className="text-neutral-500">Năm:</span> {movie.year}</p>
                  <p><span className="text-neutral-500">Thời lượng:</span> {movie.time}</p>
                  <p><span className="text-neutral-500">Chất lượng:</span> {movie.quality} {movie.lang}</p>
                  <p><span className="text-neutral-500">Lượt xem:</span> {Number(movie.view || 0).toLocaleString('vi-VN')}</p>
                </div>
             </div>
          </div>
        </div>
      </section>
    </main>
  );
};
