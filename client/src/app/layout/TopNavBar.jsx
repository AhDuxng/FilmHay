import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { RiCloseLine, RiMenuLine, RiSearchLine } from 'react-icons/ri';
import { APP_NAME } from '@/shared/lib/constants';
import Cube from '@/shared/components/ui/Cube';
import ThemeToggle from '@/shared/components/ui/ThemeToggle';

const navItems = [
  { label: 'Trang chủ', path: '/' },
  { label: 'Phim bộ', path: '/danh-sach/phim-bo' },
  { label: 'Phim lẻ', path: '/danh-sach/phim-le' },
  { label: 'Hoạt hình', path: '/the-loai/hoat-hinh' },
  { label: 'Tìm kiếm', path: '/search' },
];

const TopNavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-outline bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-container-max items-center justify-between gap-3 px-margin-mobile md:h-20 md:px-margin-desktop">
        <div className="flex min-w-0 items-center gap-8">
          <Link to="/" onClick={closeMenu} className="flex min-w-0 items-center gap-1">
            <Cube size={16} animated={false} className="-ml-2 shrink-0" />
            <span className="text-ramp truncate font-display-lg text-[18px] font-bold sm:text-xl md:text-headline-md">
              <span className="hidden sm:inline">{APP_NAME}</span>
              <span className="sm:hidden">Trạm Phim</span>
            </span>
          </Link>
          <ul className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({isActive}) => isActive 
                  ? "text-on-surface font-bold border-b-2 border-primary-container pb-1 text-body-md font-body-md transition-colors active:scale-95" 
                  : "text-secondary hover:text-on-surface transition-colors hover:scale-105 duration-200 text-body-md font-body-md active:scale-95"}
              >
                {item.label}
              </NavLink>
            </li>
            ))}
          </ul>
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link to="/search" onClick={closeMenu} aria-label="Tìm kiếm phim" className="flex h-10 w-10 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface-container-high hover:text-on-surface">
            <RiSearchLine className="h-5 w-5" aria-hidden="true" />
          </Link>
          <ThemeToggle />
          <button
            type="button"
            aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface-container-high hover:text-on-surface lg:hidden"
          >
            {menuOpen ? <RiCloseLine className="h-6 w-6" /> : <RiMenuLine className="h-6 w-6" />}
          </button>
        </div>
      </div>
      <div className={`${menuOpen ? 'grid' : 'hidden'} border-t border-outline bg-surface-container/98 px-margin-mobile py-3 lg:hidden`}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeMenu}
            className={`rounded-md px-3 py-3 text-sm font-semibold transition-colors ${location.pathname === item.path ? 'bg-primary-container text-white' : 'text-secondary hover:bg-surface-container hover:text-on-surface'}`}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default TopNavBar;
