import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  RiArrowDownSLine,
  RiCloseLine,
  RiMenu3Line,
  RiMovie2Line,
  RiSearch2Line,
} from 'react-icons/ri';
import { NAV_LINKS } from '../../utils/constants';
import SearchSuggestions from './SearchSuggestions';
import { useBrowseMetadata } from '../../hooks/useMovies';

function NavLinkItem({ to, label, active }) {
  return (
    <Link
      to={to}
      className={`relative py-2 text-sm font-medium transition ${
        active ? 'text-white' : 'text-neutral-300 hover:text-white'
      }`}
    >
      {label}
      {active ? <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-primary" /> : null}
    </Link>
  );
}

function ExplorePanel({ open, onClose }) {
  const { data, loading } = useBrowseMetadata();

  const topGenres = useMemo(() => data.genres.slice(0, 8), [data.genres]);
  const topCountries = useMemo(() => data.countries.slice(0, 8), [data.countries]);
  const topYears = useMemo(() => data.years.slice(0, 10), [data.years]);

  if (!open) {
    return null;
  }

  return (
    <div className="absolute right-0 top-full z-[1200] mt-3 w-[380px] rounded-2xl border border-white/15 bg-[#0b0d14] p-4 shadow-[0_20px_45px_rgba(0,0,0,0.5)]">
      {loading ? (
        <div className="grid gap-2">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-8 animate-pulse rounded-lg bg-white/10" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-neutral-400">Thể loại</p>
            <div className="flex flex-wrap gap-2">
              {topGenres.map((genre) => (
                <Link
                  key={genre.slug}
                  to={`/the-loai/${genre.slug}`}
                  onClick={onClose}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-neutral-200 transition hover:border-white/35 hover:bg-white/10"
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-neutral-400">Quốc gia</p>
            <div className="flex flex-wrap gap-2">
              {topCountries.map((country) => (
                <Link
                  key={country.slug}
                  to={`/quoc-gia/${country.slug}`}
                  onClick={onClose}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-neutral-200 transition hover:border-white/35 hover:bg-white/10"
                >
                  {country.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-neutral-400">Năm phát hành</p>
            <div className="flex flex-wrap gap-2">
              {topYears.map((yearItem) => (
                <Link
                  key={yearItem.year}
                  to={`/nam-phat-hanh/${yearItem.year}`}
                  onClick={onClose}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-neutral-200 transition hover:border-white/35 hover:bg-white/10"
                >
                  {yearItem.year}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchWrapperRef = useRef(null);
  const suggestKeyDownRef = useRef(null);
  const exploreRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setExploreOpen(false);
    setSearchFocused(false);
    setQuery('');
  }, [location.pathname]);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
        setSearchFocused(false);
      }

      if (exploreRef.current && !exploreRef.current.contains(event.target)) {
        setExploreOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleSearchKeyDown = useCallback(
    (event) => {
      suggestKeyDownRef.current?.(event);

      if (event.defaultPrevented) {
        return;
      }

      if (event.key === 'Enter' && query.trim()) {
        navigate(`/tim-kiem?keyword=${encodeURIComponent(query.trim())}`);
        setSearchFocused(false);
      }
    },
    [navigate, query]
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[1100] transition ${
        scrolled ? 'border-b border-white/10 bg-[#080a10]/95 backdrop-blur-xl' : 'bg-gradient-to-b from-black/85 to-transparent'
      }`}
    >
      <div className="mx-auto flex h-[72px] w-full max-w-[1500px] items-center gap-4 px-4 sm:px-6 md:px-8 lg:px-12">
        <Link to="/" className="inline-flex items-center gap-2 text-white">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-[0_8px_25px_rgba(255,143,163,0.45)]">
            <RiMovie2Line className="text-xl" />
          </span>
          <span className="text-xl font-black tracking-tight">Trạm Đơn Phương</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((item) => (
            <NavLinkItem key={item.path} to={item.path} label={item.label} active={location.pathname === item.path} />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <div ref={searchWrapperRef} className="relative hidden md:block">
            <div className="flex h-10 w-[260px] items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 text-white transition focus-within:border-white/35 focus-within:bg-white/12">
              <RiSearch2Line className="text-lg text-neutral-300" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Tìm phim, diễn viên..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-neutral-500"
              />
            </div>

            <SearchSuggestions
              query={query}
              isFocused={searchFocused}
              onSelect={() => {
                setSearchFocused(false);
                setQuery('');
              }}
              onKeyDown={(handler) => {
                suggestKeyDownRef.current = handler;
              }}
            />
          </div>

          <div ref={exploreRef} className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => setExploreOpen((prev) => !prev)}
              className="inline-flex h-10 items-center gap-1 rounded-full border border-white/15 bg-white/8 px-4 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/12"
            >
              Khám phá
              <RiArrowDownSLine className={`text-lg transition ${exploreOpen ? 'rotate-180' : ''}`} />
            </button>
            <ExplorePanel open={exploreOpen} onClose={() => setExploreOpen(false)} />
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white lg:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <RiCloseLine className="text-2xl" /> : <RiMenu3Line className="text-2xl" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/10 bg-[#090b11]/98 px-4 pb-5 pt-4 backdrop-blur-xl md:px-6">
          <div className="mb-3 flex h-10 items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 text-white md:hidden">
            <RiSearch2Line className="text-lg text-neutral-300" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => setSearchFocused(true)}
              placeholder="Tìm kiếm..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-neutral-500"
            />
          </div>

          <div className="grid gap-1.5">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-200 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Navbar;
