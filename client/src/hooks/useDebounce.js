import { useState, useEffect } from 'react';

/**
 * @param {any} value - gia tri can debounce (thuong la search query)
 * @param {number} delay - thoi gian cho (ms), mac dinh 400ms
 * @returns {any} gia tri da debounce
 */
export function useDebounce(value, delay = 400) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Dat timer, chi cap nhat sau khi user ngung go
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clear timer cu neu user tiep tuc go
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}
