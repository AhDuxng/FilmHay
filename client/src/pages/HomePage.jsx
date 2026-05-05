import { useMemo } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useHomeData } from '../hooks/useMovies';
import HeroCarousel from '../components/home/HeroCarousel';
import TrendingSection from '../components/home/TrendingSection';
import Top10Section from '../components/home/Top10Section';
import MovieSection from '../components/home/MovieSection';
import LiveTVSection from '../components/home/LiveTVSection';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';

function uniqueBySlug(items = []) {
  const map = new Map();
  for (const item of items) {
    if (item?.slug && !map.has(item.slug)) {
      map.set(item.slug, item);
    }
  }
  return Array.from(map.values());
}

function HomePage() {
  const { data, loading, error, refetch } = useHomeData();
  usePageTitle('Trang chủ');

  const content = useMemo(() => {
    const homeItems = data?.home?.items || [];
    const seriesItems = data?.series?.items || [];
    const singleItems = data?.single?.items || [];
    const animeItems = data?.anime?.items || [];
    const tvItems = data?.tvShows?.items || [];

    const trending = uniqueBySlug([...homeItems, ...seriesItems, ...singleItems]).slice(0, 18);
    const top10 = uniqueBySlug([...seriesItems, ...singleItems, ...animeItems]).slice(0, 10);

    return {
      hero: uniqueBySlug(homeItems).slice(0, 6),
      trending,
      top10,
      series: seriesItems,
      single: singleItems,
      anime: animeItems,
      tvShows: tvItems,
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
    <main className="pb-8">
      <HeroCarousel movies={content.hero} cdnBase={content.cdn} />
      <TrendingSection movies={content.trending} cdnBase={content.cdn} />
      <Top10Section movies={content.top10} cdnBase={content.cdn} />
      <MovieSection title="Phim bộ mới cập nhật" movies={content.series} moreLink="/danh-sach/phim-bo" landscape cdnBase={content.cdn} />
      <MovieSection title="Phim lẻ đề cử" movies={content.single} moreLink="/danh-sach/phim-le" landscape cdnBase={content.cdn} />
      <MovieSection title="Anime nổi bật" movies={content.anime} moreLink="/danh-sach/hoat-hinh" landscape cdnBase={content.cdn} />
      <LiveTVSection />
      <MovieSection title="TV Shows mới" movies={content.tvShows} moreLink="/danh-sach/tv-shows" landscape cdnBase={content.cdn} />
    </main>
  );
}

export default HomePage;
