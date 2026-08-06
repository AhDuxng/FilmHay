import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterSidebar } from '../components/search-filter/FilterSidebar';
import { SearchResult } from '../components/search-filter/SearchResult';
import { movieApi } from '../services/api';
import { useBrowseMetadata, useQuery } from '../hooks/useMovies';
import { normalizeListPayload } from '../utils/helpers';
import { usePageTitle } from '../hooks/usePageTitle';
import { RiSearchLine } from 'react-icons/ri';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import Pagination from '../components/common/Pagination';

export const SearchFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialKeyword = searchParams.get('q') || searchParams.get('keyword') || '';
  const [keyword, setKeyword] = useState(initialKeyword);
  const [submittedKeyword, setSubmittedKeyword] = useState(initialKeyword);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    country: '',
    year: '',
    sort_field: 'modified.time',
    sort_type: 'desc',
  });
  const metadataQuery = useBrowseMetadata();

  usePageTitle(submittedKeyword ? `Tìm kiếm ${submittedKeyword}` : 'Tìm kiếm phim');

  useEffect(() => {
    setPage(1);
  }, [submittedKeyword, filters]);

  const cleanedFilters = useMemo(() => {
    return Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
  }, [filters]);

  const { data, loading, error, refetch } = useQuery(
    async () => {
      const payload = submittedKeyword
        ? await movieApi.searchMovies(submittedKeyword, page, { ...cleanedFilters, limit: 24 })
        : await movieApi.getBrowseList(page, { ...cleanedFilters, limit: 24 });

      return normalizeListPayload(payload);
    },
    [submittedKeyword, page, cleanedFilters],
    {
      initialData: {
        items: [],
        pagination: { currentPage: 1, totalPages: 1, totalItems: 0, perPage: 24 },
        cdn: '',
      },
    }
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextKeyword = keyword.trim();
    setSubmittedKeyword(nextKeyword);
    setSearchParams(nextKeyword ? { q: nextKeyword } : {});
  };

  return (
    <main className="mx-auto flex w-full max-w-container-max flex-grow flex-col gap-8 px-margin-mobile pb-12 pt-24 md:px-margin-desktop md:pb-16 md:pt-28">
      <header className="flex flex-col gap-6">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Tìm kiếm & lọc phim</h1>
        <form onSubmit={handleSubmit} className="relative w-full max-w-3xl">
          <RiSearchLine className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-secondary" aria-hidden="true" />
          <input 
            className="w-full h-14 pl-12 pr-4 rounded-xl input-ghost text-on-surface font-body-lg text-body-lg placeholder:text-secondary focus:ring-0 bg-surface-container-high/50 backdrop-blur-md" 
            placeholder="Nhập tên phim, diễn viên hoặc từ khóa..." 
            type="text"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </form>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar
          filters={filters}
          onChange={setFilters}
          genres={metadataQuery.data.genres}
          countries={metadataQuery.data.countries}
          years={metadataQuery.data.years}
        />
        <section className="flex-grow">
          {loading ? (
            <Loading />
          ) : error ? (
            <ErrorState title="Không thể tải kết quả" message={error} onRetry={refetch} />
          ) : (
            <>
              <SearchResult movies={data.items} cdnBase={data.cdn} totalItems={data.pagination.totalItems} />
              <Pagination page={data.pagination.currentPage} totalPages={data.pagination.totalPages} onPageChange={setPage} />
            </>
          )}
        </section>
      </div>
    </main>
  );
};
