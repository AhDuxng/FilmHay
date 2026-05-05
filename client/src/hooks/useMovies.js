import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { movieApi } from '../services/api';
import {
  createPagination,
  normalizeListPayload,
  normalizeMoviePayload,
  sanitizeImages,
  sanitizeKeywords,
  sanitizePeoples,
} from '../utils/helpers';

const EMPTY_LIST_DATA = {
  items: [],
  pagination: createPagination(),
  titlePage: '',
  typeList: '',
  seo: null,
  cdn: '',
};

const EMPTY_HOME_DATA = {
  home: EMPTY_LIST_DATA,
  series: EMPTY_LIST_DATA,
  single: EMPTY_LIST_DATA,
  anime: EMPTY_LIST_DATA,
  tvShows: EMPTY_LIST_DATA,
};

const EMPTY_DETAIL_DATA = {
  movie: null,
  cdn: '',
  seo: null,
  images: [],
  peoples: [],
  keywords: [],
};

const EMPTY_META_DATA = {
  genres: [],
  countries: [],
  years: [],
};

export function useQuery(queryFn, deps = [], options = {}) {
  const { enabled = true, initialData = null } = options;
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState('');
  const requestRef = useRef(0);
  const queryFnRef = useRef(queryFn);

  useEffect(() => {
    queryFnRef.current = queryFn;
  }, [queryFn]);

  const execute = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const requestId = requestRef.current + 1;
    requestRef.current = requestId;

    setLoading(true);
    setError('');

    try {
      const payload = await queryFnRef.current();
      if (requestRef.current === requestId) {
        setData(payload);
      }
    } catch (queryError) {
      if (requestRef.current === requestId) {
        setError(queryError.message || 'Unable to load data');
      }
    } finally {
      if (requestRef.current === requestId) {
        setLoading(false);
      }
    }
  }, [enabled, ...deps]);

  useEffect(() => {
    execute();
  }, [execute]);

  const refetch = useCallback(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch };
}

export function useHomeData() {
  return useQuery(
    async () => {
      const [home, series, single, anime, tvShows] = await Promise.all([
        movieApi.getHome(),
        movieApi.getMovieList('phim-bo', 1),
        movieApi.getMovieList('phim-le', 1),
        movieApi.getMovieList('hoat-hinh', 1),
        movieApi.getMovieList('tv-shows', 1),
      ]);

      return {
        home: normalizeListPayload(home),
        series: normalizeListPayload(series),
        single: normalizeListPayload(single),
        anime: normalizeListPayload(anime),
        tvShows: normalizeListPayload(tvShows),
      };
    },
    [],
    { initialData: EMPTY_HOME_DATA }
  );
}

function useListResult(queryFn, deps, enabled = true) {
  const query = useQuery(queryFn, deps, {
    enabled,
    initialData: EMPTY_LIST_DATA,
  });

  const normalized = useMemo(() => normalizeListPayload(query.data), [query.data]);

  return {
    ...query,
    data: normalized,
  };
}

export function useMovieList(slug, page = 1, enabled = true) {
  return useListResult(() => movieApi.getMovieList(slug, page), [slug, page], enabled);
}

export function useSearchMovies(keyword, page = 1, enabled = true) {
  return useListResult(() => movieApi.searchMovies(keyword, page), [keyword, page], enabled && Boolean(keyword));
}

export function useMoviesByGenre(slug, page = 1, enabled = true) {
  return useListResult(() => movieApi.getMoviesByGenre(slug, page), [slug, page], enabled && Boolean(slug));
}

export function useMoviesByCountry(slug, page = 1, enabled = true) {
  return useListResult(() => movieApi.getMoviesByCountry(slug, page), [slug, page], enabled && Boolean(slug));
}

export function useMoviesByYear(year, page = 1, enabled = true) {
  return useListResult(() => movieApi.getMoviesByYear(year, page), [year, page], enabled && Boolean(year));
}

export function useMovieDetail(slug) {
  return useQuery(
    async () => {
      const detail = await movieApi.getMovieDetail(slug);
      const [images, peoples, keywords] = await Promise.allSettled([
        movieApi.getMovieImages(slug),
        movieApi.getMoviePeoples(slug),
        movieApi.getMovieKeywords(slug),
      ]);

      const detailData = normalizeMoviePayload(detail);

      return {
        ...detailData,
        images: images.status === 'fulfilled' ? sanitizeImages(images.value) : [],
        peoples: peoples.status === 'fulfilled' ? sanitizePeoples(peoples.value) : [],
        keywords: keywords.status === 'fulfilled' ? sanitizeKeywords(keywords.value) : [],
      };
    },
    [slug],
    {
      enabled: Boolean(slug),
      initialData: EMPTY_DETAIL_DATA,
    }
  );
}

export function useBrowseMetadata() {
  return useQuery(
    async () => {
      const [genrePayload, countryPayload, yearPayload] = await Promise.all([
        movieApi.getGenreList(),
        movieApi.getCountryList(),
        movieApi.getYearList(),
      ]);

      return {
        genres: genrePayload?.data?.items || [],
        countries: countryPayload?.data?.items || [],
        years: yearPayload?.data?.items || [],
      };
    },
    [],
    {
      initialData: EMPTY_META_DATA,
    }
  );
}
