import { useState, useEffect } from 'react';
import { duongRayAPI, gaAPI, tuyenDuongAPI, tauAPI, chuyenTauAPI } from '../services/api';

export default function useInfrastructure() {
    const [data, setData] = useState({
        duongRay: [],
        tau: [],
        tuyenDuong: [],
        chuyenTau: [],
        gaList: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [rayRes, tauRes, tuyenRes, chuyenRes, gaRes] = await Promise.all([
                duongRayAPI.getAll(),
                tauAPI.getAll(),
                tuyenDuongAPI.getAll(),
                chuyenTauAPI.getAll(),
                gaAPI.getAll()
            ]);

            setData({
                duongRay: rayRes.data.data || rayRes.data || [],
                tau: tauRes.data.data || tauRes.data || [],
                tuyenDuong: tuyenRes.data.data || tuyenRes.data || [],
                chuyenTau: chuyenRes.data.data || chuyenRes.data || [],
                gaList: gaRes.data.data || gaRes.data || []
            });
        } catch (e) {
            console.error(e);
            setError(e.message || 'Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return {
        ...data,
        loading,
        error,
        reload: loadData
    };
}
