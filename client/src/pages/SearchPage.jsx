import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchMovies } from '../hooks/useMovies';
import MovieCard from '../components/common/MovieCard';
import Loading from '../components/common/Loading';

/**
 * Trang tìm kiếm phim
 */
function SearchPage() {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || '';
    const [page, setPage] = useState(1);

    // Reset page khi keyword thay đổi
    useEffect(() => {
        setPage(1);
    }, [keyword]);

    const { data, loading, error, refetch } = useSearchMovies(keyword, page);

    const movies = useMemo(() => {
        if (!data) return [];
        const innerData = data?.data || data;
        return innerData?.items || [];
    }, [data]);

    const pagination = useMemo(() => {
        if (!data) return null;
        const innerData = data?.data || data;
        return innerData?.params?.pagination || null;
    }, [data]);

    // Chưa nhập keyword
    if (!keyword) {
        return (
            <div className="pt-20 px-12 max-lg:px-6 max-md:px-4 min-h-screen">
                <h1 className="text-[28px] font-bold mb-6">Tìm kiếm phim</h1>
                <p className="text-neutral-500">Nhập từ khóa để tìm kiếm phim yêu thích.</p>
            </div>
        );
    }

    if (loading) return <Loading fullScreen />;

    if (error) {
        return (
            <div className="pt-20 px-12 max-lg:px-6 max-md:px-4 min-h-screen">
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-10">
                    <h2 className="text-2xl text-white mb-3">Lỗi tìm kiếm</h2>
                    <p className="text-neutral-500 mb-6">{error}</p>
                    <button
                        onClick={refetch}
                        className="px-7 py-2.5 bg-primary text-white text-sm font-semibold rounded hover:bg-primary-light transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-20 max-md:pt-[72px] px-12 max-lg:px-6 max-md:px-4 pb-10 max-md:pb-8 min-h-screen">
            <h1 className="text-[28px] font-bold mb-6">Kết quả tìm kiếm: &quot;{keyword}&quot;</h1>

            {movies.length === 0 ? (
                <p className="text-neutral-500 mt-5">
                    Không tìm thấy phim nào phù hợp với từ khóa &quot;{keyword}&quot;
                </p>
            ) : (
                <>
                    {/* Grid kết quả */}
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] max-md:grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4 max-md:gap-2.5 [&>*]:flex-none [&>*]:w-full">
                        {movies.map((movie) => (
                            <MovieCard key={movie._id || movie.slug} movie={movie} />
                        ))}
                    </div>

                    {/* Phân trang */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-10">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className="px-4 py-2 bg-white/[0.08] text-neutral-300 text-sm rounded transition-all hover:bg-primary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                ← Trước
                            </button>
                            <span className="px-4 py-2 text-neutral-300">
                                Trang {page} / {pagination.totalPages}
                            </span>
                            <button
                                disabled={page >= pagination.totalPages}
                                onClick={() => setPage((p) => p + 1)}
                                className="px-4 py-2 bg-white/[0.08] text-neutral-300 text-sm rounded transition-all hover:bg-primary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Sau →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default SearchPage;
