import { useEffect } from 'react';

// Suffix chung cho tat ca tieu de trang
const SITE_NAME = 'PhimHay';

/**
 * Hook cap nhat document.title khi vao trang
 * Tu dong reset ve ten site khi unmount
 * @param {string} title - tieu de trang (VD: 'Phim bo')
 */
export function usePageTitle(title) {
    useEffect(() => {
        document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
        return () => {
            document.title = SITE_NAME;
        };
    }, [title]);
}
