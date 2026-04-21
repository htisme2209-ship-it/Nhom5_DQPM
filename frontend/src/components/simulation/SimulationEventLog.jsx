/**
 * Simulation Event Log Component
 * Displays chronological event history
 */
export default function SimulationEventLog({ events }) {
    const severityConfig = {
        info: {
            icon: 'ℹ️',
            color: 'var(--blue-600)',
            bg: 'var(--blue-50)',
            border: 'var(--blue-200)'
        },
        success: {
            icon: '✅',
            color: 'var(--green-600)',
            bg: 'var(--green-50)',
            border: 'var(--green-200)'
        },
        warning: {
            icon: '⚠️',
            color: 'var(--orange-600)',
            bg: 'var(--orange-50)',
            border: 'var(--orange-200)'
        },
        error: {
            icon: '❌',
            color: 'var(--red-600)',
            bg: 'var(--red-50)',
            border: 'var(--red-200)'
        }
    };

    return (
        <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--gray-200)',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                padding: '16px 20px',
                background: 'var(--gray-50)',
                borderBottom: '1px solid var(--gray-200)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--navy-800)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    📋 Nhật ký sự kiện
                </div>
                <div style={{
                    fontSize: '12px',
                    color: 'var(--gray-600)',
                    fontWeight: 600
                }}>
                    {events.length} sự kiện
                </div>
            </div>

            {/* Event List */}
            <div style={{
                maxHeight: '400px',
                overflowY: 'auto',
                padding: '12px'
            }}>
                {events.length === 0 ? (
                    <div style={{
                        padding: '40px 20px',
                        textAlign: 'center',
                        color: 'var(--gray-500)',
                        fontSize: '13px'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.5 }}>
                            📭
                        </div>
                        Chưa có sự kiện nào
                    </div>
                ) : (
                    events.map((event, index) => {
                        const config = severityConfig[event.severity] || severityConfig.info;

                        return (
                            <div
                                key={index}
                                style={{
                                    padding: '12px 16px',
                                    marginBottom: '8px',
                                    background: config.bg,
                                    border: `1px solid ${config.border}`,
                                    borderRadius: 'var(--radius)',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    animation: index === 0 ? 'slideIn 0.3s ease-out' : 'none'
                                }}
                            >
                                <span style={{ fontSize: '18px', marginTop: '2px' }}>
                                    {config.icon}
                                </span>

                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: config.color,
                                        marginBottom: '4px'
                                    }}>
                                        {event.message}
                                    </div>

                                    <div style={{
                                        fontSize: '11px',
                                        color: 'var(--gray-600)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <span>
                                            🕐 {event.time.toLocaleTimeString('vi-VN', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit'
                                            })}
                                        </span>
                                        {event.trainId && (
                                            <>
                                                <span>•</span>
                                                <span>🚂 {event.trainId}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
