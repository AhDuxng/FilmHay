const { Router } = require('express');
const mc = require('../controllers/movieController');
const { searchLimiter, suggestLimiter } = require('../middlewares/rateLimiter');
const { authenticate } = require('../middlewares/auth.middleware');

const router = Router();
router.use(authenticate);

router.get('/home', mc.getHome);
router.get('/new', mc.getNewMovies);
router.get('/series', mc.getSeriesMovies);
router.get('/single', mc.getSingleMovies);
router.get('/anime', mc.getAnimeMovies);
router.get('/tv-shows', mc.getTVShows);
router.get('/detail/:slug', mc.getMovieDetail);
router.get('/search', searchLimiter, mc.searchMovies);
router.get('/suggest', suggestLimiter, mc.suggestMovies);
router.get('/genres', mc.getGenreList);
router.get('/countries', mc.getCountryList);
router.get('/genre/:slug', mc.getMoviesByGenre);
router.get('/country/:slug', mc.getMoviesByCountry);

module.exports = router;
