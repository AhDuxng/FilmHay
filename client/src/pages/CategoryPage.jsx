import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useMovieList } from '../hooks/useMovies';
import MovieCard from '../components/common/MovieCard';
import Loading from '../components/common/Loading';

// Map type sang tiêu đề hiển thị
const TITLE_MAP = {
    'phim-moi': 'Phim mới cập nhật',
    'phim-bo': 'Phim bộ',
    'phim-le': 'Phim lẻ',
    'hoat-hinh': 'Hoạt hình',
    'tv-shows': 'TV Shows',
};

/**
 * Trang danh sách phim theo loại / thể loại / quốc gia
 */
function CategoryPage() {
    const { type, slug } = useParams();
    const [page, setPage] = useState(1);

    const categoryType = type || slug || 'phim-moi';
    const title = TITLE_MAP[categoryType] || categoryType;

    const { data, loading, error, refetch } = useMovieList(categoryType, page);

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

    if (loading) return <Loading fullScreen />;

    if (error) {
        return (
            <div className="pt-20 px-12 max-lg:px-6 max-md:px-4 min-h-screen">
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-10">
                    <h2 className="text-2xl text-white mb-3">Không thể tải danh sách phim</h2>
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
            <h1 className="text-[28px] font-bold mb-6">{title}</h1>

            {movies.length === 0 ? (
                <p className="text-neutral-500">Chưa có phim nào trong danh mục này.</p>
            ) : (
                <>
                    {/* Grid phim */}
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

                            {/* Số trang */}
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                const startPage = Math.max(1, page - 2);
                                const pageNum = startPage + i;
                                if (pageNum > pagination.totalPages) return null;
                                return (
                                    <button
                                        key={pageNum}
                                        className={`px-4 py-2 text-sm rounded transition-all ${
                                            page === pageNum
                                                ? 'bg-primary text-white'
                                                : 'bg-white/[0.08] text-neutral-300 hover:bg-primary hover:text-white'
                                        }`}
                                        onClick={() => setPage(pageNum)}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

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

export default CategoryPage;
