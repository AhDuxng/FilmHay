const catchAsync = require('../utils/catchAsync');
const { getStats } = require('../utils/cache');
const ApiError = require('../utils/ApiError');
const { KEYWORD } = require('../utils/constants');

const parsePage = (query) => Math.max(1, parseInt(query.page, 10) || 1);

// Throw 404 neu data null/undefined
const assertFound = (data, msg = 'Khong tim thay noi dung') => {
    if (!data) throw ApiError.notFound(msg);
    return data;
};

// Validate va sanitize keyword, throw 400 neu khong hop le
const validateKeyword = (raw, maxLen) => {
    if (!raw || typeof raw !== 'string') {
        throw ApiError.badRequest('Tu khoa tim kiem khong hop le');
    }
    const trimmed = raw.trim().substring(0, maxLen);
    if (trimmed.length < KEYWORD.MIN_LEN) {
        throw ApiError.badRequest('Tu khoa tim kiem qua ngan');
    }
    return trimmed;
};

// Chuan hoa response co pagination tu OPHIM API
const normalizePaginated = (raw) => {
    const inner = raw?.data || raw;
    return {
        items: inner?.items || [],
        pagination: inner?.params?.pagination || null,
        titlePage: inner?.titlePage || '',
    };
};

class MovieController {
    constructor(movieService) {
        this.movieService = movieService;

        // Factory handlers co pagination
        this.getNewMovies    = this._listHandler(movieService.getNewMovies);
        this.getSeriesMovies = this._listHandler(movieService.getSeriesMovies);
        this.getSingleMovies = this._listHandler(movieService.getSingleMovies);
        this.getAnimeMovies  = this._listHandler(movieService.getAnimeMovies);
        this.getTVShows      = this._listHandler(movieService.getTVShows);

        // Factory handlers co slug + pagination
        this.getMoviesByGenre   = this._slugHandler(movieService.getMoviesByGenre);
        this.getMoviesByCountry = this._slugHandler(movieService.getMoviesByCountry);

        // Bind prototype methods voi catchAsync
        this.getHome        = catchAsync(this.getHome.bind(this));
        this.getMovieDetail = catchAsync(this.getMovieDetail.bind(this));
        this.searchMovies   = catchAsync(this.searchMovies.bind(this));
        this.suggestMovies  = catchAsync(this.suggestMovies.bind(this));
        this.getGenreList   = catchAsync(this.getGenreList.bind(this));
        this.getCountryList = catchAsync(this.getCountryList.bind(this));
        this.healthCheck    = catchAsync(this.healthCheck.bind(this));
    }

    // Factory: endpoint co pagination
    _listHandler(serviceFn) {
        return catchAsync(async (req, res) => {
            const raw = await serviceFn(parsePage(req.query));
            res.json({ success: true, data: normalizePaginated(assertFound(raw)) });
        });
    }

    // Factory: endpoint co slug + pagination
    _slugHandler(serviceFn) {
        return catchAsync(async (req, res) => {
            const raw = await serviceFn(req.params.slug, parsePage(req.query));
            res.json({ success: true, data: normalizePaginated(assertFound(raw)) });
        });
    }

    async getHome(_req, res) {
        const data = assertFound(await this.movieService.getHome(), 'Khong the tai trang chu');
        res.json({ success: true, data });
    }

    async getMovieDetail(req, res) {
        const data = assertFound(
            await this.movieService.getMovieDetail(req.params.slug),
            'Khong tim thay phim'
        );
        res.json({ success: true, data });
    }

    async searchMovies(req, res) {
        const keyword = validateKeyword(req.query.keyword, KEYWORD.SEARCH_MAX_LEN);
        const raw = await this.movieService.searchMovies(keyword, parsePage(req.query));
        res.json({ success: true, data: normalizePaginated(raw) });
    }

    // Suggest: tra ve items rong thay vi throw loi (UX autocomplete)
    async suggestMovies(req, res) {
        const { keyword } = req.query;
        if (!keyword || typeof keyword !== 'string' || keyword.trim().length < KEYWORD.MIN_LEN) {
            return res.json({ success: true, data: { items: [] } });
        }
        const data = await this.movieService.suggestMovies(keyword);
        res.json({ success: true, data });
    }

    async getGenreList(_req, res) {
        const data = assertFound(await this.movieService.getGenreList(), 'Khong the tai danh sach the loai');
        res.json({ success: true, data });
    }

    async getCountryList(_req, res) {
        const data = assertFound(await this.movieService.getCountryList(), 'Khong the tai danh sach quoc gia');
        res.json({ success: true, data });
    }

    async healthCheck(_req, res) {
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
    }
}

module.exports = new MovieController(require('../services/movieService'));
