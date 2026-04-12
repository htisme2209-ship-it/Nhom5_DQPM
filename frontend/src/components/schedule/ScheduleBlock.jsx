import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { formatTime } from '../../utils/timeUtils';
import { STATUS_MAP } from '../../constants/scheduleConstants';

/**
 * Schedule Block Component with Hover Popover using Portal
 * Now shows delay visually
 */
export default function ScheduleBlock({ schedule, leftPx, widthPx }) {
    const [isHovered, setIsHovered] = useState(false);
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
    const blockRef = useRef(null);

    const tDen = formatTime(schedule.gioDenDuKien);
    const tDi = formatTime(schedule.gioDiDuKien);
    const st = STATUS_MAP[schedule.trangThai] || { label: schedule.trangThai, cls: 'badge-gray' };
    const delayMinutes = parseInt(schedule.soPhutTre) || 0;

    // Calculate popover position when hovering
    useEffect(() => {
        if (isHovered && blockRef.current) {
            const rect = blockRef.current.getBoundingClientRect();
            setPopoverPosition({
                top: rect.top - 12, // Position above the block
                left: rect.left + rect.width / 2 // Center horizontally
            });
        }
    }, [isHovered]);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <>
            <div
                ref={blockRef}
                className="schedule-block-wrapper"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    position: 'absolute',
                    left: `${leftPx}px`,
                    width: `${widthPx}px`,
                    top: '4px',
                    bottom: '4px',
                    zIndex: isHovered ? 99998 : 3
                }}
            >
                {/* Main Block */}
                <div
                    className="schedule-block"
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '6px',
                        background: delayMinutes > 0
                            ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.15) 70%, rgba(251, 146, 60, 0.25) 70%, rgba(251, 146, 60, 0.25) 100%)'
                            : 'rgba(239, 68, 68, 0.15)',
                        border: delayMinutes > 0
                            ? '1px solid rgba(251, 146, 60, 0.6)'
                            : '1px solid rgba(239, 68, 68, 0.4)',
                        fontSize: '10px',
                        padding: '0 8px',
                        color: '#991B1B',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}
                >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {widthPx > 40 ? schedule.maChuyenTau : '...'}
                    </span>
                    {delayMinutes > 0 && widthPx > 80 && (
                        <span style={{
                            fontSize: '9px',
                            background: 'rgba(251, 146, 60, 0.9)',
                            color: 'white',
                            padding: '1px 4px',
                            borderRadius: '3px',
                            marginLeft: '4px',
                            flexShrink: 0
                        }}>
                            +{delayMinutes}p
                        </span>
                    )}
                </div>
            </div>

            {/* Render Popover using Portal */}
            {isHovered && createPortal(
                <div
                    className="schedule-popover-portal"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        position: 'fixed',
                        top: `${popoverPosition.top}px`,
                        left: `${popoverPosition.left}px`,
                        transform: 'translate(-50%, -100%)',
                        minWidth: '280px',
                        maxWidth: '320px',
                        background: 'white',
                        border: '1px solid var(--gray-300)',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        padding: '16px',
                        zIndex: 99999,
                        pointerEvents: 'auto'
                    }}
                >
                    {/* Arrow */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '-6px',
                            left: '50%',
                            transform: 'translateX(-50%) rotate(225deg)',
                            width: '12px',
                            height: '12px',
                            background: 'white',
                            border: '1px solid var(--gray-300)',
                            borderRight: 'none',
                            borderBottom: 'none'
                        }}
                    />

                    {/* Content */}
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        {/* Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '12px',
                            paddingBottom: '12px',
                            borderBottom: '1px solid var(--gray-200)'
                        }}>
                            <div>
                                <div style={{
                                    fontSize: '10px',
                                    color: 'var(--gray-500)',
                                    fontWeight: 600,
                                    letterSpacing: '0.5px'
                                }}>
                                    CHUYẾN TÀU
                                </div>
                                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy-800)' }}>
                                    {schedule.maChuyenTau}
                                </div>
                            </div>
                            <span className={`badge ${st.cls}`} style={{ fontSize: '10px' }}>
                                {st.label}
                            </span>
                        </div>

                        {/* Details */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--gray-600)' }}>📍 Mã lịch trình:</span>
                                <span style={{ fontWeight: 600, color: 'var(--navy-700)' }}>
                                    {schedule.maLichTrinh}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--gray-600)' }}>🛤️ Đường ray:</span>
                                <span style={{ fontWeight: 600, color: 'var(--navy-700)' }}>
                                    {schedule.maRay || '---'}
                                </span>
                            </div>

                            <div style={{
                                background: 'var(--navy-50)',
                                padding: '8px',
                                borderRadius: '4px',
                                marginTop: '4px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '4px'
                                }}>
                                    <span style={{ color: 'var(--gray-600)' }}>⬇️ Giờ đến DK:</span>
                                    <span style={{ fontWeight: 700, color: 'var(--navy-700)' }}>{tDen}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--gray-600)' }}>⬆️ Giờ đi DK:</span>
                                    <span style={{ fontWeight: 700, color: 'var(--navy-700)' }}>{tDi}</span>
                                </div>
                            </div>

                            {schedule.soPhutTre > 0 && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: '#FEF2F2',
                                    padding: '6px 8px',
                                    borderRadius: '4px',
                                    marginTop: '4px'
                                }}>
                                    <span>⚠️</span>
                                    <span style={{ color: '#991B1B', fontWeight: 600 }}>
                                        Trễ {schedule.soPhutTre} phút
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}