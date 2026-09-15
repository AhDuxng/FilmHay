import { useMemo } from 'react';
import HeroSection from '@/features/home/components/HeroSection';
import MovieCarousel from '@/shared/components/media/MovieCarousel';
import MovieCard from '@/shared/components/media/MovieCard';
import Top10Card from '@/features/home/components/Top10Card';
import { useHomeData } from '@/shared/hooks/useMovies';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import Loading from '@/shared/components/feedback/Loading';
import ErrorState from '@/shared/components/feedback/ErrorState';

function uniqueBySlug(items = []) {
  const map = new Map();
  for (const item of items) {
    if (item?.slug && !map.has(item.slug)) {
      map.set(item.slug, item);
    }
  }
  return Array.from(map.values());
}

const HomePage = () => {
  const { data, loading, error, refetch } = useHomeData();
  usePageTitle('Trang chủ');

  const content = useMemo(() => {
    const homeItems = data?.home?.items || [];
    const seriesItems = data?.series?.items || [];
    const singleItems = data?.single?.items || [];
    const animeItems = data?.anime?.items || [];
    const tvItems = data?.tvShows?.items || [];
    const featuredMovies = Array.isArray(data?.featured) ? data.featured : [];
    const fallbackHero = uniqueBySlug(homeItems)[0] || uniqueBySlug(seriesItems)[0];
    const fallbackHeroCdn = data?.home?.cdn || data?.series?.cdn || '';

    return {
      heroMovies: featuredMovies.length
        ? featuredMovies
        : fallbackHero
          ? [{ movie: fallbackHero, cdn: fallbackHeroCdn }]
          : [],
      trending: uniqueBySlug([...homeItems, ...seriesItems, ...singleItems]).slice(0, 18),
      top10: uniqueBySlug([...seriesItems, ...singleItems, ...animeItems]).slice(0, 10),
      series: seriesItems.slice(0, 18),
      single: singleItems.slice(0, 18),
      anime: animeItems.slice(0, 18),
      tvShows: tvItems.slice(0, 18),
      cdn: data?.home?.cdn || data?.series?.cdn || '',
    };
  }, [data]);

  if (loading) {
    return <Loading fullScreen />;
  }

  if (error) {
    return (
      <ErrorState
        title="Không thể tải trang chủ"
        message={error}
        onRetry={refetch}
        hasTopPadding
      />
    );
  }

  return (
    <div className="flex-grow pb-16">
      <HeroSection movies={content.heroMovies} />
      
      <div className="w-full max-w-container-max mx-auto -mt-24 relative z-20 pb-20">
        <MovieCarousel title="Đang thịnh hành">
          {content.trending.map((movie) => (
            <MovieCard key={movie._id || movie.slug} movie={movie} cdnBase={content.cdn} inSlider />
          ))}
        </MovieCarousel>

        <MovieCarousel title="Top 10 hôm nay">
          {content.top10.map((movie, index) => (
            <Top10Card key={movie._id || movie.slug} rank={String(index + 1)} movie={movie} cdnBase={content.cdn} />
          ))}
        </MovieCarousel>

        {[
          ['Phim bộ mới cập nhật', content.series],
          ['Phim lẻ đề cử', content.single],
          ['Hoạt hình nổi bật', content.anime],
          ['TV Shows mới', content.tvShows],
        ].map(([title, movies]) => (
          <MovieCarousel key={title} title={title}>
            {movies.map((movie) => (
              <MovieCard key={movie._id || movie.slug} movie={movie} cdnBase={content.cdn} inSlider />
            ))}
          </MovieCarousel>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
