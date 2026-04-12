import { useState, useMemo } from 'react';
import { timeToMin, minToTime, parseLocalTime, BUFFER_MINUTES } from '../utils/timeUtils';

/**
 * Custom hook for schedule form logic
 * Handles auto-population based on train role
 */
export function useScheduleForm(chuyenTau) {
    const [selectedCT, setSelectedCT] = useState(null);
    const [form, setForm] = useState({
        maLichTrinh: '',
        maChuyenTau: '',
        maRay: '',
        ngayChay: '',
        gioDenDuKien: '',
        gioDiDuKien: '',
        gioDenThucTe: '',
        gioDiThucTe: '',
        soPhutTre: 0,
        trangThai: 'CHO_XAC_NHAN',
        phuongAnXuLy: ''
    });

    const handleSelectChuyenTau = (maChuyenTau) => {
        const ct = chuyenTau.find(c => c.maChuyenTau === maChuyenTau);
        setSelectedCT(ct || null);

        if (!ct) {
            setForm(f => ({ ...f, maChuyenTau, gioDenDuKien: '', gioDiDuKien: '' }));
            return;
        }

        const arrivalStr = parseLocalTime(ct.gioDenDuKien);
        const departStr = parseLocalTime(ct.gioDiDuKien);
        const role = ct.vaiTroTaiDaNang;

        let gioDenDuKien = '';
        let gioDiDuKien = '';

        if (role === 'TRUNG_GIAN') {
            gioDenDuKien = arrivalStr;
            gioDiDuKien = departStr;
        } else if (role === 'XUAT_PHAT') {
            gioDenDuKien = departStr ? minToTime(timeToMin(departStr) - 30) : '';
            gioDiDuKien = departStr;
        } else if (role === 'DIEM_CUOI') {
            gioDenDuKien = arrivalStr;
            gioDiDuKien = arrivalStr ? minToTime(timeToMin(arrivalStr) + BUFFER_MINUTES) : '';
        }

        setForm(f => ({ ...f, maChuyenTau, gioDenDuKien, gioDiDuKien }));
    };

    const bufferInfo = useMemo(() => {
        const den = timeToMin(form.gioDenDuKien);
        const di = timeToMin(form.gioDiDuKien);
        if (den == null || di == null) return null;
        const role = selectedCT?.vaiTroTaiDaNang;

        // Lấy số phút trễ từ form (mặc định là 0)
        const delayMinutes = parseInt(form.soPhutTre) || 0;

        let bufferStart, bufferEnd, total, label;
        if (role === 'XUAT_PHAT') {
            bufferStart = minToTime(den);
            // Thêm số phút trễ vào thời gian kết thúc chiếm ray
            bufferEnd = minToTime(di + BUFFER_MINUTES + delayMinutes);
            total = (di + BUFFER_MINUTES + delayMinutes) - den;
            label = delayMinutes > 0
                ? `Chiếm ray: Lên tàu (${minToTime(den)}) → Đi + đệm + trễ (${minToTime(di + BUFFER_MINUTES + delayMinutes)})`
                : `Chiếm ray: Lên tàu (${minToTime(den)}) → Đi + đệm (${minToTime(di + BUFFER_MINUTES)})`;
        } else if (role === 'DIEM_CUOI') {
            // Tàu điểm cuối: thời gian đến có thể bị trễ
            bufferStart = minToTime(den + delayMinutes);
            bufferEnd = minToTime(di + BUFFER_MINUTES + delayMinutes);
            total = (di + BUFFER_MINUTES + delayMinutes) - (den + delayMinutes);
            label = delayMinutes > 0
                ? `Chiếm ray: Đến ga + trễ (${minToTime(den + delayMinutes)}) → Rời ray + đệm (${minToTime(di + BUFFER_MINUTES + delayMinutes)})`
                : `Chiếm ray: Đến ga (${minToTime(den)}) → Rời ray + đệm (${minToTime(di + BUFFER_MINUTES)})`;
        } else {
            // Tàu trung gian: thời gian đến có thể bị trễ
            bufferStart = minToTime(den - BUFFER_MINUTES + delayMinutes);
            bufferEnd = minToTime(di + BUFFER_MINUTES + delayMinutes);
            total = (di + BUFFER_MINUTES + delayMinutes) - (den - BUFFER_MINUTES + delayMinutes);
            label = delayMinutes > 0
                ? `Chiếm ray: Đến − đệm + trễ (${minToTime(den - BUFFER_MINUTES + delayMinutes)}) → Đi + đệm + trễ (${minToTime(di + BUFFER_MINUTES + delayMinutes)})`
                : `Chiếm ray: Đến − đệm (${minToTime(den - BUFFER_MINUTES)}) → Đi + đệm (${minToTime(di + BUFFER_MINUTES)})`;
        }
        return { bufferStart, bufferEnd, total, label, delayMinutes };
    }, [form.gioDenDuKien, form.gioDiDuKien, form.soPhutTre, selectedCT]);

    const resetForm = () => {
        setForm({
            maLichTrinh: 'LT' + Date.now().toString().slice(-6),
            maChuyenTau: '',
            maRay: '',
            ngayChay: new Date().toISOString().split('T')[0],
            gioDenDuKien: '',
            gioDiDuKien: '',
            gioDenThucTe: '',
            gioDiThucTe: '',
            soPhutTre: 0,
            trangThai: 'CHO_XAC_NHAN',
            phuongAnXuLy: ''
        });
        setSelectedCT(null);
    };

    return {
        form,
        setForm,
        selectedCT,
        handleSelectChuyenTau,
        bufferInfo,
        resetForm
    };
}
