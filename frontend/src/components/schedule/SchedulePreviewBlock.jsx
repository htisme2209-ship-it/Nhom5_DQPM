import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { formatTime } from '../../utils/timeUtils';

/**
 * Schedule Preview Block Component with Hover Popover using Portal
 * Used for showing new schedule preview in Gantt chart
 * Now includes delay visualization
 */
export default function SchedulePreviewBlock({ preview, leftPx, widthPx }) {
    const [isHovered, setIsHovered] = useState(false);
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
    const blockRef = useRef(null);

    const delayMinutes = parseInt(preview.soPhutTre) || 0;

    // Calculate popover position when hovering
    useEffect(() => {
        if (isHovered && blockRef.current) {
            const rect = blockRef.current.getBoundingClientRect();
            setPopoverPosition({
                top: rect.top - 12,
                left: rect.left + rect.width / 2
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
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    position: 'absolute',
                    overflow: 'hidden',
                    left: `${leftPx}px`,
                    width: `${widthPx}px`,
                    top: '4px',
                    bottom: '4px',
                    zIndex: isHovered ? 99998 : 5
                }}
            >


                {/* Preview Block */}
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '4px',
                        background: delayMinutes > 0
                            ? 'linear-gradient(90deg, rgba(37, 99, 235, 0.25) 0%, rgba(37, 99, 235, 0.25) 70%, rgba(251, 146, 60, 0.35) 70%, rgba(251, 146, 60, 0.35) 100%)'
                            : 'rgba(37, 99, 235, 0.25)',
                        border: delayMinutes > 0
                            ? '2px solid rgba(251, 146, 60, 0.8)'
                            : '2px solid var(--navy-500)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: 'var(--navy-800)',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        padding: '0 8px',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {widthPx > 40 ? (preview.maChuyenTau || 'NEW') : '...'}
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
            </div >

            {/* Render Popover using Portal */}
            {
                isHovered && preview.maChuyenTau && createPortal(
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
                            border: '2px solid var(--navy-500)',
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
                                bottom: '-7px',
                                left: '50%',
                                transform: 'translateX(-50%) rotate(225deg)',
                                width: '12px',
                                height: '12px',
                                background: 'white',
                                border: '2px solid var(--navy-500)',
                                borderRight: 'none',
                                borderBottom: 'none'
                            }}
                        />

                        {/* Content */}
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            {/* Header */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '12px',
                                    paddingBottom: '12px',
                                    borderBottom: '2px solid var(--navy-200)'
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            fontSize: '10px',
                                            color: 'var(--navy-600)',
                                            fontWeight: 600,
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        LỊCH TRÌNH MỚI (PREVIEW)
                                    </div>
                                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy-800)' }}>
                                        {preview.maChuyenTau}
                                    </div>
                                </div>
                                <span
                                    style={{
                                        padding: '4px 10px',
                                        borderRadius: '12px',
                                        fontSize: '10px',
                                        fontWeight: 600,
                                        background: 'var(--navy-100)',
                                        color: 'var(--navy-700)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}
                                >
                                    CHƯA LƯU
                                </span>
                            </div>

                            {/* Details */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                                <div
                                    style={{
                                        background: 'var(--navy-50)',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        border: '1px solid var(--navy-200)'
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '4px'
                                        }}
                                    >
                                        <span style={{ color: 'var(--navy-600)' }}>⬇️ Giờ đến dự kiến:</span>
                                        <span style={{ fontWeight: 700, color: 'var(--navy-800)' }}>
                                            {preview.gioDenDuKien || '---'}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--navy-600)' }}>⬆️ Giờ đi dự kiến:</span>
                                        <span style={{ fontWeight: 700, color: 'var(--navy-800)' }}>
                                            {preview.gioDiDuKien || '---'}
                                        </span>
                                    </div>
                                </div>

                                {delayMinutes > 0 && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        background: 'rgba(251, 146, 60, 0.1)',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        border: '1px solid rgba(251, 146, 60, 0.3)'
                                    }}>
                                        <span>⚠️</span>
                                        <span style={{ color: '#C2410C', fontWeight: 600 }}>
                                            Trễ {delayMinutes} phút - Cửa sổ chiếm ray đã mở rộng
                                        </span>
                                    </div>
                                )}

                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        background: 'var(--navy-50)',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        border: '1px solid var(--navy-200)'
                                    }}
                                >
                                    <span style={{ fontSize: '14px' }}>ℹ️</span>
                                    <span style={{ color: 'var(--navy-700)', fontWeight: 500, fontSize: '11px' }}>
                                        Đây là preview lịch trình mới. Nhấn "Lưu lịch trình" để xác nhận.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }
        </>
    );
}
