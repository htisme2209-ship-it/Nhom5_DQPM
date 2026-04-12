import { useState, useEffect } from 'react';
import { taiKhoanAPI } from '../services/api';

export default function useAccounts() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadAccounts = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await taiKhoanAPI.getAll();
            setAccounts(res.data.data || res.data || []);
        } catch (e) {
            console.error(e);
            setError(e.message || 'Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAccounts();
    }, []);

    return {
        accounts,
        loading,
        error,
        reload: loadAccounts
    };
}
