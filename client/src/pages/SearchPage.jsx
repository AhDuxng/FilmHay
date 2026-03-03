import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchMovies } from '../hooks/useMovies';
import { usePageTitle } from '../hooks/usePageTitle';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import MovieGrid from '../components/common/MovieGrid';
import Pagination from '../components/common/Pagination';
import { parseApiData, PAGE_PADDING } from '../utils/helpers';

function SearchPage() {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || '';
    const [page, setPage] = useState(1);
    usePageTitle(keyword ? `Tìm kiếm: ${keyword}` : 'Tìm kiếm phim');

    // Reset page khi keyword thay doi
    useEffect(() => {
        setPage(1);
    }, [keyword]);

    const { data, loading, error, refetch } = useSearchMovies(keyword, page);

    const { items: movies, pagination } = useMemo(() => parseApiData(data), [data]);

    // Chua nhap keyword
    if (!keyword) {
        return (
            <div className={`${PAGE_PADDING} min-h-screen`}>
                <h1 className="text-[28px] font-bold mb-6">Tìm kiếm phim</h1>
                <p className="text-neutral-500">Nhập từ khóa để tìm kiếm phim yêu thích.</p>
            </div>
        );
    }

    if (loading) return <Loading fullScreen />;

    if (error) {
        return (
            <ErrorState
                title="Lỗi tìm kiếm"
                message={error}
                onRetry={refetch}
                hasTopPadding
            />
        );
    }

    return (
        <div className={`${PAGE_PADDING} min-h-screen`}>
            <h1 className="text-[28px] font-bold mb-6">Kết quả tìm kiếm: &quot;{keyword}&quot;</h1>

            {movies.length === 0 ? (
                <p className="text-neutral-500 mt-5">
                    Không tìm thấy phim nào phù hợp với từ khóa &quot;{keyword}&quot;
                </p>
            ) : (
                <>
                    <MovieGrid movies={movies} />

                    {/* Phan trang */}
                    <Pagination
                        page={page}
                        totalPages={pagination?.totalPages}
                        onPageChange={setPage}
                    />
                </>
            )}
        </div>
    );
}

export default SearchPage;
