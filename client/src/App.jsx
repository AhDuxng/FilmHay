import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Loading from './components/common/Loading';
import ErrorBoundary from './components/common/ErrorBoundary';
import PageTransition from './components/common/PageTransition';

// Lazy load pages - chi tai khi can
const HomePage = lazy(() => import('./pages/HomePage'));
const MovieDetailPage = lazy(() => import('./pages/MovieDetailPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));

function App() {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <Navbar />
                <PageTransition />
                <Suspense fallback={<Loading fullScreen />}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/phim/:slug" element={<MovieDetailPage />} />
                        <Route path="/tim-kiem" element={<SearchPage />} />
                        <Route path="/danh-sach/:type" element={<CategoryPage />} />
                        <Route path="/the-loai/:slug" element={<CategoryPage />} />
                        <Route path="/quoc-gia/:slug" element={<CategoryPage />} />
                    </Routes>
                </Suspense>
                <Footer />
            </BrowserRouter>
        </ErrorBoundary>
    );
}

export default App;
