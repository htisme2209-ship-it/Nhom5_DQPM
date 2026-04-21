/**
 * Simulation Train Card Component
 * Displays individual train status with animation
 */
export default function SimulationTrainCard({ train }) {
    const statusConfig = {
        WAITING: {
            label: 'Chờ đến',
            color: 'var(--gray-600)',
            bg: 'var(--gray-100)',
            icon: '⏳'
        },
        APPROACHING: {
            label: 'Đang đến',
            color: 'var(--blue-600)',
            bg: 'var(--blue-50)',
            icon: '🚄'
        },
        ARRIVED: {
            label: 'Tại ga',
            color: 'var(--green-600)',
            bg: 'var(--green-50)',
            icon: '🏢'
        },
        DEPARTING: {
            label: 'Chuẩn bị đi',
            color: 'var(--orange-600)',
            bg: 'var(--orange-50)',
            icon: '🚦'
        },
        DEPARTED: {
            label: 'Đã rời',
            color: 'var(--purple-600)',
            bg: 'var(--purple-50)',
            icon: '✅'
        }
    };

    const config = statusConfig[train.status] || statusConfig.WAITING;

    return (
        <div style={{
            padding: '16px',
            background: 'var(--white)',
            borderRadius: 'var(--radius-md)',
            border: `2px solid ${config.color}30`,
            transition: 'all 0.3s',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Progress Bar */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '4px',
                width: `${train.position}%`,
                background: `linear-gradient(90deg, ${config.color}, ${config.color}80)`,
                transition: 'width 1s ease-out'
            }} />

            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ fontSize: '24px' }}>{config.icon}</span>
                    <div>
                        <div style={{
                            fontSize: '16px',
                            fontWeight: 700,
                            color: 'var(--navy-800)'
                        }}>
                            {train.maChuyenTau}
                        </div>
                        <div style={{
                            fontSize: '11px',
                            color: 'var(--gray-500)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            Ray {train.maRay}
                        </div>
                    </div>
                </div>

                <div style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    background: config.bg,
                    border: `1px solid ${config.color}`,
                    fontSize: '11px',
                    fontWeight: 700,
                    color: config.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    {config.label}
                </div>
            </div>

            {/* Time Info */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '8px'
            }}>
                <div>
                    <div style={{
                        fontSize: '10px',
                        color: 'var(--gray-500)',
                        marginBottom: '2px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Giờ đến
                    </div>
                    <div style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--navy-800)'
                    }}>
                        {train.gioDenDuKien.toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                </div>

                <div>
                    <div style={{
                        fontSize: '10px',
                        color: 'var(--gray-500)',
                        marginBottom: '2px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Giờ đi
                    </div>
                    <div style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--navy-800)'
                    }}>
                        {train.gioDiDuKien.toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                </div>
            </div>

            {/* Delay Warning */}
            {train.soPhutTre > 0 && (
                <div style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    background: 'var(--orange-50)',
                    border: '1px solid var(--orange-300)',
                    borderRadius: 'var(--radius)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span style={{ fontSize: '16px' }}>⚠️</span>
                    <span style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--orange-700)'
                    }}>
                        Trễ {train.soPhutTre} phút
                    </span>
                </div>
            )}

            {/* Actual Times (if available) */}
            {(train.gioDenThucTe || train.gioDiThucTe) && (
                <div style={{
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--gray-200)',
                    fontSize: '11px',
                    color: 'var(--gray-600)'
                }}>
                    {train.gioDenThucTe && (
                        <div>
                            ✓ Đến thực tế: {train.gioDenThucTe.toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    )}
                    {train.gioDiThucTe && (
                        <div>
                            ✓ Đi thực tế: {train.gioDiThucTe.toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
