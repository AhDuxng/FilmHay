import { useMemo } from 'react';
import { useHomeData } from '../hooks/useMovies';
import { usePageTitle } from '../hooks/usePageTitle';
import HeroCarousel from '../components/home/HeroCarousel';
import TrendingSection from '../components/home/TrendingSection';
import Top10Section from '../components/home/Top10Section';
import MovieSection from '../components/home/MovieSection';
import LiveTVSection from '../components/home/LiveTVSection';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';

/**
 * Trang chu - hien thi tat ca section
 * Goi API /home 1 lan, phan phoi data cho component con
 */
function HomePage() {
    const { data, loading, error, refetch } = useHomeData();
    usePageTitle('Trang chủ - Xem phim online miễn phí');

    // Parse data tu ophim API response
    // Phan chia items thanh cac nhom khong trung lap
    const homeData = useMemo(() => {
        if (!data) return null;
        const innerData = data?.data || data;
        const items = innerData?.items || [];

        return {
            heroMovies: items.slice(0, 5),
            trendingMovies: items.slice(0, 12),
            top10Movies: items.slice(12, 22),
            seriesMovies: items.slice(22, 34),
            singleMovies: items.slice(34, 46),
            actionMovies: items.slice(46, 58),
            romanceMovies: items.slice(58, 70),
            animeMovies: items.slice(70, 82),
        };
    }, [data]);

    if (loading) return <Loading fullScreen />;

    if (error) {
        return (
            <ErrorState
                title="Không thể tải dữ liệu"
                message={error}
                onRetry={refetch}
                hasTopPadding
            />
        );
    }

    if (!homeData) return null;

    return (
        <main>
            <HeroCarousel movies={homeData.heroMovies} />
            <TrendingSection movies={homeData.trendingMovies} />
            <Top10Section movies={homeData.top10Movies} />
            <MovieSection title="Phim bộ hay nhất" movies={homeData.seriesMovies} moreLink="/danh-sach/phim-bo" />
            <MovieSection title="Phim lẻ đề cử" movies={homeData.singleMovies} moreLink="/danh-sach/phim-le" />
            <MovieSection title="Phim hành động" movies={homeData.actionMovies} moreLink="/the-loai/hanh-dong" />
            <MovieSection title="Phim tình cảm, lãng mạn" movies={homeData.romanceMovies} moreLink="/the-loai/tinh-cam" />
            <LiveTVSection />
            <MovieSection title="Hoạt hình & Thiếu nhi" movies={homeData.animeMovies} moreLink="/danh-sach/hoat-hinh" />
        </main>
    );
}

export default HomePage;
