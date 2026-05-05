import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Loading from './components/common/Loading';
import ErrorBoundary from './components/common/ErrorBoundary';
import PageTransition from './components/common/PageTransition';

const HomePage = lazy(() => import('./pages/HomePage'));
const MovieDetailPage = lazy(() => import('./pages/MovieDetailPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));

function AppLayout() {
  return (
    <>
      <Navbar />
      <PageTransition />
      <Suspense fallback={<Loading fullScreen />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/phim/:slug" element={<MovieDetailPage />} />
          <Route path="/tim-kiem" element={<SearchPage />} />
          <Route path="/danh-sach/:slug" element={<CategoryPage />} />
          <Route path="/the-loai/:slug" element={<CategoryPage />} />
          <Route path="/quoc-gia/:slug" element={<CategoryPage />} />
          <Route path="/nam-phat-hanh/:slug" element={<CategoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
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
