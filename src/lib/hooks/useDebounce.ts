import React from 'react';

export default function useDebounceValue<T>(value: T, delay: number) {
    const [debouncedValue, setDebouncedValue] = React.useState(value);
    
    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}