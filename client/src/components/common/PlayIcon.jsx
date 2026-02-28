import { memo } from 'react';

/**
 * Icon play (tam giac) SVG dung chung
 * Dung o: MovieCard, HeroCarousel, MovieDetailPage, Loading
 *
 * @param {string} className - class CSS tuy chinh (kich thuoc, mau sac...)
 */
const PlayIcon = memo(function PlayIcon({ className = 'w-5 h-5 fill-current' }) {
    return (
        <svg className={className} viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
        </svg>
    );
});

export default PlayIcon;
