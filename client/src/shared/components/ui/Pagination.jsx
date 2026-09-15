import { memo, useMemo } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

function buildPages(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    pages.push('dots-left');
  }

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < totalPages - 1) {
    pages.push('dots-right');
  }

  pages.push(totalPages);
  return pages;
}

const Pagination = memo(function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const pages = useMemo(() => buildPages(page, totalPages), [page, totalPages]);

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="inline-flex h-10 items-center justify-center rounded-full border border-outline bg-surface-container px-3 text-on-surface transition hover:border-outline-strong hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-40"
      >
        <RiArrowLeftSLine className="text-xl" />
      </button>

      {pages.map((item) => {
        if (typeof item !== 'number') {
          return (
            <span key={item} className="px-1.5 text-sm text-secondary">
              ...
            </span>
          );
        }

        return (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            className={`h-10 min-w-10 rounded-full border px-3 font-mono text-sm font-semibold transition ${item === page
                ? 'fill-ramp border-transparent'
                : 'border-outline bg-surface-container text-on-surface hover:border-outline-strong hover:bg-surface-container-high'
              }`}
          >
            {item}
          </button>
        );
      })}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="inline-flex h-10 items-center justify-center rounded-full border border-outline bg-surface-container px-3 text-on-surface transition hover:border-outline-strong hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-40"
      >
        <RiArrowRightSLine className="text-xl" />
      </button>
    </div>
  );
});

export default Pagination;
