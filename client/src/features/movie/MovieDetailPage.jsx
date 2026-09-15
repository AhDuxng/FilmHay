import MovieBanner from '@/features/movie/components/MovieBanner';
import MovieInfo from '@/features/movie/components/MovieInfo';
import { useMovieDetail } from '@/shared/hooks/useMovies';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import Loading from '@/shared/components/feedback/Loading';
import ErrorState from '@/shared/components/feedback/ErrorState';
import { useParams } from 'react-router-dom';

const MovieDetailPage = () => {
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

export default MovieDetailPage;
