import { memo } from 'react';
import { RiMoonLine, RiSunLine } from 'react-icons/ri';
import { useTheme } from '@/shared/hooks/useTheme';

const ThemeToggle = memo(function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? 'Chuyển sang giao diện tối' : 'Chuyển sang giao diện sáng'}
      title={isLight ? 'Giao diện tối' : 'Giao diện sáng'}
      className={`flex h-10 w-10 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface-container-high hover:text-on-surface ${className}`}
    >
      {isLight ? <RiMoonLine className="h-5 w-5" aria-hidden="true" /> : <RiSunLine className="h-5 w-5" aria-hidden="true" />}
    </button>
  );
});

export default ThemeToggle;
