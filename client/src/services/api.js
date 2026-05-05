import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_OPHIM_API_URL || 'https://ophim1.com/v1/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    accept: 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error?.message || 'Request failed';

    if (status >= 500) {
      return Promise.reject(new Error('Server is busy. Please retry.'));
    }

    return Promise.reject(new Error(message));
  }
);

const withPage = (page = 1) => ({
  params: {
    page,
  },
});

export const movieApi = {
  getHome: () => api.get('/home'),

  getMovieList: (slug, page = 1) => api.get(`/danh-sach/${slug}`, withPage(page)),

  searchMovies: (keyword, page = 1) =>
    api.get('/tim-kiem', {
      params: {
        keyword,
        page,
      },
    }),

  suggestMovies: async (keyword, limit = 8) => {
    const payload = await api.get('/tim-kiem', {
      params: {
        keyword,
        page: 1,
      },
    });

    const items = payload?.data?.items || [];

    return {
      ...payload,
      data: {
        ...payload?.data,
        items: items.slice(0, limit),
      },
    };
  },

  getGenreList: () => api.get('/the-loai'),
  getMoviesByGenre: (slug, page = 1) => api.get(`/the-loai/${slug}`, withPage(page)),

  getCountryList: () => api.get('/quoc-gia'),
  getMoviesByCountry: (slug, page = 1) => api.get(`/quoc-gia/${slug}`, withPage(page)),

  getYearList: () => api.get('/nam-phat-hanh'),
  getMoviesByYear: (year, page = 1) => api.get(`/nam-phat-hanh/${year}`, withPage(page)),

  getMovieDetail: (slug) => api.get(`/phim/${slug}`),
  getMovieImages: (slug) => api.get(`/phim/${slug}/images`),
  getMoviePeoples: (slug) => api.get(`/phim/${slug}/peoples`),
  getMovieKeywords: (slug) => api.get(`/phim/${slug}/keywords`),
};

export default api;
