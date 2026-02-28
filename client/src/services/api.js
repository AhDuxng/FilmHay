import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Tao axios instance voi config chuan
const api = axios.create({
    baseURL: API_URL,
    timeout: 15_000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor - xu ly loi tap trung
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.message || 'Lỗi kết nối, vui lòng thử lại';
        console.error('[API Error]', message);
        return Promise.reject(new Error(message));
    }
);

// ===== MOVIE API =====
export const movieApi = {
    // Trang chu
    getHome: () => api.get('/movies/home'),

    // Danh sach phim
    getNewMovies: (page = 1) => api.get(`/movies/new?page=${page}`),
    getSeriesMovies: (page = 1) => api.get(`/movies/series?page=${page}`),
    getSingleMovies: (page = 1) => api.get(`/movies/single?page=${page}`),
    getAnimeMovies: (page = 1) => api.get(`/movies/anime?page=${page}`),
    getTVShows: (page = 1) => api.get(`/movies/tv-shows?page=${page}`),

    // Chi tiet phim
    getMovieDetail: (slug) => api.get(`/movies/detail/${slug}`),

    // Tim kiem
    searchMovies: (keyword, page = 1) => api.get(`/movies/search?keyword=${encodeURIComponent(keyword)}&page=${page}`),

    // Goi y tim kiem nhanh (dropdown autocomplete)
    suggestMovies: (keyword) => api.get(`/movies/suggest?keyword=${encodeURIComponent(keyword)}`),

    // The loai / Quoc gia
    getGenreList: () => api.get('/movies/genres'),
    getCountryList: () => api.get('/movies/countries'),
    getMoviesByGenre: (slug, page = 1) => api.get(`/movies/genre/${slug}?page=${page}`),
    getMoviesByCountry: (slug, page = 1) => api.get(`/movies/country/${slug}?page=${page}`),
};

export default api;
