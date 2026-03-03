const movieService = require('../services/movieService');
const logger = require('../utils/logger');
const { getStats } = require('../utils/cache');

/**
 * Wrapper async cho controller
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// GET /api/movies/home
const getHome = asyncHandler(async (req, res) => {
    const data = await movieService.getHome();
    res.json({ success: true, data });
});

// GET /api/movies/new?page=1
const getNewMovies = asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const data = await movieService.getNewMovies(page);
    res.json({ success: true, data });
});

// GET /api/movies/series?page=1
const getSeriesMovies = asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const data = await movieService.getSeriesMovies(page);
    res.json({ success: true, data });
});

// GET /api/movies/single?page=1
const getSingleMovies = asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const data = await movieService.getSingleMovies(page);
    res.json({ success: true, data });
});

// GET /api/movies/anime?page=1
const getAnimeMovies = asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const data = await movieService.getAnimeMovies(page);
    res.json({ success: true, data });
});

// GET /api/movies/tv-shows?page=1
const getTVShows = asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const data = await movieService.getTVShows(page);
    res.json({ success: true, data });
});

// GET /api/movies/detail/:slug
const getMovieDetail = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const data = await movieService.getMovieDetail(slug);
    res.json({ success: true, data });
});

// GET /api/movies/search?keyword=xxx&page=1
const searchMovies = asyncHandler(async (req, res) => {
    const { keyword } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const data = await movieService.searchMovies(keyword, page);
    res.json({ success: true, data });
});

// GET /api/movies/suggest?keyword=xxx - goi y tim kiem nhanh
const suggestMovies = asyncHandler(async (req, res) => {
    const { keyword } = req.query;
    const data = await movieService.suggestMovies(keyword);
    res.json({ success: true, data });
});

// GET /api/movies/genre/:slug?page=1
const getMoviesByGenre = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const data = await movieService.getMoviesByGenre(slug, page);
    res.json({ success: true, data });
});

// GET /api/movies/country/:slug?page=1
const getMoviesByCountry = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const data = await movieService.getMoviesByCountry(slug, page);
    res.json({ success: true, data });
});

// GET /api/movies/genres - Danh sách tất cả thể loại
const getGenreList = asyncHandler(async (req, res) => {
    const data = await movieService.getGenreList();
    res.json({ success: true, data });
});

// GET /api/movies/countries - Danh sách tất cả quốc gia
const getCountryList = asyncHandler(async (req, res) => {
    const data = await movieService.getCountryList();
    res.json({ success: true, data });
});

// GET /api/health
const healthCheck = asyncHandler(async (req, res) => {
    const cacheStats = getStats();
    res.json({
        success: true,
        data: {
            status: 'OK',
            uptime: Math.floor(process.uptime()),
            timestamp: new Date().toISOString(),
            cache: cacheStats,
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB',
            },
        },
    });
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
    healthCheck,
};
