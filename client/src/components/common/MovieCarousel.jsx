import { useHorizontalScroll } from '../../hooks/useHorizontalScroll';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

export const MovieCarousel = ({ title, children }) => {
  const scrollRef = useHorizontalScroll();

  return (
    <section className="mb-12">
      <h2 className="px-margin-mobile md:px-margin-desktop font-headline-md text-headline-lg-mobile md:text-headline-md mb-4 text-on-surface">
        {title}
      </h2>
      <div className="relative group">
        <div 
          ref={scrollRef}
          className="scroll-container flex gap-unit overflow-x-auto px-margin-mobile md:px-margin-desktop pb-8 pt-4"
        >
          {children}
        </div>
        <button 
          type="button"
          aria-label={`Cuộn ${title} sang trái`}
          onClick={() => {
            if (scrollRef.current) scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
          }}
          className="hidden md:flex absolute top-0 bottom-8 left-0 w-16 bg-gradient-to-r from-[#0F0F0F] to-transparent items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          <RiArrowLeftSLine className="h-10 w-10 text-white drop-shadow-md transition-transform hover:scale-110" aria-hidden="true" />
        </button>
        <button 
          type="button"
          aria-label={`Cuộn ${title} sang phải`}
          onClick={() => {
            if (scrollRef.current) scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
          }}
          className="hidden md:flex absolute top-0 bottom-8 right-0 w-16 bg-gradient-to-l from-[#0F0F0F] to-transparent items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          <RiArrowRightSLine className="h-10 w-10 text-white drop-shadow-md transition-transform hover:scale-110" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};
