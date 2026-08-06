import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { RiCloseLine, RiMenuLine, RiMovie2Line, RiSearchLine } from 'react-icons/ri';
import { APP_NAME } from '../../utils/constants';

const navItems = [
  { label: 'Trang chủ', path: '/' },
  { label: 'Phim bộ', path: '/danh-sach/phim-bo' },
  { label: 'Phim lẻ', path: '/danh-sach/phim-le' },
  { label: 'Hoạt hình', path: '/danh-sach/hoat-hinh' },
  { label: 'Tìm kiếm', path: '/search' },
];

export const TopNavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#0f0f0f]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-container-max items-center justify-between gap-3 px-margin-mobile md:h-20 md:px-margin-desktop">
        <div className="flex min-w-0 items-center gap-8">
          <Link to="/" onClick={closeMenu} className="min-w-0 truncate font-display-lg text-[18px] font-bold text-primary-container sm:text-xl md:text-headline-md">
            <span className="hidden sm:inline">{APP_NAME}</span>
            <span className="sm:hidden">Trạm Phim</span>
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
          <Link to="/search" onClick={closeMenu} aria-label="Tìm kiếm phim" className="flex h-10 w-10 items-center justify-center rounded-full text-secondary transition-colors hover:bg-white/10 hover:text-on-surface">
            <RiSearchLine className="h-5 w-5" aria-hidden="true" />
          </Link>
          <div className="hidden h-9 w-9 items-center justify-center rounded-full border border-primary-container/40 bg-primary-container/20 text-primary-container sm:flex">
            <RiMovie2Line className="h-[18px] w-[18px]" aria-hidden="true" />
          </div>
          <button
            type="button"
            aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-secondary transition-colors hover:bg-white/10 hover:text-on-surface lg:hidden"
          >
            {menuOpen ? <RiCloseLine className="h-6 w-6" /> : <RiMenuLine className="h-6 w-6" />}
          </button>
        </div>
      </div>
      <div className={`${menuOpen ? 'grid' : 'hidden'} border-t border-white/10 bg-[#111]/98 px-margin-mobile py-3 lg:hidden`}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeMenu}
            className={`rounded-md px-3 py-3 text-sm font-semibold transition-colors ${location.pathname === item.path ? 'bg-primary-container text-white' : 'text-secondary hover:bg-white/5 hover:text-white'}`}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
