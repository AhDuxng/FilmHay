import { memo } from 'react';

/**
 * @param {number} page - trang hien tai
 * @param {number} totalPages - tong so trang
 * @param {function} onPageChange - callback khi doi trang
 * @param {boolean} showPageNumbers - co hien thi so trang khong (mac dinh false)
 */
const Pagination = memo(function Pagination({ page, totalPages, onPageChange, showPageNumbers = false }) {
    if (!totalPages || totalPages <= 1) return null;

    return (
        <div className="flex justify-center gap-2 mt-10">
            {/* Nut trang truoc */}
            <button
                disabled={page <= 1}
                onClick={() => onPageChange(Math.max(1, page - 1))}
                className="px-4 py-2 bg-white/[0.08] text-neutral-300 text-sm rounded transition-all hover:bg-primary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
                ← Trước
            </button>

            {/* So trang (tuy chon) */}
            {showPageNumbers ? (
                Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const startPage = Math.max(1, page - 2);
                    const pageNum = startPage + i;
                    if (pageNum > totalPages) return null;
                    return (
                        <button
                            key={pageNum}
                            className={`px-4 py-2 text-sm rounded transition-all ${
                                page === pageNum
                                    ? 'bg-primary text-white'
                                    : 'bg-white/[0.08] text-neutral-300 hover:bg-primary hover:text-white'
                            }`}
                            onClick={() => onPageChange(pageNum)}
                        >
                            {pageNum}
                        </button>
                    );
                })
            ) : (
                <span className="px-4 py-2 text-neutral-300">
                    Trang {page} / {totalPages}
                </span>
            )}

            {/* Nut trang sau */}
            <button
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="px-4 py-2 bg-white/[0.08] text-neutral-300 text-sm rounded transition-all hover:bg-primary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
                Sau →
            </button>
        </div>
    );
});

export default Pagination;
