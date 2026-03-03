import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Loading from './components/common/Loading';
import ErrorBoundary from './components/common/ErrorBoundary';
import PageTransition from './components/common/PageTransition';
import PrivateRoute from './components/common/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';

// Lazy load pages - chi tai khi can
const HomePage = lazy(() => import('./pages/HomePage'));
const MovieDetailPage = lazy(() => import('./pages/MovieDetailPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));

function App() {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        {/* Public route - Login */}
                        <Route path="/login" element={<LoginPage />} />

                        {/* Protected routes - Can dang nhap */}
                        <Route
                            path="/*"
                            element={
                                <PrivateRoute>
                                    <>
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
                                                <Route path="*" element={<Navigate to="/" replace />} />
                                            </Routes>
                                        </Suspense>
                                        <Footer />
                                    </>
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </ErrorBoundary>
    );
}

export default App;
