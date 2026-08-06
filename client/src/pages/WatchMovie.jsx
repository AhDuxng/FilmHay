import { useParams, useSearchParams } from 'react-router-dom';
import { VideoPlayer } from '../components/watch-movie/VideoPlayer';
import { useMovieDetail } from '../hooks/useMovies';
import { usePageTitle } from '../hooks/usePageTitle';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';

export const WatchMovie = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { data, loading, error, refetch } = useMovieDetail(id);
  const movie = data.movie;
  const serverIndex = Number(searchParams.get('server') || 0);
  const episodeIndex = Number(searchParams.get('episode') || 0);
  const servers = movie?.episodes || [];
  const activeServer = servers[serverIndex] || servers[0] || null;
  const episodes = activeServer?.server_data || [];
  const currentEpisode = episodes[episodeIndex] || episodes[0] || null;
  const episodeLabel = currentEpisode?.name || (episodes.length ? `Tập ${episodeIndex + 1}` : 'Nguồn phát');

  usePageTitle(movie ? `Đang xem ${movie.name}` : 'Xem phim');

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

  return (
    <div className="h-screen w-screen overflow-hidden bg-black text-on-surface">
      <VideoPlayer
        movie={movie}
        cdnBase={data.cdn}
        currentEpisode={currentEpisode}
        episodeLabel={episodeLabel}
        servers={servers}
        activeServerIndex={Math.max(0, serverIndex)}
        activeEpisodeIndex={Math.max(0, episodeIndex)}
      />
    </div>
  );
};
