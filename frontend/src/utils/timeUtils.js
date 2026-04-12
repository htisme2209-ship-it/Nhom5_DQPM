// ============================================================
// Time Utility Functions
// ============================================================

export const BUFFER_MINUTES = 15;
export const TIMELINE_START = 0;   // 00:00
export const TIMELINE_END = 24;    // 24:00
export const TIMELINE_SPAN = TIMELINE_END - TIMELINE_START;
export const HOUR_WIDTH = 120;
export const TOTAL_WIDTH = TIMELINE_SPAN * HOUR_WIDTH; // 2880px

/**
 * Convert "HH:mm" string to total minutes since midnight
 */
export const timeToMin = (t) => {
    if (!t) return null;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
};

/**
 * Convert total minutes to "HH:mm" string
 */
export const minToTime = (m) => {
    if (m == null) return '';
    const hh = Math.floor(m / 60) % 24;
    const mm = m % 60;
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
};

/**
 * Parse time from LocalTime string: "HH:mm:ss" or "HH:mm"
 */
export const parseLocalTime = (t) => {
    if (!t) return '';
    if (typeof t === 'string') return t.substring(0, 5);
    return '';
};

/**
 * Parse time from LocalDateTime string: "2026-01-01T10:30:00" → "10:30"
 */
export const parseDateTimeToTime = (dt) => {
    if (!dt) return '';
    if (typeof dt === 'string' && dt.includes('T')) return dt.substring(11, 16);
    return '';
};

/**
 * Convert "HH:mm" to pixel position
 */
export const getPxPos = (timeStr) => {
    const m = timeToMin(timeStr);
    if (m == null) return 0;
    return (m / 60) * HOUR_WIDTH;
};

/**
 * Calculate pixel width between two times
 */
export const getPxWidth = (startStr, endStr) => {
    const s = timeToMin(startStr);
    const e = timeToMin(endStr);
    if (s == null || e == null) return 0;
    return ((e - s) / 60) * HOUR_WIDTH;
};

/**
 * Format datetime for display
 */
export const formatTime = (dt) => {
    if (!dt) return '---';
    try {
        const d = new Date(dt);
        return d.getHours().toString().padStart(2, '0') + ':' +
            d.getMinutes().toString().padStart(2, '0');
    } catch {
        return '---';
    }
};

/**
 * Build datetime string from date and time
 */
export const buildDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;
    return `${dateStr}T${timeStr}:00`;
};

/**
 * Generate timeline hour slots
 */
export const generateTimeSlots = () => {
    const slots = [];
    for (let h = TIMELINE_START; h <= TIMELINE_END; h++) {
        slots.push(h < 24 ? `${String(h).padStart(2, '0')}:00` : '00:00');
    }
    return slots;
};
