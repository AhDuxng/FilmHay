import { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useMovieList, useMoviesByGenre, useMoviesByCountry } from '../hooks/useMovies';
import { usePageTitle } from '../hooks/usePageTitle';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import MovieGrid from '../components/common/MovieGrid';
import Pagination from '../components/common/Pagination';
import { parseApiData, PAGE_PADDING } from '../utils/helpers';

// Map type sang tieu de hien thi
const TITLE_MAP = {
    'phim-moi': 'Phim mới cập nhật',
    'phim-bo': 'Phim bộ',
    'phim-le': 'Phim lẻ',
    'hoat-hinh': 'Hoạt hình',
    'tv-shows': 'TV Shows',
};

const getRouteType = (pathname) => {
    if (pathname.startsWith('/the-loai/')) return 'genre';
    if (pathname.startsWith('/quoc-gia/')) return 'country';
    return 'list';
};

function CategoryPage() {
    const { type, slug } = useParams();
    const { pathname } = useLocation();
    const [page, setPage] = useState(1);

    const routeType = getRouteType(pathname);
    const categorySlug = type || slug || 'phim-moi';

    // Tao title tu slug khi la the loai / quoc gia (chua co map san)
    const title = TITLE_MAP[categorySlug]
        || categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    // Reset page khi doi route
    useEffect(() => {
        setPage(1);
    }, [pathname]);

    // Goi hook tuong ung voi loai route
    const listResult = useMovieList(categorySlug, page, routeType === 'list');
    const genreResult = useMoviesByGenre(categorySlug, page, routeType === 'genre');
    const countryResult = useMoviesByCountry(categorySlug, page, routeType === 'country');

    // Chon ket qua tuong ung
    const result = routeType === 'genre' ? genreResult
        : routeType === 'country' ? countryResult
        : listResult;

    const { data, loading, error, refetch } = result;
    const { items: movies, pagination } = useMemo(() => parseApiData(data), [data]);
    usePageTitle(title);

    if (loading) return <Loading fullScreen />;

    if (error) {
        return (
            <ErrorState
                title="Không thể tải danh sách phim"
                message={error}
                onRetry={refetch}
                hasTopPadding
            />
        );
    }

    return (
        <div className={`${PAGE_PADDING} min-h-screen`}>
            <h1 className="text-[28px] font-bold mb-6">{title}</h1>

            {movies.length === 0 ? (
                <p className="text-neutral-500">Chưa có phim nào trong danh mục này.</p>
            ) : (
                <>
                    <MovieGrid movies={movies} />

                    {/* Phan trang co so trang */}
                    <Pagination
                        page={page}
                        totalPages={pagination?.totalPages}
                        onPageChange={setPage}
                        showPageNumbers
                    />
                </>
            )}
        </div>
    );
}

export default CategoryPage;
