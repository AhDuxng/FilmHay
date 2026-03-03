const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');
const { getOrSet } = require('../utils/cache');
const ApiError = require('../utils/ApiError');

const ophimClient = axios.create({
    baseURL: config.ophim.baseUrl,
    timeout: config.ophim.timeout,
    headers: {
        'Accept': 'application/json',
        'User-Agent': 'PhimHay-Server/1.0',
    },
});

ophimClient.interceptors.response.use(
    (res) => res,
    (error) => {
        const url = error.config?.url;
        if (error.code === 'ECONNABORTED') {
            logger.error('OPHIM API timeout', { url });
            throw ApiError.badGateway('API phim khong phan hoi, vui long thu lai');
        }
        if (error.response) {
            logger.error('OPHIM API error', { status: error.response.status, url });
        }
        throw ApiError.badGateway('Khong the ket noi den nguon phim');
    }
);

// Helper chung: fetch co cache va pagination
const fetchList = (cachePrefix, endpoint) => async (page = 1) => {
    return getOrSet(`${cachePrefix}_page_${page}`, async () => {
        const { data } = await ophimClient.get(endpoint, { params: { page } });
        return data;
    });
};

// Helper: validate va sanitize slug
const sanitizeSlug = (value, label = 'Slug') => {
    if (!value || typeof value !== 'string') {
        throw ApiError.badRequest(`${label} khong hop le`);
    }
    const safe = value.replace(/[^a-zA-Z0-9-]/g, '');
    if (safe !== value) throw ApiError.badRequest(`${label} chua ky tu khong hop le`);
    return safe;
};

const getHome = () => getOrSet('home', async () => {
    const { data } = await ophimClient.get('/home');
    return data;
});

const getNewMovies    = fetchList('new_movies', '/danh-sach/phim-moi');
const getSeriesMovies = fetchList('series', '/danh-sach/phim-bo');
const getSingleMovies = fetchList('single', '/danh-sach/phim-le');
const getAnimeMovies  = fetchList('anime', '/danh-sach/hoat-hinh');
const getTVShows      = fetchList('tv_shows', '/danh-sach/tv-shows');

const getMovieDetail = async (slug) => {
    const safe = sanitizeSlug(slug, 'Slug phim');
    return getOrSet(`movie_detail_${safe}`, async () => {
        const { data } = await ophimClient.get(`/phim/${safe}`);
        return data;
    });
};

const searchMovies = async (keyword, page = 1) => {
    if (!keyword || typeof keyword !== 'string') {
        throw ApiError.badRequest('Tu khoa tim kiem khong hop le');
    }
    const safe = keyword.trim().substring(0, 100);
    if (safe.length < 1) throw ApiError.badRequest('Tu khoa tim kiem qua ngan');

    return getOrSet(`search_${safe}_page_${page}`, async () => {
        const { data } = await ophimClient.get('/tim-kiem', {
            params: { keyword: safe, page },
        });
        return data;
    }, 120_000);
};

const SUGGEST_FIELDS = ['name', 'slug', 'poster_url', 'thumb_url', 'year', 'quality', 'episode_current', 'origin_name'];

const suggestMovies = async (keyword) => {
    if (!keyword || typeof keyword !== 'string') return { items: [] };
    const safe = keyword.trim().substring(0, 50);
    if (safe.length < 1) return { items: [] };

    return getOrSet(`suggest_${safe}`, async () => {
        const { data } = await ophimClient.get('/tim-kiem', {
            params: { keyword: safe, page: 1 },
        });
        // Chi tra ve 8 ket qua voi cac truong can thiet
        const items = (data?.data?.items || []).slice(0, 8).map((m) =>
            Object.fromEntries(SUGGEST_FIELDS.map((f) => [f, m[f]]))
        );
        return { items };
    }, 120_000);
};

// Fetch theo slug category (the loai / quoc gia)
const fetchBySlugCategory = (prefix, basePath, label) => async (slug, page = 1) => {
    const safe = sanitizeSlug(slug, label);
    return getOrSet(`${prefix}_${safe}_page_${page}`, async () => {
        const { data } = await ophimClient.get(`/${basePath}/${safe}`, { params: { page } });
        return data;
    });
};

const getMoviesByGenre   = fetchBySlugCategory('genre', 'the-loai', 'The loai');
const getMoviesByCountry = fetchBySlugCategory('country', 'quoc-gia', 'Quoc gia');

const getGenreList = () => getOrSet('genre_list', async () => {
    const { data } = await ophimClient.get('/the-loai');
    return data;
});

const getCountryList = () => getOrSet('country_list', async () => {
    const { data } = await ophimClient.get('/quoc-gia');
    return data;
});

module.exports = {
    getHome,
    getNewMovies,
    getSeriesMovies,
    getSingleMovies,
    getAnimeMovies,
    getTVShows,
    getMovieDetail,
    searchMovies,
    suggestMovies,
    getMoviesByGenre,
    getMoviesByCountry,
    getGenreList,
    getCountryList,
};
