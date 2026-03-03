const movieService = require('../services/movieService');
const { getStats } = require('../utils/cache');
const asyncHandler = require('../utils/asyncHandler');

const parsePage = (query) => Math.max(1, parseInt(query.page, 10) || 1);

// Factory: tao handler cho cac endpoint co pagination
const listHandler = (serviceFn) => asyncHandler(async (req, res) => {
    const data = await serviceFn(parsePage(req.query));
    res.json({ success: true, data });
});

// Factory: tao handler cho cac endpoint co slug + pagination
const slugHandler = (serviceFn) => asyncHandler(async (req, res) => {
    const data = await serviceFn(req.params.slug, parsePage(req.query));
    res.json({ success: true, data });
});

const getHome          = asyncHandler(async (_req, res) => {
    const data = await movieService.getHome();
    res.json({ success: true, data });
});

const getNewMovies     = listHandler(movieService.getNewMovies);
const getSeriesMovies  = listHandler(movieService.getSeriesMovies);
const getSingleMovies  = listHandler(movieService.getSingleMovies);
const getAnimeMovies   = listHandler(movieService.getAnimeMovies);
const getTVShows       = listHandler(movieService.getTVShows);

const getMovieDetail   = asyncHandler(async (req, res) => {
    const data = await movieService.getMovieDetail(req.params.slug);
    res.json({ success: true, data });
});

const searchMovies     = asyncHandler(async (req, res) => {
    const data = await movieService.searchMovies(req.query.keyword, parsePage(req.query));
    res.json({ success: true, data });
});

const suggestMovies    = asyncHandler(async (req, res) => {
    const data = await movieService.suggestMovies(req.query.keyword);
    res.json({ success: true, data });
});

const getMoviesByGenre   = slugHandler(movieService.getMoviesByGenre);
const getMoviesByCountry = slugHandler(movieService.getMoviesByCountry);

const getGenreList     = asyncHandler(async (_req, res) => {
    const data = await movieService.getGenreList();
    res.json({ success: true, data });
});

const getCountryList   = asyncHandler(async (_req, res) => {
    const data = await movieService.getCountryList();
    res.json({ success: true, data });
});

const healthCheck = asyncHandler(async (_req, res) => {
    const mem = process.memoryUsage();
    res.json({
        success: true,
        data: {
            status: 'OK',
            uptime: Math.floor(process.uptime()),
            timestamp: new Date().toISOString(),
            cache: getStats(),
            memory: {
                used: Math.round(mem.heapUsed / 1024 / 1024) + 'MB',
                total: Math.round(mem.heapTotal / 1024 / 1024) + 'MB',
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
