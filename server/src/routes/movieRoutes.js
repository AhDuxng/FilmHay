const { Router } = require('express');
const movieController = require('../controllers/movieController');
const { searchLimiter, suggestLimiter } = require('../middlewares/rateLimiter');
const { authenticate } = require('../middlewares/auth.middleware');

const router = Router();

router.use(authenticate);

// Trang chu - du lieu tong hop
router.get('/home', movieController.getHome);

// Danh sach phim theo loai
router.get('/new', movieController.getNewMovies);
router.get('/series', movieController.getSeriesMovies);
router.get('/single', movieController.getSingleMovies);
router.get('/anime', movieController.getAnimeMovies);
router.get('/tv-shows', movieController.getTVShows);

// Chi tiet phim
router.get('/detail/:slug', movieController.getMovieDetail);

// Tim kiem
router.get('/search', searchLimiter, movieController.searchMovies);

// Goi y tim kiem nhanh
router.get('/suggest', suggestLimiter, movieController.suggestMovies);

// Danh sách thể loại / quốc gia
router.get('/genres', movieController.getGenreList);
router.get('/countries', movieController.getCountryList);

// Theo thể loại / quốc gia
router.get('/genre/:slug', movieController.getMoviesByGenre);
router.get('/country/:slug', movieController.getMoviesByCountry);

module.exports = router;
