import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { RiInformationLine, RiPlayFill } from 'react-icons/ri';
import { buildMetaText, getThumbUrl, getYearFromMovie, handleImageError } from '../../utils/helpers';

export const HeroSection = ({ movies = [], movie: fallbackMovie, cdnBase = '' }) => {
  const slides = useMemo(() => {
    if (movies.length) {
      return movies.filter((item) => item?.movie?.slug);
    }

    return fallbackMovie ? [{ movie: fallbackMovie, cdn: cdnBase }] : [];
  }, [cdnBase, fallbackMovie, movies]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex] || slides[0] || {};
  const movie = activeSlide.movie;
  const title = movie?.name || 'Kho phim VSMov';
  const originalTitle = movie?.origin_name || 'Phim mới cập nhật mỗi ngày';
  const meta = [
    movie?.quality,
    movie?.lang,
    getYearFromMovie(movie),
    movie?.episode_current,
  ].filter(Boolean);
  const categoryText = (movie?.category || []).slice(0, 3).map((item) => item.name).join(' / ');

  useEffect(() => {
    if (activeIndex >= slides.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, slides.length]);

  useEffect(() => {
    if (slides.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative flex min-h-[560px] h-[78svh] md:h-[85vh] md:min-h-[640px] w-full items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {slides.length ? (
          slides.map((slide, index) => (
            <img
              key={slide.movie.slug}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
              src={getThumbUrl(slide.movie, slide.cdn || cdnBase)}
              fetchpriority={index === 0 ? 'high' : 'auto'}
              decoding="async"
              onError={handleImageError}
            />
          ))
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#831843_0,#171717_45%,#0f0f0f_100%)]" />
        )}
        <div className="absolute inset-0 hero-gradient"></div>
      </div>
      <div className="relative z-10 mx-auto w-full max-w-container-max px-margin-mobile pt-24 md:px-margin-desktop md:pt-20">
        <div className="max-w-2xl">

          <h1 className="mb-5 line-clamp-3 max-w-3xl font-display-lg text-4xl font-bold leading-tight text-white drop-shadow-2xl sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <div className="mb-5 flex flex-wrap items-center gap-2 font-label-sm text-label-sm text-secondary sm:gap-3">
            {meta.map((item) => (
              <span key={item} className="rounded border border-secondary/30 bg-black/20 px-2 py-1">{item}</span>
            ))}
            {!meta.length ? <span>{originalTitle}</span> : null}
          </div>
          <p className="mb-7 max-w-xl font-body-lg text-base leading-7 text-inverse-surface drop-shadow-md sm:text-body-lg">
            {categoryText || buildMetaText(movie) || originalTitle}
          </p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link to={movie?.slug ? `/movie/${movie.slug}` : '/search'} className="flex min-h-12 items-center gap-2 rounded-lg bg-primary-container px-5 py-3 font-headline-md text-base font-bold text-white transition-colors hover:bg-primary-strong active:bg-[#be185d] sm:px-7">
              <RiPlayFill className="h-5 w-5 shrink-0" aria-hidden="true" />
              Xem ngay
            </Link>
            <Link to={movie?.slug ? `/movie/${movie.slug}` : '/search'} className="glass-panel flex min-h-12 items-center gap-2 rounded-lg px-5 py-3 font-headline-md text-base font-bold text-white transition-colors hover:bg-surface-container-highest sm:px-7">
              <RiInformationLine className="h-5 w-5 shrink-0" aria-hidden="true" />
              Chi tiết
            </Link>
          </div>
          {slides.length > 1 ? (
            <div className="scroll-container mt-6 flex max-w-full gap-2 overflow-x-auto pb-1" aria-label="Chọn phim nổi bật">
              {slides.map((slide, index) => (
                <button
                  key={slide.movie.slug}
                  type="button"
                  title={slide.movie.name}
                  aria-label={`Xem trước ${slide.movie.name}`}
                  aria-pressed={index === activeIndex}
                  onClick={() => setActiveIndex(index)}
                  className={`relative h-9 w-14 shrink-0 overflow-hidden rounded-md border-2 transition sm:h-12 sm:w-20 ${index === activeIndex ? 'border-primary-container' : 'border-white/30 opacity-70 hover:border-white/70 hover:opacity-100'}`}
                >
                  <img
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-cover"
                    src={getThumbUrl(slide.movie, slide.cdn || cdnBase)}
                    decoding="async"
                    onError={handleImageError}
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="absolute bottom-32 right-0 bg-surface-container-low/80 backdrop-blur-md border-l-4 border-secondary px-4 py-2 font-body-md text-body-md font-bold text-on-surface hidden md:block text-white">
        {movie?.quality || 'HD'}
      </div>
    </section>
  );
};
