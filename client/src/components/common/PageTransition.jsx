import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

function PageTransition() {
  const { pathname } = useLocation();
  const previousPathRef = useRef(pathname);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (previousPathRef.current === pathname) {
      return;
    }

    previousPathRef.current = pathname;
    setActive(true);
    const timeout = setTimeout(() => setActive(false), 420);
    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!active) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[1090]">
      <div className="h-full w-full animate-[fadePulse_0.42s_ease-out] bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
    </div>
  );
}

export default PageTransition;
