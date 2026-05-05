import { memo, useCallback, useRef } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

const HorizontalSlider = memo(function HorizontalSlider({ children, scrollAmount = 620 }) {
  const rowRef = useRef(null);

  const scroll = useCallback(
    (direction) => {
      if (!rowRef.current) {
        return;
      }

      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    },
    [scrollAmount]
  );

  return (
    <div className="group relative">
      <div ref={rowRef} className="scrollbar-hide flex gap-3 overflow-x-auto pb-3 md:gap-4">
        {children}
      </div>

      <button
        type="button"
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 md:flex"
        aria-label="Scroll left"
      >
        <RiArrowLeftSLine className="text-2xl" />
      </button>

      <button
        type="button"
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 md:flex"
        aria-label="Scroll right"
      >
        <RiArrowRightSLine className="text-2xl" />
      </button>
    </div>
  );
});

export default HorizontalSlider;
