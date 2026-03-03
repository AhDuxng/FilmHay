import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

function PageTransition() {
    const location = useLocation();
    const [isAnimating, setIsAnimating] = useState(false);
    const [phase, setPhase] = useState('idle');
    const prevPath = useRef(location.pathname);
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (prevPath.current === location.pathname) return;
        prevPath.current = location.pathname;

        // hieu ung chuyen trang
        setIsAnimating(true);
        setPhase('enter');

        window.scrollTo({ top: 0, behavior: 'instant' });

        timeoutRef.current = setTimeout(() => {
            setPhase('exit');
        }, 600);

        const exitTimeout = setTimeout(() => {
            setIsAnimating(false);
            setPhase('idle');
        }, 1000);

        return () => {
            clearTimeout(timeoutRef.current);
            clearTimeout(exitTimeout);
        };
    }, [location.pathname]);

    if (!isAnimating) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none
                ${phase === 'enter' ? 'animate-[transitionEnter_0.6s_ease-out_forwards]' : ''}
                ${phase === 'exit' ? 'animate-[transitionExit_0.4s_ease-in_forwards]' : ''}
            `}
        >
            {/* Nen toi mo */}
            <div className={`absolute inset-0 bg-dark/90 backdrop-blur-sm transition-opacity duration-300
                ${phase === 'exit' ? 'opacity-0' : 'opacity-100'}
            `} />

            {/* Logo + hieu ung tron phat sang */}
            <div className={`relative z-10 flex flex-col items-center gap-4
                ${phase === 'enter' ? 'animate-[logoEnter_0.5s_cubic-bezier(0.34,1.56,0.64,1)_forwards]' : ''}
                ${phase === 'exit' ? 'animate-[logoExit_0.35s_ease-in_forwards]' : ''}
            `}>
                {/* Vong tron phat sang phia sau */}
                <div className="absolute w-32 h-32 rounded-full bg-primary/20 animate-ping" />
                <div className="absolute w-24 h-24 rounded-full bg-primary/30 animate-pulse" />

                {/* Logo text */}
                <span className="text-5xl font-black bg-gradient-to-br from-primary to-cyan bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(30,144,255,0.6)] select-none">
                    PhimHay
                </span>

                {/* Thanh loading nho ben duoi */}
                <div className="w-16 h-0.5 rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-cyan rounded-full animate-[loadBar_0.6s_ease-out_forwards]" />
                </div>
            </div>
        </div>
    );
}

export default PageTransition;
