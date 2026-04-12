import { useMemo } from 'react';
import { timeToMin, formatTime, BUFFER_MINUTES } from '../utils/timeUtils';

/**
 * Custom hook for detecting schedule conflicts
 */
export function useScheduleConflicts(lichTrinh) {
    const conflicts = useMemo(() => {
        const rayMap = {};
        lichTrinh.forEach(lt => {
            if (lt.maRay) {
                if (!rayMap[lt.maRay]) rayMap[lt.maRay] = [];
                rayMap[lt.maRay].push(lt);
            }
        });

        const res = [];
        Object.entries(rayMap).forEach(([ray, items]) => {
            for (let i = 0; i < items.length; i++) {
                for (let j = i + 1; j < items.length; j++) {
                    const a = items[i], b = items[j];
                    if (a.gioDenDuKien && b.gioDenDuKien && a.gioDiDuKien && b.gioDiDuKien) {
                        if (
                            new Date(a.gioDenDuKien) < new Date(b.gioDiDuKien) &&
                            new Date(b.gioDenDuKien) < new Date(a.gioDiDuKien)
                        ) {
                            res.push({ ray, a: a.maChuyenTau, b: b.maChuyenTau });
                        }
                    }
                }
            }
        });
        return res;
    }, [lichTrinh]);

    return conflicts;
}

/**
 * Check if form schedule conflicts with existing schedules
 * Now includes delay minutes in conflict detection
 */
export function useFormConflictWarning(form, lichTrinh, editItem) {
    return useMemo(() => {
        if (!form.maRay || !form.gioDenDuKien || !form.gioDiDuKien) return null;

        const delayMinutes = parseInt(form.soPhutTre) || 0;
        const newStart = timeToMin(form.gioDenDuKien);
        const newEnd = timeToMin(form.gioDiDuKien) + BUFFER_MINUTES + delayMinutes;

        const conflicting = lichTrinh.filter(lt => {
            if (lt.maRay !== form.maRay) return false;
            if (editItem && lt.maLichTrinh === editItem.maLichTrinh) return false;
            if (!lt.gioDenDuKien || !lt.gioDiDuKien) return false;

            const s = new Date(lt.gioDenDuKien);
            const e = new Date(lt.gioDiDuKien);
            const ltStart = s.getHours() * 60 + s.getMinutes();
            const ltEnd = e.getHours() * 60 + e.getMinutes();

            // Tính thêm số phút trễ của lịch trình hiện có (nếu có)
            const ltDelay = parseInt(lt.soPhutTre) || 0;
            const ltEndWithDelay = ltEnd + BUFFER_MINUTES + ltDelay;

            return newStart < ltEndWithDelay && ltStart < newEnd;
        });

        if (conflicting.length === 0) return null;

        return conflicting
            .map(lt => `${lt.maChuyenTau} (${formatTime(lt.gioDenDuKien)} - ${formatTime(lt.gioDiDuKien)}${lt.soPhutTre > 0 ? ` +${lt.soPhutTre}p trễ` : ''})`)
            .join(', ');
    }, [form.maRay, form.gioDenDuKien, form.gioDiDuKien, form.soPhutTre, lichTrinh, editItem]);
}
