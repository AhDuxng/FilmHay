const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');
const { getOrSet } = require('../utils/cache');
const ApiError = require('../utils/ApiError');

// Tao axios instance voi config chuan cho ophim API
const ophimClient = axios.create({
    baseURL: config.ophim.baseUrl,
    timeout: config.ophim.timeout,
    headers: {
        'Accept': 'application/json',
        'User-Agent': 'PhimHay-Server/1.0',
    },
});

// Response interceptor - xu ly loi tu ophim
ophimClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED') {
            logger.error('OPHIM API timeout', { url: error.config?.url });
            throw ApiError.badGateway('API phim khong phan hoi, vui long thu lai');
        }
        if (error.response) {
            logger.error('OPHIM API error', {
                status: error.response.status,
                url: error.config?.url,
            });
        }
        throw ApiError.badGateway('Khong the ket noi den nguon phim');
    }
);

/**
 * Lay du lieu trang chu (home)
 * Cache 5 phut vi data khong thay doi thuong xuyen
 */
const getHome = async () => {
    return getOrSet('home', async () => {
        const { data } = await ophimClient.get('/home');
        return data;
    });
};

/**
 * Lay danh sach phim moi cap nhat
 * @param {number} page - So trang
 */
const getNewMovies = async (page = 1) => {
    const cacheKey = `new_movies_page_${page}`;
    return getOrSet(cacheKey, async () => {
        const { data } = await ophimClient.get('/danh-sach/phim-moi', {
            params: { page },
        });
        return data;
    });
};

/**
 * Lay danh sach phim bo
 * @param {number} page
 */
const getSeriesMovies = async (page = 1) => {
    const cacheKey = `series_page_${page}`;
    return getOrSet(cacheKey, async () => {
        const { data } = await ophimClient.get('/danh-sach/phim-bo', {
            params: { page },
        });
        return data;
    });
};

/**
 * Lay danh sach phim le
 * @param {number} page
 */
const getSingleMovies = async (page = 1) => {
    const cacheKey = `single_page_${page}`;
    return getOrSet(cacheKey, async () => {
        const { data } = await ophimClient.get('/danh-sach/phim-le', {
            params: { page },
        });
        return data;
    });
};

/**
 * Lay danh sach hoat hinh
 * @param {number} page
 */
const getAnimeMovies = async (page = 1) => {
    const cacheKey = `anime_page_${page}`;
    return getOrSet(cacheKey, async () => {
        const { data } = await ophimClient.get('/danh-sach/hoat-hinh', {
            params: { page },
        });
        return data;
    });
};

/**
 * Lay danh sach TV shows
 * @param {number} page
 */
const getTVShows = async (page = 1) => {
    const cacheKey = `tv_shows_page_${page}`;
    return getOrSet(cacheKey, async () => {
        const { data } = await ophimClient.get('/danh-sach/tv-shows', {
            params: { page },
        });
        return data;
    });
};

/**
 * Lay chi tiet phim theo slug
 * @param {string} slug
 */
const getMovieDetail = async (slug) => {
    if (!slug || typeof slug !== 'string') {
        throw ApiError.badRequest('Slug phim khong hop le');
    }

    // Sanitize slug - chi cho phep ky tu an toan
    const safeSlug = slug.replace(/[^a-zA-Z0-9-]/g, '');
    if (safeSlug !== slug) {
        throw ApiError.badRequest('Slug phim chua ky tu khong hop le');
    }

    const cacheKey = `movie_detail_${safeSlug}`;
    return getOrSet(cacheKey, async () => {
        const { data } = await ophimClient.get(`/phim/${safeSlug}`);
        return data;
    });
};

/**
 * Tim kiem phim
 * @param {string} keyword
 * @param {number} page
 */
const searchMovies = async (keyword, page = 1) => {
    if (!keyword || typeof keyword !== 'string') {
        throw ApiError.badRequest('Tu khoa tim kiem khong hop le');
    }

    // Gioi han do dai keyword de tranh abuse
    const safeKeyword = keyword.trim().substring(0, 100);
    if (safeKeyword.length < 1) {
        throw ApiError.badRequest('Tu khoa tim kiem qua ngan');
    }

    const cacheKey = `search_${safeKeyword}_page_${page}`;
    return getOrSet(cacheKey, async () => {
        const { data } = await ophimClient.get('/tim-kiem', {
            params: { keyword: safeKeyword, page },
        });
        return data;
    }, 120_000); // Cache search 2 phut (ngan hon)
};

/**
 * Goi y tim kiem nhanh - tra ve toi da 8 ket qua nhe
 * Chi lay cac truong can thiet cho dropdown goi y
 * Cache 2 phut, gioi han do dai keyword
 * @param {string} keyword
 */
const suggestMovies = async (keyword) => {
    if (!keyword || typeof keyword !== 'string') {
        return { items: [] };
    }

    const safeKeyword = keyword.trim().substring(0, 50);
    if (safeKeyword.length < 1) {
        return { items: [] };
    }

    const cacheKey = `suggest_${safeKeyword}`;
    return getOrSet(cacheKey, async () => {
        const { data } = await ophimClient.get('/tim-kiem', {
            params: { keyword: safeKeyword, page: 1 },
        });

        // Chi lay 8 ket qua dau, giam payload cho dropdown
        const items = (data?.data?.items || []).slice(0, 8).map((m) => ({
            name: m.name,
            slug: m.slug,
            poster_url: m.poster_url,
            thumb_url: m.thumb_url,
            year: m.year,
            quality: m.quality,
            episode_current: m.episode_current,
            origin_name: m.origin_name,
        }));

        return { items };
    }, 120_000);
};

/**
 * Lay phim theo the loai
 * @param {string} genre - slug the loai
 * @param {number} page
 */
const getMoviesByGenre = async (genre, page = 1) => {
    if (!genre || typeof genre !== 'string') {
        throw ApiError.badRequest('The loai khong hop le');
    }

    const safeGenre = genre.replace(/[^a-zA-Z0-9-]/g, '');
    const cacheKey = `genre_${safeGenre}_page_${page}`;
    return getOrSet(cacheKey, async () => {
        const { data } = await ophimClient.get(`/the-loai/${safeGenre}`, {
            params: { page },
        });
        return data;
    });
};

/**
 * Lay phim theo quoc gia
 * @param {string} country - slug quoc gia
 * @param {number} page
 */
const getMoviesByCountry = async (country, page = 1) => {
    if (!country || typeof country !== 'string') {
        throw ApiError.badRequest('Quoc gia khong hop le');
    }

    const safeCountry = country.replace(/[^a-zA-Z0-9-]/g, '');
    const cacheKey = `country_${safeCountry}_page_${page}`;
    return getOrSet(cacheKey, async () => {
        const { data } = await ophimClient.get(`/quoc-gia/${safeCountry}`, {
            params: { page },
        });
        return data;
    });
};

/**
 * Lấy danh sách tất cả thể loại
 */
const getGenreList = async () => {
    return getOrSet('genre_list', async () => {
        const { data } = await ophimClient.get('/the-loai');
        return data;
    });
};

/**
 * Lấy danh sách tất cả quốc gia
 */
const getCountryList = async () => {
    return getOrSet('country_list', async () => {
        const { data } = await ophimClient.get('/quoc-gia');
        return data;
    });
};

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
