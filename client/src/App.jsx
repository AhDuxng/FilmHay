import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { TopNavBar } from './components/common/TopNavBar';
import { Footer } from './components/common/Footer';
import Loading from './components/common/Loading';
import ErrorBoundary from './components/common/ErrorBoundary';

const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const MovieDetail = lazy(() => import('./pages/MovieDetail').then(module => ({ default: module.MovieDetail })));
const SearchFilter = lazy(() => import('./pages/SearchFilter').then(module => ({ default: module.SearchFilter })));
const WatchMovie = lazy(() => import('./pages/WatchMovie').then(module => ({ default: module.WatchMovie })));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));

function AppLayout() {
  const location = useLocation();
  const isWatchPage = location.pathname.startsWith('/watch/');

  return (
    <div className="flex flex-col min-h-screen">
      {!isWatchPage && <TopNavBar />}
      <Suspense fallback={<Loading fullScreen />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/phim/:id" element={<MovieDetail />} />
          <Route path="/watch/:id" element={<WatchMovie />} />
          <Route path="/search" element={<SearchFilter />} />
          <Route path="/tim-kiem" element={<SearchFilter />} />
          <Route path="/danh-sach/:slug" element={<CategoryPage />} />
          <Route path="/the-loai/:slug" element={<CategoryPage />} />
          <Route path="/quoc-gia/:slug" element={<CategoryPage />} />
          <Route path="/nam-phat-hanh/:slug" element={<CategoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      {!isWatchPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
