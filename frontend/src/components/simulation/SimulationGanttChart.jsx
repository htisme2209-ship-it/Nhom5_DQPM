import { useRef, useCallback, useEffect } from 'react';
import { HOUR_WIDTH, TOTAL_WIDTH, generateTimeSlots, getPxPos } from '../../utils/timeUtils';

// Hằng số phù hợp với scheduleOptimizer
const BOARDING_MINUTES = 30;
const BUFFER_MINUTES   = 15;
const ARRIVAL_BUFFER   = 1;

/**
 * Tính vị trí và độ rộng pixel của block Gantt theo đúng loại tàu
 * - XUAT_PHAT: block từ (giờ đi − 30 phút) đến (giờ đi + 15 phút)
 * - DIEM_CUOI: block từ (giờ đến − 1 phút) đến (giờ đến + 30 phút)
 * - TRUNG_GIAN: block từ (giờ đến − 1 phút) đến (giờ đi + 15 phút)
 */
function getBlockLayout(schedule) {
    const toMin = (t) => {
        if (!t) return null;
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    };
    const toPx = (mins) => (mins / 60) * HOUR_WIDTH;

    const role = schedule.vaiTroTaiDaNang;

    if (role === 'XUAT_PHAT') {
        const dep = toMin(schedule.gioDiDuKien);
        if (dep == null) return null;
        const startMins = dep - BOARDING_MINUTES;
        const endMins   = dep + BUFFER_MINUTES;
        return { leftPx: toPx(startMins), widthPx: Math.max(60, toPx(endMins - startMins)) };
    }

    if (role === 'DIEM_CUOI') {
        const arr = toMin(schedule.gioDenDuKien);
        if (arr == null) return null;
        const startMins = arr - ARRIVAL_BUFFER;
        const endMins   = arr + BUFFER_MINUTES + BUFFER_MINUTES; // đến + rời ray + đệm
        return { leftPx: toPx(startMins), widthPx: Math.max(60, toPx(endMins - startMins)) };
    }

    // TRUNG_GIAN (mặc định)
    const arr = toMin(schedule.gioDenDuKien);
    const dep = toMin(schedule.gioDiDuKien);
    if (arr == null || dep == null) return null;
    const startMins = arr - ARRIVAL_BUFFER;
    const endMins   = dep + BUFFER_MINUTES;
    return { leftPx: toPx(startMins), widthPx: Math.max(60, toPx(endMins - startMins)) };
}

/**
 * Simulation Gantt Chart Component
 * Full-featured Gantt chart with drag & drop, conflict visualization
 */
