import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import TopNavBar from '@/app/layout/TopNavBar';
import Footer from '@/app/layout/Footer';
import Loading from '@/shared/components/feedback/Loading';
import routes from '@/app/routes';

function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNavBar />
      <Suspense fallback={<Loading fullScreen />}>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}

export default AppLayout;
