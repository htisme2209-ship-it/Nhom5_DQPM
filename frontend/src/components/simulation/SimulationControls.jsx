/**
 * Simulation Controls Component
 * Play/Pause/Reset and speed controls
 */
export default function SimulationControls({
    isPlaying,
    speed,
    onPlay,
    onPause,
    onReset,
    onSpeedChange
}) {
    const speedOptions = [
        { value: 1, label: '1x', icon: '🐌' },
        { value: 2, label: '2x', icon: '🚶' },
        { value: 5, label: '5x', icon: '🏃' },
        { value: 10, label: '10x', icon: '🚀' }
    ];

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px 20px',
            background: 'var(--white)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--gray-200)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
            {/* Play/Pause Button */}
            <button
                className="btn btn-primary"
                onClick={isPlaying ? onPause : onPlay}
                style={{
                    minWidth: '120px',
                    height: '44px',
                    fontSize: '15px',
                    fontWeight: 700
                }}
            >
                {isPlaying ? (
                    <>⏸️ Tạm dừng</>
                ) : (
                    <>▶️ Chạy mô phỏng</>
                )}
            </button>

            {/* Reset Button */}
            <button
                className="btn btn-secondary"
                onClick={onReset}
                style={{
                    minWidth: '100px',
                    height: '44px'
                }}
            >
                🔄 Đặt lại
            </button>

            {/* Divider */}
            <div style={{
                width: '1px',
                height: '32px',
                background: 'var(--gray-300)'
            }} />

            {/* Speed Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--gray-600)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    Tốc độ:
                </span>
                {speedOptions.map(option => (
                    <button
                        key={option.value}
                        onClick={() => onSpeedChange(option.value)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: 'var(--radius)',
                            border: speed === option.value
                                ? '2px solid var(--navy-600)'
                                : '1px solid var(--gray-300)',
                            background: speed === option.value
                                ? 'var(--navy-50)'
                                : 'var(--white)',
                            color: speed === option.value
                                ? 'var(--navy-800)'
                                : 'var(--gray-700)',
                            fontWeight: speed === option.value ? 700 : 500,
                            fontSize: '13px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                    </button>
                ))}
            </div>

            {/* Status Indicator */}
            <div style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius)',
                background: isPlaying ? 'var(--green-50)' : 'var(--gray-100)',
                border: `1px solid ${isPlaying ? 'var(--green-300)' : 'var(--gray-300)'}`
            }}>
                <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isPlaying ? 'var(--green-500)' : 'var(--gray-400)',
                    animation: isPlaying ? 'pulse 2s infinite' : 'none'
                }} />
                <span style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: isPlaying ? 'var(--green-700)' : 'var(--gray-600)'
                }}>
                    {isPlaying ? 'ĐANG CHẠY' : 'TẠM DỪNG'}
                </span>
            </div>
        </div>
    );
}
