import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

/**
 * The whole route table in one place. Each page is its own lazy chunk, so a
 * visitor who only opens the home page never downloads the player.
 */
const HomePage = lazy(() => import('@/features/home/HomePage'));
const MovieDetailPage = lazy(() => import('@/features/movie/MovieDetailPage'));
const WatchPage = lazy(() => import('@/features/movie/WatchPage'));
const SearchPage = lazy(() => import('@/features/browse/SearchPage'));
const CategoryPage = lazy(() => import('@/features/browse/CategoryPage'));

export const routes = [
  { path: '/', element: <HomePage /> },

  // Both spellings are kept: /movie/:id predates the Vietnamese routes and is
  // still linked from elsewhere.
  { path: '/movie/:id', element: <MovieDetailPage /> },
  { path: '/phim/:id', element: <MovieDetailPage /> },
  { path: '/watch/:id', element: <WatchPage /> },

  { path: '/search', element: <SearchPage /> },
  { path: '/tim-kiem', element: <SearchPage /> },

  { path: '/danh-sach/:slug', element: <CategoryPage /> },
  { path: '/the-loai/:slug', element: <CategoryPage /> },
  { path: '/quoc-gia/:slug', element: <CategoryPage /> },
  { path: '/nam-phat-hanh/:slug', element: <CategoryPage /> },

  { path: '*', element: <Navigate to="/" replace /> },
];

export default routes;
