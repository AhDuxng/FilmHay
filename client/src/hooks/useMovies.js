import { useState, useEffect, useCallback, useRef } from 'react';
import { movieApi } from '../services/api';

/**
 * Custom hook goi API phim
 * Tu dong xu ly loading, error, data
 * Co ho tro cancel request khi component unmount
 */
export function useMovies(apiMethod, params = [], dependencies = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const mountedRef = useRef(true);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiMethod(...params);
            if (mountedRef.current) {
                setData(response.data);
            }
        } catch (err) {
            if (mountedRef.current) {
                setError(err.message || 'Co loi xay ra');
            }
        } finally {
            if (mountedRef.current) {
                setLoading(false);
            }
        }
    }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        mountedRef.current = true;
        fetchData();
        return () => {
            mountedRef.current = false;
        };
    }, [fetchData]);

    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch };
}

/**
 * Hook lay du lieu trang chu
 */
export function useHomeData() {
    return useMovies(movieApi.getHome, [], []);
}

/**
 * Hook lay chi tiet phim
 */
export function useMovieDetail(slug) {
    return useMovies(movieApi.getMovieDetail, [slug], [slug]);
}

/**
 * Hook tim kiem phim
 */
export function useSearchMovies(keyword, page = 1) {
    return useMovies(movieApi.searchMovies, [keyword, page], [keyword, page]);
}

/**
 * Hook lay danh sach phim theo loai
 */
export function useMovieList(type, page = 1) {
    const apiMap = {
        'phim-moi': movieApi.getNewMovies,
        'phim-bo': movieApi.getSeriesMovies,
        'phim-le': movieApi.getSingleMovies,
        'hoat-hinh': movieApi.getAnimeMovies,
        'tv-shows': movieApi.getTVShows,
    };

    const apiMethod = apiMap[type] || movieApi.getNewMovies;
    return useMovies(apiMethod, [page], [type, page]);
}
