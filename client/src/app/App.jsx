import { BrowserRouter } from 'react-router-dom';
import AppLayout from '@/app/layout/AppLayout';
import ErrorBoundary from '@/shared/components/feedback/ErrorBoundary';

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
