import { memo } from 'react';

/**
 * @param {string} className 
 */
const PlayIcon = memo(function PlayIcon({ className = 'w-5 h-5 fill-current' }) {
    return (
        <svg className={className} viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
        </svg>
    );
});

export default PlayIcon;
