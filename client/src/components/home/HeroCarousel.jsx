import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { RiArrowLeftSLine, RiArrowRightSLine, RiPlayFill } from 'react-icons/ri';
import { getThumbUrl } from '../../utils/helpers';

function HeroCarousel({ movies = [], cdnBase = '' }) {
  const slides = useMemo(() => movies.slice(0, 6), [movies]);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const stopAuto = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startAuto = useCallback(() => {
    if (slides.length <= 1) {
      return;
    }

    stopAuto();
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5200);
  }, [slides.length, stopAuto]);

  useEffect(() => {
    startAuto();
    return stopAuto;
  }, [startAuto, stopAuto]);

  useEffect(() => {
    if (index >= slides.length) {
      setIndex(0);
    }
  }, [index, slides.length]);

  if (!slides.length) {
    return (
      <section className="relative h-[68vh] min-h-[440px] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,#8d0b11_0,#0c1018_45%,#080a10_100%)]" />
      </section>
    );
  }

  return (
    <section
      className="group relative h-[68vh] min-h-[440px] overflow-hidden md:h-[76vh]"
      onMouseEnter={stopAuto}
      onMouseLeave={startAuto}
    >
      <div
        className="flex h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((movie) => {
          const imageUrl = getThumbUrl(movie, cdnBase);

          return (
            <div key={movie.slug} className="relative min-w-full">
              <img src={imageUrl} alt={movie.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/45 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080a10] via-transparent to-transparent" />

              <div className="absolute bottom-10 left-6 right-6 z-10 max-w-2xl md:bottom-16 md:left-12">
                <p className="mb-3 inline-flex rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                  Featured
                </p>
                <h1 className="text-3xl font-black leading-tight text-white md:text-5xl">{movie.name}</h1>
                <p className="mt-3 line-clamp-2 text-sm text-neutral-300 md:text-base">
                  {movie.origin_name || movie.name}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link
                    to={`/phim/${movie.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong"
                  >
                    <RiPlayFill className="text-lg" />
                    Xem ngay
                  </Link>
                  <Link
                    to={`/phim/${movie.slug}`}
                    className="rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    Chi tiết
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => setIndex((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 md:flex"
            aria-label="Previous slide"
          >
            <RiArrowLeftSLine className="text-2xl" />
          </button>

          <button
            type="button"
            onClick={() => setIndex((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 md:flex"
            aria-label="Next slide"
          >
            <RiArrowRightSLine className="text-2xl" />
          </button>

          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
            {slides.map((slide) => (
              <button
                key={slide.slug}
                type="button"
                onClick={() => setIndex(slides.findIndex((item) => item.slug === slide.slug))}
                className={`h-2.5 rounded-full transition ${
                  slides[index]?.slug === slide.slug ? 'w-8 bg-primary' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${slide.name}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}

export default HeroCarousel;
