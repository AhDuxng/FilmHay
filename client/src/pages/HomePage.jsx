import { useMemo } from 'react';
import { useHomeData } from '../hooks/useMovies';
import HeroCarousel from '../components/home/HeroCarousel';
import TrendingSection from '../components/home/TrendingSection';
import Top10Section from '../components/home/Top10Section';
import MovieSection from '../components/home/MovieSection';
import PromoBanner from '../components/home/PromoBanner';
import LiveTVSection from '../components/home/LiveTVSection';
import Loading from '../components/common/Loading';

/**
 * Trang chủ - hiển thị tất cả sections
 * Gọi API /home 1 lần, phân phối data cho các component con
 */
function HomePage() {
    const { data, loading, error, refetch } = useHomeData();

    // Parse data từ ophim API response
    const homeData = useMemo(() => {
        if (!data) return null;
        const innerData = data?.data || data;
        const items = innerData?.items || [];

        return {
            heroMovies: items.slice(0, 5),
            trendingMovies: items.slice(0, 10),
            top10Movies: items.slice(5, 15),
            seriesMovies: items.slice(10, 22),
            singleMovies: items.slice(15, 27),
            actionMovies: items.slice(5, 17),
            romanceMovies: items.slice(12, 24),
            animeMovies: items.slice(18, 30),
        };
    }, [data]);

    if (loading) return <Loading fullScreen />;

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-10 mt-20">
                <h2 className="text-2xl text-white mb-3">Không thể tải dữ liệu</h2>
                <p className="text-neutral-500 mb-6">{error}</p>
                <button
                    onClick={refetch}
                    className="px-7 py-2.5 bg-primary text-white text-sm font-semibold rounded hover:bg-primary-light transition-colors"
                >
                    Thử lại
                </button>
            </div>
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
            <PromoBanner />
            <MovieSection title="Phim hành động" movies={homeData.actionMovies} moreLink="/the-loai/hanh-dong" />
            <MovieSection title="Phim tình cảm, lãng mạn" movies={homeData.romanceMovies} moreLink="/the-loai/tinh-cam" />
            <LiveTVSection />
            <MovieSection title="Hoạt hình & Thiếu nhi" movies={homeData.animeMovies} moreLink="/danh-sach/hoat-hinh" />
        </main>
    );
}

export default HomePage;
