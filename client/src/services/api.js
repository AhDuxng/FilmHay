import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Tao axios instance voi config chuan
const api = axios.create({
    baseURL: API_URL,
    timeout: 15_000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Cho phep gui cookie
});

// Request interceptor - them token vao header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - xu ly loi tap trung
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.message || 'Lỗi kết nối, vui lòng thử lại';
        
        // Neu token het han hoac khong hop le, xoa token va redirect ve login
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            
            // Neu khong phai dang o trang login, redirect ve login
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        
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

// ===== AUTH API =====
export const authApi = {
    // Dang nhap
    login: (identifier, password) => api.post('/auth/login', { identifier, password }),
    
    // Dang xuat
    logout: () => api.post('/auth/logout'),
    
    // Lay thong tin user hien tai
    getCurrentUser: () => api.get('/auth/me'),
    
    // Verify token
    verifyToken: (token) => api.post('/auth/verify', { token }),
    
    // Refresh token
    refreshToken: () => api.post('/auth/refresh'),
};

export default api;
