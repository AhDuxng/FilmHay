import { useState, useEffect, useCallback, useRef } from 'react';
import { movieApi } from '../services/api';

/**
 * @param {Function} apiMethod - ham goi API
 * @param {Array} params - tham so truyen vao apiMethod
 * @param {Array} dependencies - dependency array cho useEffect
 * @param {boolean} enabled - chi goi API khi true (mac dinh true)
 */
export function useMovies(apiMethod, params = [], dependencies = [], enabled = true) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const abortRef = useRef(null);

    const fetchData = useCallback(async () => {
        // Huy request truoc do neu con pending
        if (abortRef.current) {
            abortRef.current.abort();
        }
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            setLoading(true);
            setError(null);
            const response = await apiMethod(...params);
            if (!controller.signal.aborted) {
                setData(response.data);
            }
        } catch (err) {
            if (!controller.signal.aborted) {
                setError(err.message || 'Co loi xay ra');
            }
        } finally {
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        }
    }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!enabled) {
            setLoading(false);
            return;
        }
        fetchData();
        return () => {
            if (abortRef.current) {
                abortRef.current.abort();
            }
        };
    }, [fetchData, enabled]);

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
 * @param {boolean} enabled - chi goi khi route la /danh-sach/
 */
export function useMovieList(type, page = 1, enabled = true) {
    const apiMap = {
        'phim-moi': movieApi.getNewMovies,
        'phim-bo': movieApi.getSeriesMovies,
        'phim-le': movieApi.getSingleMovies,
        'hoat-hinh': movieApi.getAnimeMovies,
        'tv-shows': movieApi.getTVShows,
    };

    const apiMethod = apiMap[type] || movieApi.getNewMovies;
    return useMovies(apiMethod, [page], [type, page], enabled);
}

/**
 * Hook lay phim theo the loai (genre)
 * @param {string} slug - slug the loai (vd: 'hanh-dong')
 * @param {number} page
 * @param {boolean} enabled - chi goi khi route la /the-loai/
 */
export function useMoviesByGenre(slug, page = 1, enabled = true) {
    return useMovies(movieApi.getMoviesByGenre, [slug, page], [slug, page], enabled);
}

/**
 * Hook lay phim theo quoc gia (country)
 * @param {string} slug - slug quoc gia (vd: 'han-quoc')
 * @param {number} page
 * @param {boolean} enabled - chi goi khi route la /quoc-gia/
 */
export function useMoviesByCountry(slug, page = 1, enabled = true) {
    return useMovies(movieApi.getMoviesByCountry, [slug, page], [slug, page], enabled);
}
