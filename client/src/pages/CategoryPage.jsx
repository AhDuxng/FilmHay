import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { RiFilter3Line } from 'react-icons/ri';
import { useMoviesByCountry, useMoviesByGenre, useMoviesByYear, useMovieList, useBrowseMetadata } from '../hooks/useMovies';
import { usePageTitle } from '../hooks/usePageTitle';
import { LIST_TITLES } from '../utils/constants';
import { CONTENT_WRAP, PAGE_PADDING, slugToTitle } from '../utils/helpers';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import MovieGrid from '../components/common/MovieGrid';
import Pagination from '../components/common/Pagination';

function resolveRouteType(pathname) {
  if (pathname.startsWith('/the-loai/')) {
    return 'genre';
  }
  if (pathname.startsWith('/quoc-gia/')) {
    return 'country';
  }
  if (pathname.startsWith('/nam-phat-hanh/')) {
    return 'year';
  }
  return 'list';
}

function CategoryPage() {
  const { slug } = useParams();
  const { pathname } = useLocation();
  const routeType = resolveRouteType(pathname);
  const [page, setPage] = useState(1);
  const metadataQuery = useBrowseMetadata();

  useEffect(() => {
    setPage(1);
  }, [pathname]);

  const listQuery = useMovieList(slug || 'phim-moi-cap-nhat', page, routeType === 'list');
  const genreQuery = useMoviesByGenre(slug, page, routeType === 'genre');
  const countryQuery = useMoviesByCountry(slug, page, routeType === 'country');
  const yearQuery = useMoviesByYear(slug, page, routeType === 'year');

  const query =
    routeType === 'genre'
      ? genreQuery
      : routeType === 'country'
        ? countryQuery
        : routeType === 'year'
          ? yearQuery
          : listQuery;

  const { data, loading, error, refetch } = query;
  const title = useMemo(() => {
    if (routeType === 'list') {
      return LIST_TITLES[slug] || data.titlePage || slugToTitle(slug || '');
    }

    if (routeType === 'year') {
      return `Phim năm ${slug}`;
    }

    return data.titlePage || slugToTitle(slug || '');
  }, [data.titlePage, routeType, slug]);

  const quickLinks = useMemo(() => {
    if (routeType === 'genre') {
      return (metadataQuery.data.genres || []).slice(0, 16).map((item) => ({
        label: item.name,
        path: `/the-loai/${item.slug}`,
        active: item.slug === slug,
      }));
    }

    if (routeType === 'country') {
      return (metadataQuery.data.countries || []).slice(0, 16).map((item) => ({
        label: item.name,
        path: `/quoc-gia/${item.slug}`,
        active: item.slug === slug,
      }));
    }

    if (routeType === 'year') {
      return (metadataQuery.data.years || []).slice(0, 20).map((item) => ({
        label: item.year,
        path: `/nam-phat-hanh/${item.year}`,
        active: String(item.year) === String(slug),
      }));
    }

    return [];
  }, [metadataQuery.data.countries, metadataQuery.data.genres, metadataQuery.data.years, routeType, slug]);

  usePageTitle(title);

  if (loading) {
    return <Loading fullScreen />;
  }

  if (error) {
    return (
      <ErrorState
        title="Không thể tải danh sách"
        message={error}
        onRetry={refetch}
        hasTopPadding
      />
    );
  }

  return (
    <main className={`${PAGE_PADDING} ${CONTENT_WRAP}`}>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-white">{title}</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Tổng phim: {data.pagination.totalItems.toLocaleString('vi-VN')} | Trang {data.pagination.currentPage}/{data.pagination.totalPages}
          </p>
        </div>
      </div>

      {quickLinks.length ? (
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
            <RiFilter3Line className="text-base" />
            Bộ lọc nhanh
          </div>
          <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
            {quickLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  item.active
                    ? 'border-primary bg-primary text-white'
                    : 'border-white/15 bg-white/5 text-neutral-300 hover:border-white/35 hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {data.items.length ? (
        <>
          <MovieGrid movies={data.items} cdnBase={data.cdn} />
          <Pagination page={data.pagination.currentPage} totalPages={data.pagination.totalPages} onPageChange={setPage} />
        </>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-neutral-300">
          Chưa có phim trong danh mục này.
        </div>
      )}
    </main>
  );
}

export default CategoryPage;
