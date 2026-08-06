import { MovieBanner } from '../components/movie-detail/MovieBanner';
import { MovieInfo } from '../components/movie-detail/MovieInfo';
import { useMovieDetail } from '../hooks/useMovies';
import { usePageTitle } from '../hooks/usePageTitle';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import { useParams } from 'react-router-dom';

export const MovieDetail = () => {
  const { id } = useParams();
  const { data, loading, error, refetch } = useMovieDetail(id);
  const movie = data.movie;

  usePageTitle(movie?.name || 'Chi tiết phim');

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

  return (
    <main className="flex-grow">
      <MovieBanner movie={movie} cdnBase={data.cdn} images={data.images} />
      <MovieInfo movie={movie} cdnBase={data.cdn} peoples={data.peoples} keywords={data.keywords} />
    </main>
  );
};
