import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { RiSearch2Line } from 'react-icons/ri';
import { useSearchMovies } from '../hooks/useMovies';
import { usePageTitle } from '../hooks/usePageTitle';
import { LIST_QUICK_LINKS } from '../utils/constants';
import { CONTENT_WRAP, PAGE_PADDING } from '../utils/helpers';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import MovieGrid from '../components/common/MovieGrid';
import Pagination from '../components/common/Pagination';

function SearchPage() {
  const [searchParams] = useSearchParams();
  const keyword = (searchParams.get('keyword') || '').trim();
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [keyword]);

  const { data, loading, error, refetch } = useSearchMovies(keyword, page, Boolean(keyword));

  const title = useMemo(() => (keyword ? `Tìm kiếm: ${keyword}` : 'Tìm kiếm phim'), [keyword]);
  usePageTitle(title);

  if (!keyword) {
    return (
      <main className={`${PAGE_PADDING} ${CONTENT_WRAP}`}>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary">
            <RiSearch2Line className="text-2xl" />
          </div>
          <h1 className="text-3xl font-black text-white">Tìm kiếm phim</h1>
          <p className="mt-2 text-sm text-neutral-300">Nhập tên phim, diễn viên, đạo diễn hoặc từ khóa bạn muốn xem.</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {LIST_QUICK_LINKS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-neutral-200 transition hover:border-white/35 hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return <Loading fullScreen />;
  }

  if (error) {
    return (
      <ErrorState
        title="Tìm kiếm thất bại"
        message={error}
        onRetry={refetch}
        hasTopPadding
      />
    );
  }

  return (
    <main className={`${PAGE_PADDING} ${CONTENT_WRAP}`}>
      <h1 className="text-3xl font-black text-white">Kết quả cho "{keyword}"</h1>
      <p className="mt-2 text-sm text-neutral-400">{data.pagination.totalItems.toLocaleString('vi-VN')} kết quả</p>

      <div className="mt-6">
        {data.items.length ? (
          <>
            <MovieGrid movies={data.items} cdnBase={data.cdn} />
            <Pagination page={data.pagination.currentPage} totalPages={data.pagination.totalPages} onPageChange={setPage} />
          </>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-neutral-300">
            Không tìm thấy phim phù hợp với từ khóa này.
          </div>
        )}
      </div>
    </main>
  );
}

export default SearchPage;
