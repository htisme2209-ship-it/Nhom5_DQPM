/**
 * Simulation Statistics Component
 * Displays real-time statistics
 */
export default function SimulationStats({ stats, currentTime }) {
    const statCards = [
        {
            label: 'Tổng số tàu',
            value: stats.total,
            icon: '🚂',
            color: 'var(--navy-600)',
            bg: 'var(--navy-50)'
        },
        {
            label: 'Chờ đến',
            value: stats.waiting,
            icon: '⏳',
            color: 'var(--gray-600)',
            bg: 'var(--gray-100)'
        },
        {
            label: 'Đang đến',
            value: stats.approaching,
            icon: '🚄',
            color: 'var(--blue-600)',
            bg: 'var(--blue-50)'
        },
        {
            label: 'Tại ga',
            value: stats.arrived,
            icon: '🏢',
            color: 'var(--green-600)',
            bg: 'var(--green-50)'
        },
        {
            label: 'Đã rời',
            value: stats.departed,
            icon: '✅',
            color: 'var(--purple-600)',
            bg: 'var(--purple-50)'
        },
        {
            label: 'Bị trễ',
            value: stats.delayed,
            icon: '⚠️',
            color: 'var(--orange-600)',
            bg: 'var(--orange-50)'
        }
    ];

    return (
        <div>
            {/* Current Time Display */}
            {currentTime && (
                <div style={{
                    marginBottom: '16px',
                    padding: '16px 20px',
                    background: 'linear-gradient(135deg, var(--navy-600) 0%, var(--navy-700) 100%)',
                    borderRadius: 'var(--radius-md)',
                    color: 'white',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(59, 85, 149, 0.3)'
                }}>
                    <div style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        opacity: 0.8,
                        marginBottom: '4px'
                    }}>
                        Thời gian mô phỏng
                    </div>
                    <div style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        letterSpacing: '1px'
                    }}>
                        {currentTime.toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        })}
                    </div>
                    <div style={{
                        fontSize: '13px',
                        opacity: 0.9,
                        marginTop: '4px'
                    }}>
                        {currentTime.toLocaleDateString('vi-VN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px'
            }}>
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        style={{
                            padding: '16px',
                            background: stat.bg,
                            borderRadius: 'var(--radius-md)',
                            border: `1px solid ${stat.color}20`,
                            transition: 'transform 0.2s',
                            cursor: 'default'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '8px'
                        }}>
                            <span style={{ fontSize: '24px' }}>{stat.icon}</span>
                            <span style={{
                                fontSize: '32px',
                                fontWeight: 700,
                                color: stat.color,
                                lineHeight: 1
                            }}>
                                {stat.value}
                            </span>
                        </div>
                        <div style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: stat.color,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
