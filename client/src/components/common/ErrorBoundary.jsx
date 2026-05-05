import { Component } from 'react';
import { RiBugLine, RiRefreshLine } from 'react-icons/ri';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#07090f] px-6 text-center">
        <RiBugLine className="mb-4 text-6xl text-primary" />
        <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
        <p className="mt-2 max-w-md text-sm text-neutral-300">Please reload the page and try again.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong"
        >
          <RiRefreshLine className="text-base" />
          Reload
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
