import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosterUrl, getThumbUrl } from '../../utils/constants';
import { handleImageError, scrollToTop } from '../../utils/helpers';
import PlayIcon from './PlayIcon';

const MovieCard = memo(function MovieCard({ movie, landscape = false }) {
    const navigate = useNavigate();

    // Lay thong tin tu movie object
    const name = movie?.name || movie?.title || 'Không có tên';
    const slug = movie?.slug || '';
    const posterUrl = movie?.poster_url || movie?.thumb_url || '';
    const thumbUrl = movie?.thumb_url || movie?.poster_url || '';
    const episodeCurrent = movie?.episode_current || '';
    const quality = movie?.quality || '';
    const categories = movie?.category || [];

    // Tao URL hinh anh
    const imgSrc = landscape ? getThumbUrl(thumbUrl) : getPosterUrl(posterUrl);

    // Xac dinh badge style
    const getBadge = () => {
        if (quality?.toLowerCase().includes('4k')) return { cls: 'bg-gradient-to-br from-primary to-primary-dark', text: '4K' };
        if (episodeCurrent?.toLowerCase().includes('full') || episodeCurrent?.toLowerCase().includes('hoàn thành')) {
            return { cls: 'bg-emerald-600', text: 'Full' };
        }
        if (movie?.type === 'single') return { cls: 'bg-primary', text: 'HD' };
        return { cls: 'bg-sky-400', text: quality || 'HD' };
    };

    const badge = getBadge();

    // Genre text
    const genreText = categories?.length > 0
        ? categories.map(c => c.name).slice(0, 2).join(', ')
        : '';

    // Sub text
    const subText = [episodeCurrent, genreText].filter(Boolean).join(' • ');

    const handleClick = useCallback(() => {
        if (slug) {
            scrollToTop();
            navigate(`/phim/${slug}`);
        }
    }, [slug, navigate]);

    return (
        <div
            className={`group relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300
                hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)] hover:z-[3]
                ${landscape
                    ? 'flex-[0_0_320px] max-md:flex-[0_0_260px]'
                    : 'flex-[0_0_195px] max-md:flex-[0_0_140px]'
                }`}
            onClick={handleClick}
        >
            {/* Poster */}
            <img
                className={`w-full object-cover rounded-lg bg-dark-light ${landscape ? 'aspect-video' : 'aspect-[2/3]'}`}
                src={imgSrc}
                alt={name}
                loading="lazy"
                onError={handleImageError}
            />

            {/* Badge (VIP, Free, HD, HOT) */}
            <span className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded-[3px] uppercase z-[2] text-white ${badge.cls}`}>
                {badge.text}
            </span>

            {/* Tap hien tai (an khi hover) */}
            {episodeCurrent && !landscape && (
                <div className="absolute bottom-0 inset-x-0 bg-black/70 text-center py-1 text-[11px] text-neutral-300 rounded-b-lg group-hover:hidden">
                    {episodeCurrent}
                </div>
            )}

            {/* Overlay khi hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/85 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5">
                {/* Nut play o giua */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                    <PlayIcon className="w-[22px] h-[22px] fill-white" />
                </div>
                <div className="text-[13px] font-semibold truncate mb-1">{name}</div>
                <div className="text-[11px] text-neutral-500">{subText}</div>
            </div>
        </div>
    );
});

export default MovieCard;
