import { APP_NAME } from './constants';

export const IMAGE_CDN_BASE = 'https://phimimg.com';
export const IMAGE_PLACEHOLDER = '/movie-placeholder.svg';
export const SECTION_PADDING = 'px-6 md:px-8 lg:px-12';
export const PAGE_PADDING = 'px-6 pt-24 pb-12 md:px-8 lg:px-12';
export const CONTENT_WRAP = 'mx-auto w-full max-w-[1500px]';
export const MOVIE_GRID_CLASS = 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
export const RETRY_BUTTON_CLASS = 'inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong';

export const getImageUrl = (path, cdnBase = IMAGE_CDN_BASE) => {
  if (!path || typeof path !== 'string') {
    return IMAGE_PLACEHOLDER;
  }

  if (path.startsWith('http:') || path.startsWith('https:')) {
    return path;
  }

  const finalBase = (cdnBase || IMAGE_CDN_BASE).replace(/\/+$/, '');
  const cleanPath = path.replace(/^\/+/, '');

  if (finalBase.endsWith('/uploads/movies') && cleanPath.startsWith('uploads/movies/')) {
    return `${finalBase}/${cleanPath.slice('uploads/movies/'.length)}`;
  }

  return `${finalBase}/${cleanPath}`;
};

export const getPosterUrl = (movie, cdnBase) =>
  getImageUrl(movie?.poster_url || movie?.thumb_url || '', cdnBase);

export const getThumbUrl = (movie, cdnBase) =>
  getImageUrl(movie?.thumb_url || movie?.poster_url || '', cdnBase);

export const slugToTitle = (slug = '') =>
  slug
    .split('-')
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ');

export const createPagination = (pagination = {}) => {
  const currentPage = Number(pagination.currentPage || 1);
  const totalItems = Number(pagination.totalItems || 0);
  const perPage = Number(pagination.totalItemsPerPage || 24);
  const explicitTotalPages = Number(pagination.totalPages || 0);
  const totalPages = explicitTotalPages || Math.max(1, Math.ceil(totalItems / perPage));

  return {
    currentPage,
    totalPages,
    totalItems,
    perPage,
  };
};

export const normalizeListPayload = (payload) => {
  const data = payload?.data || payload || {};
  const pagination = data.params?.pagination || data.pagination || payload?.pagination || {};

  return {
    items: Array.isArray(data.items) ? data.items : [],
    pagination: createPagination(pagination),
    titlePage: data.titlePage || '',
    typeList: data.type_list || '',
    seo: data.seoOnPage || null,
    cdn: data.APP_DOMAIN_CDN_IMAGE || data.pathImage || payload?.pathImage || IMAGE_CDN_BASE,
  };
};

export const normalizeMoviePayload = (payload) => {
  const data = payload?.data || payload || {};
  const movie = data.item || data.movie || payload?.movie || null;

  return {
    movie,
    cdn: data.APP_DOMAIN_CDN_IMAGE || data.pathImage || payload?.pathImage || IMAGE_CDN_BASE,
    seo: data.seoOnPage || null,
  };
};

export const sanitizeKeywords = (payload) => {
  const data = payload?.data || {};
  return Array.isArray(data.keywords) ? data.keywords : [];
};

export const sanitizeImages = (payload) => {
  const data = payload?.data || {};
  return Array.isArray(data.images) ? data.images : [];
};

export const sanitizePeoples = (payload) => {
  const data = payload?.data || {};
  return Array.isArray(data.peoples) ? data.peoples : [];
};

export const handleImageError = (event) => {
  const target = event.currentTarget;
  target.onerror = null;
  target.src = IMAGE_PLACEHOLDER;
};

export const buildMetaText = (movie) => {
  const parts = [movie?.quality, movie?.lang, movie?.time].filter(Boolean);
  return parts.join(' • ');
};

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'instant' });
};

export const makePageTitle = (title) => {
  if (!title) {
    return APP_NAME;
  }
  return `${title} | ${APP_NAME}`;
};

export const getYearFromMovie = (movie) => {
  const year = Number(movie?.year || 0);
  if (!Number.isFinite(year) || year <= 0) {
    return '';
  }
  return String(year);
};
