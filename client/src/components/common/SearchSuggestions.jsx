import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiArrowRightSLine, RiLoader4Line, RiSearch2Line } from 'react-icons/ri';
import { movieApi } from '../../services/api';
import { useDebounce } from '../../hooks/useDebounce';
import { SEARCH_MIN_CHARS } from '../../utils/constants';
import { getPosterUrl, handleImageError } from '../../utils/helpers';

const SearchSuggestions = memo(function SearchSuggestions({
  query,
  isFocused,
  onSelect,
  onKeyDown: exposeKeyDown,
}) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef(null);
  const requestRef = useRef(0);
  const debounced = useDebounce(query, 350);

  useEffect(() => {
    const keyword = debounced.trim();

    if (keyword.length < SEARCH_MIN_CHARS) {
      setItems([]);
      setActiveIndex(-1);
      setLoading(false);
      return;
    }

    const requestId = requestRef.current + 1;
    requestRef.current = requestId;

    const fetchData = async () => {
      setLoading(true);

      try {
        const payload = await movieApi.suggestMovies(keyword);
        if (requestRef.current !== requestId) {
          return;
        }
        setItems(payload?.data?.items || []);
        setActiveIndex(-1);
      } catch {
        if (requestRef.current !== requestId) {
          return;
        }
        setItems([]);
      } finally {
        if (requestRef.current === requestId) {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [debounced]);

  const handleSelect = useCallback(
    (slug) => {
      if (!slug) {
        return;
      }

      navigate(`/phim/${slug}`);
      setItems([]);
      setActiveIndex(-1);
      onSelect?.();
    },
    [navigate, onSelect]
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (!items.length) {
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
        return;
      }

      if (event.key === 'Enter' && activeIndex >= 0) {
        event.preventDefault();
        handleSelect(items[activeIndex]?.slug);
        return;
      }

      if (event.key === 'Escape') {
        setItems([]);
        setActiveIndex(-1);
      }
    },
    [activeIndex, handleSelect, items]
  );

  useEffect(() => {
    exposeKeyDown?.(handleKeyDown);
  }, [exposeKeyDown, handleKeyDown]);

  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) {
      return;
    }

    const node = listRef.current.children[activeIndex];
    node?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const trimmed = query.trim();
  const showDropdown = isFocused && trimmed.length >= SEARCH_MIN_CHARS && (loading || items.length > 0);

  if (!showDropdown) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 z-[1200] mt-3 overflow-hidden rounded-2xl border border-white/15 bg-[#0b0d14] shadow-[0_20px_40px_rgba(0,0,0,0.45)]">
      {loading && !items.length ? (
        <div className="flex items-center justify-center gap-2 px-4 py-5 text-sm text-neutral-300">
          <RiLoader4Line className="animate-spin text-base" />
          Đang tìm phim...
        </div>
      ) : null}

      <div ref={listRef} className="max-h-[420px] overflow-y-auto">
        {items.map((movie, index) => {
          const isActive = index === activeIndex;
          const imageUrl = getPosterUrl(movie);

          return (
            <button
              key={movie.slug}
              type="button"
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => handleSelect(movie.slug)}
              className={`flex w-full items-center gap-3 border-b border-white/6 px-3 py-2.5 text-left transition last:border-b-0 ${
                isActive ? 'bg-white/12' : 'hover:bg-white/8'
              }`}
            >
              <img
                src={imageUrl}
                alt={movie.name}
                onError={handleImageError}
                className="h-14 w-10 rounded-lg object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-semibold text-white">{movie.name}</p>
                <p className="line-clamp-1 text-xs text-neutral-400">{movie.origin_name || movie.name}</p>
              </div>

              <RiArrowRightSLine className="text-lg text-neutral-500" />
            </button>
          );
        })}
      </div>

      {items.length ? (
        <button
          type="button"
          onClick={() => {
            navigate(`/tim-kiem?keyword=${encodeURIComponent(trimmed)}`);
            onSelect?.();
            setItems([]);
            setActiveIndex(-1);
          }}
          className="flex w-full items-center justify-center gap-2 border-t border-white/10 px-4 py-3 text-sm font-medium text-primary transition hover:bg-white/6"
        >
          <RiSearch2Line className="text-base" />
          Xem toàn bộ kết quả
        </button>
      ) : null}
    </div>
  );
});

export default SearchSuggestions;
