import { useEffect, useRef } from 'react';

export const useHorizontalScroll = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const onWheel = (e) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY,
          behavior: 'auto'
        });
      };
      el.addEventListener('wheel', onWheel);
      return () => el.removeEventListener('wheel', onWheel);
    }
  }, []);

  return scrollRef;
};
