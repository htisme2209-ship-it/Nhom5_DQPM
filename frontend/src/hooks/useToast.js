import { useState, useCallback } from 'react';

export default function useToast(duration = 3000) {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), duration);
    }, [duration]);

    const showSuccess = useCallback((message) => {
        showToast(message, 'success');
    }, [showToast]);

    const showError = useCallback((message) => {
        showToast(message, 'error');
    }, [showToast]);

    return {
        toast,
        showToast,
        showSuccess,
        showError
    };
}
