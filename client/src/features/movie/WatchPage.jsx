import { useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useMovieDetail } from '@/shared/hooks/useMovies';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import Loading from '@/shared/components/feedback/Loading';
import ErrorState from '@/shared/components/feedback/ErrorState';
import { CONTENT_WRAP, PAGE_PADDING } from '@/shared/lib/helpers';
import { RiPlayCircleFill, RiArrowLeftLine } from 'react-icons/ri';

const WatchPage = () => {
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
      <section className="on-dark bg-black py-4 md:py-8">
        <div className={`${PAGE_PADDING} ${CONTENT_WRAP} mx-auto max-w-6xl`}>
          <div className="mb-4 flex items-center justify-between">
            <Link 
              to={`/phim/${movie.slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-secondary transition hover:text-on-surface"
            >
              <RiArrowLeftLine className="text-lg" />
              Quay lại chi tiết
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-outline bg-black aspect-video relative shadow-2xl">
            {currentEpisode?.link_embed ? (
              <iframe
                title={episodeLabel}
                src={currentEpisode.link_embed}
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-secondary">
                Nguồn phát hiện chưa sẵn sàng
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <h1 className="text-ramp text-2xl font-black md:text-3xl">{movie.name}</h1>
            <p className="text-lg font-semibold text-primary">Đang xem: {episodeLabel}</p>
          </div>
        </div>
      </section>

      <section className={`${PAGE_PADDING} ${CONTENT_WRAP} mx-auto max-w-6xl pt-8`}>
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-outline bg-surface-container p-5 md:p-6">
              <div className="mb-4 flex items-center gap-2 text-lg font-bold text-on-surface">
                <RiPlayCircleFill className="text-primary" />
                Danh sách tập phim
              </div>

              {/* Luôn hiển thị Server API kể cả khi chỉ có 1 để người dùng biết */}
              <div className="mb-6 flex flex-wrap gap-2">
                <span className="flex items-center text-sm font-semibold text-secondary mr-2">Server:</span>
                {servers.map((server, idx) => (
                  <button
                    key={`${server.server_name}-${idx}`}
                    type="button"
                    onClick={() => setSearchParams({ server: idx, episode: 0 })}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${serverIndex === idx
                        ? 'fill-ramp border-transparent'
                        : 'border-outline bg-surface-container text-secondary-fixed-dim hover:border-outline-strong hover:bg-surface-container-high'
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
                      className={`rounded-lg border px-2 py-2.5 text-center font-mono text-sm font-semibold transition ${isActive
                          ? 'fill-ramp border-transparent shadow-[0_0_15px_rgba(251,124,120,0.35)]'
                          : 'border-outline bg-surface-container text-secondary-fixed-dim hover:border-outline-strong hover:bg-surface-container-high'
                        }`}
                    >
                      {episode.name || `${idx + 1}`}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-outline bg-surface-container p-5 md:p-6">
              <h3 className="mb-3 text-lg font-bold text-on-surface">Nội dung phim</h3>
              <div 
                className="text-sm leading-relaxed text-secondary-fixed-dim"
                dangerouslySetInnerHTML={{ __html: movie.content }}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
             <div className="rounded-2xl border border-outline bg-surface-container p-5">
                <h3 className="mb-4 font-bold text-on-surface">Thông tin thêm</h3>
                <div className="flex flex-col gap-3 text-sm text-secondary-fixed-dim">
                  <p><span className="text-secondary">Trạng thái:</span> {movie.episode_current}</p>
                  <p><span className="text-secondary">Năm:</span> {movie.year}</p>
                  <p><span className="text-secondary">Thời lượng:</span> {movie.time}</p>
                  <p><span className="text-secondary">Chất lượng:</span> {movie.quality} {movie.lang}</p>
                  <p><span className="text-secondary">Lượt xem:</span> {Number(movie.view || 0).toLocaleString('vi-VN')}</p>
                </div>
             </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default WatchPage;
