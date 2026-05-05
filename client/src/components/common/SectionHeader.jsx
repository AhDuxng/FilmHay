import { memo } from 'react';
import { Link } from 'react-router-dom';
import { RiArrowRightSLine } from 'react-icons/ri';

const SectionHeader = memo(function SectionHeader({ title, moreLink, moreLinkText = 'Xem tất cả' }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <h2 className="text-xl font-extrabold text-white md:text-2xl">{title}</h2>
      {moreLink ? (
        <Link
          to={moreLink}
          className="group inline-flex items-center gap-1 text-sm font-semibold text-neutral-300 transition hover:text-white"
        >
          {moreLinkText}
          <RiArrowRightSLine className="text-lg transition group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
});

export default SectionHeader;