export default function SimulationGanttChart({
    schedules,
    tracks,
    timeRange,
    conflicts,
    onScheduleDrag
}) {
    const ganttScrollRef = useRef(null);
    const isDragging = useRef(false);
    const dragStartX = useRef(0);
    const scrollStartX = useRef(0);
    const timeSlots = generateTimeSlots();

    // Drag to scroll functionality
    const onGanttMouseDown = useCallback((e) => {
        if (e.button !== 0) return;
        const el = ganttScrollRef.current;
        if (!el) return;
        isDragging.current = true;
        dragStartX.current = e.clientX;
        scrollStartX.current = el.scrollLeft;
        el.style.cursor = 'grabbing';
        el.style.userSelect = 'none';
    }, []);

    const onGanttMouseMove = useCallback((e) => {
        if (!isDragging.current) return;
        const el = ganttScrollRef.current;
        if (!el) return;
        const dx = e.clientX - dragStartX.current;
        el.scrollLeft = scrollStartX.current - dx;
    }, []);

    const onGanttMouseUp = useCallback(() => {
        isDragging.current = false;
        const el = ganttScrollRef.current;
        if (el) {
            el.style.cursor = 'grab';
            el.style.userSelect = '';
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousemove', onGanttMouseMove);
        document.addEventListener('mouseup', onGanttMouseUp);
        return () => {
            document.removeEventListener('mousemove', onGanttMouseMove);
            document.removeEventListener('mouseup', onGanttMouseUp);
        };
    }, [onGanttMouseMove, onGanttMouseUp]);

    // Check if schedule has conflict
    const hasConflict = (scheduleId) => {
        return conflicts.some(c =>
            c.trains.includes(schedules.find(s => s.id === scheduleId)?.maChuyenTau)
        );
    };

    // Handle drop on track
    const handleDrop = (e, trackId) => {
        e.preventDefault();
        const scheduleId = e.dataTransfer.getData('scheduleId');
        if (scheduleId) {
            onScheduleDrag(scheduleId, trackId);
        }
    };

    return (
        <div style={{
            background: 'white',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0
        }}>
            {/* Chart Header */}
            <div style={{
                padding: '16px 24px',
                borderBottom: '2px solid var(--gray-200)',
                background: 'var(--gray-50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0
            }}>
                <h3 style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'var(--navy-800)'
                }}>
                    📊 Biểu Đồ Gantt Lịch Trình
                </h3>

                {/* Legend */}
                <div style={{ display: 'flex', gap: '12px', fontSize: '11px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '14px', height: '14px', background: 'var(--navy-600)', borderRadius: '3px' }} />
                        <span>Xuất phát (ĐN→B)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '14px', height: '14px', background: 'var(--green-500)', borderRadius: '3px' }} />
                        <span>Trung gian (A→ĐN→B)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '14px', height: '14px', background: 'var(--green-700)', borderRadius: '3px' }} />
                        <span>Điểm cuối (A→ĐN)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '14px', height: '14px', background: 'var(--orange-500)', borderRadius: '3px' }} />
                        <span>Đã điều chỉnh</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '14px', height: '14px', background: 'var(--red-600)', borderRadius: '3px' }} />
                        <span>Xung đột</span>
                    </div>
                </div>
            </div>

            {/* Chart Body */}
            <div style={{
                display: 'flex',
                flex: 1,
                overflow: 'hidden',
                position: 'relative'
            }}>
                {/* LEFT: Fixed track labels */}
                <div style={{
                    width: '120px',
                    minWidth: '120px',
                    flexShrink: 0,
                    zIndex: 4,
                    background: 'var(--gray-50)',
                    borderRight: '2px solid var(--gray-200)'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '8px',
                        fontSize: '10px',
                        fontWeight: 600,
                        color: 'var(--gray-500)',
                        textTransform: 'uppercase',
                        background: 'var(--gray-50)',
                        borderBottom: '2px solid var(--gray-200)',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        ĐƯỜNG RAY
                    </div>

                    {/* Track Labels */}
                    {tracks.map(track => (
                        <div
                            key={track.maRay}
                            style={{
                                height: '60px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottom: '1px solid var(--gray-200)',
                                padding: '8px',
                                background: 'var(--gray-50)'
                            }}
                        >
                            <div style={{
                                fontSize: '16px',
                                fontWeight: 700,
                                color: 'var(--navy-800)'
                            }}>
                                {track.soRay || track.maRay}
                            </div>
                            <div style={{
                                fontSize: '10px',
                                color: 'var(--gray-500)',
                                marginTop: '4px'
                            }}>
                                {track.loaiRay}
                            </div>
                        </div>
                    ))}
                </div>

                {/* RIGHT: Scrollable timeline */}
                <div
                    ref={ganttScrollRef}
                    onMouseDown={onGanttMouseDown}
                    style={{
                        flex: 1,
                        overflowX: 'auto',
                        overflowY: 'auto',
                        cursor: 'grab'
                    }}
                >
                    <div style={{ minWidth: `${TOTAL_WIDTH}px`, position: 'relative' }}>
                        {/* Time header row */}
                        <div style={{
                            display: 'flex',
                            borderBottom: '2px solid var(--gray-200)',
                            height: '40px',
                            background: 'var(--gray-50)',
                            position: 'sticky',
                            top: 0,
                            zIndex: 3
                        }}>
                            {timeSlots.map((slot, i) => (
                                <div
                                    key={i}
                                    style={{
                                        flex: `0 0 ${HOUR_WIDTH}px`,
                                        textAlign: 'center',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        color: 'var(--gray-600)',
                                        padding: '12px 0',
                                        borderLeft: i > 0 ? '1px solid var(--gray-200)' : 'none',
                                        background: 'var(--gray-50)'
                                    }}
                                >
                                    {slot}
                                </div>
                            ))}
                        </div>

                        {/* Track timeline rows */}
                        {tracks.map(track => {
                            // Lọc: tàu phải thuộc ray này VÀ có ít nhất 1 trường thời gian hợp lệ
                            const trackSchedules = schedules.filter(s =>
                                s.maRay === track.maRay &&
                                (s.gioDenDuKien || s.gioDiDuKien)
                            );

                            return (
                                <div
                                    key={track.maRay}
                                    style={{
                                        height: '60px',
                                        position: 'relative',
                                        borderBottom: '1px solid var(--gray-200)',
                                        background: 'white'
                                    }}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => handleDrop(e, track.maRay)}
                                >
                                    {/* Grid lines */}
                                    {timeSlots.map((_, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                position: 'absolute',
                                                left: `${i * HOUR_WIDTH}px`,
                                                top: 0,
                                                bottom: 0,
                                                width: '1px',
                                                background: 'var(--gray-100)'
                                            }}
                                        />
                                    ))}

                                    {/* Schedule blocks */}
                                    {trackSchedules.map(schedule => {
                                        const layout = getBlockLayout(schedule);
                                        if (!layout) return null;

                                        const { leftPx, widthPx } = layout;
                                        const isConflict = hasConflict(schedule.id);
                                        const isModified = schedule.status === 'modified';
                                        const role = schedule.vaiTroTaiDaNang;

                                        // Label thời gian theo từng loại tàu
                                        let timeLabel;
                                        if (role === 'XUAT_PHAT') {
                                            timeLabel = `⬅️ ${schedule.gioDiDuKien}`;
                                        } else if (role === 'DIEM_CUOI') {
                                            timeLabel = `➡️ ${schedule.gioDenDuKien}`;
                                        } else {
                                            timeLabel = `${schedule.gioDenDuKien} → ${schedule.gioDiDuKien}`;
                                        }

                                        // Màu nền theo loại tàu (khi không có conflict/modified)
                                        let baseColor = 'var(--green-500)';
                                        if (role === 'XUAT_PHAT') baseColor = 'var(--navy-600)';
                                        if (role === 'DIEM_CUOI') baseColor = 'var(--green-700)';

                                        return (
                                            <div
                                                key={schedule.id}
                                                draggable
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData('scheduleId', schedule.id);
                                                    e.dataTransfer.effectAllowed = 'move';
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    left: `${leftPx}px`,
                                                    top: '8px',
                                                    width: `${widthPx}px`,
                                                    height: '44px',
                                                    background: isConflict ? 'var(--red-600)' : isModified ? 'var(--orange-500)' : baseColor,
                                                    borderRadius: 'var(--radius)',
                                                    padding: '4px 10px',
                                                    cursor: 'move',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    overflow: 'hidden',
                                                    zIndex: 2,
                                                    transition: 'transform 0.1s',
                                                    border: isConflict ? '2px solid var(--red-700)' : 'none'
                                                }}
                                                title={`${schedule.maChuyenTau} | ${role} | ${timeLabel}`}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                            >
                                                <div style={{
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {schedule.maChuyenTau}
                                                </div>
                                                <div style={{
                                                    fontSize: '9px',
                                                    opacity: 0.9,
                                                    marginTop: '1px',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {timeLabel}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
