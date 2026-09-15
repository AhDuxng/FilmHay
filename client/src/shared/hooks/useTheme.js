import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'filmhay-theme';

function readTheme() {
  if (typeof document === 'undefined') {
    return 'dark';
  }

  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

/**
 * Dark is this site's default. The inline script in index.html has already
 * stamped the root element before first paint, so this hook only mirrors the
 * choice and flips it — there is no flash of the wrong theme on load.
 */
export function useTheme() {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);

    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Private browsing: the choice simply does not survive the session.
    }

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'light' ? '#ffffff' : '#1e1e1e');
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, toggleTheme };
}

export default useTheme;
