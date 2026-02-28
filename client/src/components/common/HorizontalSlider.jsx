import { memo, useRef, useCallback } from 'react';

/**
 * Slider cuon ngang voi mui ten dieu huong
 * Dung o: MovieSection, TrendingSection, LiveTVSection
 * group/slider pattern hieu ung hover hien mui ten
 *
 * @param {number} scrollAmount - so pixel cuon moi lan click (mac dinh 600)
 * @param {ReactNode} children - noi dung ben trong slider
 */
const HorizontalSlider = memo(function HorizontalSlider({ children, scrollAmount = 600 }) {
    const rowRef = useRef(null);

    // Scroll slider trai/phai
    const scroll = useCallback((direction) => {
        if (!rowRef.current) return;
        const amount = direction === 'left' ? -scrollAmount : scrollAmount;
        rowRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }, [scrollAmount]);

    return (
        <div className="group/slider relative">
            <div className="flex gap-3 overflow-x-auto scroll-smooth pb-2.5 scrollbar-hide" ref={rowRef}>
                {children}
            </div>

            {/* Mui ten trai */}
            <div
                className="absolute top-0 bottom-2.5 left-[-10px] w-12 z-[5] flex items-center justify-center text-white text-2xl cursor-pointer opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(to right, rgba(13,13,13,0.9), transparent)' }}
                onClick={() => scroll('left')}
            >
                ❮
            </div>

            {/* Mui ten phai */}
            <div
                className="absolute top-0 bottom-2.5 right-[-10px] w-12 z-[5] flex items-center justify-center text-white text-2xl cursor-pointer opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(to left, rgba(13,13,13,0.9), transparent)' }}
                onClick={() => scroll('right')}
            >
                ❯
            </div>
        </div>
    );
});

export default HorizontalSlider;
