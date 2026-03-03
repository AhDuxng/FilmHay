import { memo } from 'react';
import { Link } from 'react-router-dom';

const SectionHeader = memo(function SectionHeader({ title, moreLink, moreLinkText = 'Xem thêm →' }) {
    return (
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-[22px] max-md:text-lg font-bold text-white pl-3.5 relative">
                <span className="absolute left-0 top-0.5 bottom-0.5 w-1 bg-primary rounded-sm" />
                {title}
            </h2>
            {moreLink && (
                <Link
                    to={moreLink}
                    className="text-[13px] text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
                >
                    {moreLinkText}
                </Link>
            )}
        </div>
    );
});

export default SectionHeader;
