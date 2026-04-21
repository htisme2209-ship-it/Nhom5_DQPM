/**
 * Simulation Changes Log
 * Hiển thị lịch sử thay đổi trong mô phỏng
 */
export default function SimulationChangesLog({ changes }) {
    const getTypeStyle = (type) => {
        switch (type) {
            case 'success': return { icon: '✅', color: 'var(--green-600)', bg: 'var(--green-50)' };
            case 'warning': return { icon: '⚠️', color: 'var(--orange-600)', bg: 'var(--orange-50)' };
            case 'error': return { icon: '❌', color: 'var(--red-600)', bg: 'var(--red-50)' };
            case 'info':
            default: return { icon: 'ℹ️', color: 'var(--blue-600)', bg: 'var(--blue-50)' };
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div style={{
            background: 'white',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>📝</span>
                    <h3 style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: 'var(--navy-800)',
                        margin: 0
                    }}>
                        Thay đổi đang chờ
                    </h3>
                </div>
                <div style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--gray-600)'
                }}>
                    {changes.length} thay đổi
                </div>
            </div>

            {/* Content */}
            <div style={{
                maxHeight: '400px',
                overflowY: 'auto',
                padding: '16px'
            }}>
                {changes.length === 0 ? (
                    <div style={{
                        padding: '40px 20px',
                        textAlign: 'center',
                        color: 'var(--gray-500)'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>
                            Chưa có thay đổi
                        </div>
                        <div style={{ fontSize: '12px', marginTop: '4px' }}>
                            Các thao tác sẽ được ghi lại tại đây
                        </div>
                    </div>
                ) : (
                    <div style={{ position: 'relative' }}>
                        {/* Timeline Line */}
                        <div style={{
                            position: 'absolute',
                            left: '19px',
                            top: '12px',
                            bottom: '12px',
                            width: '2px',
                            background: 'var(--gray-200)'
                        }} />

                        {/* Changes */}
                        {changes.map((change, index) => {
                            const style = getTypeStyle(change.type);

                            return (
                                <div
                                    key={index}
                                    style={{
                                        position: 'relative',
                                        paddingLeft: '48px',
                                        paddingBottom: '20px'
                                    }}
                                >
                                    {/* Icon */}
                                    <div style={{
                                        position: 'absolute',
                                        left: '0',
                                        top: '0',
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: style.bg,
                                        border: `2px solid ${style.color}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '16px',
                                        zIndex: 1
                                    }}>
                                        {style.icon}
                                    </div>

                                    {/* Content */}
                                    <div style={{
                                        padding: '12px',
                                        background: style.bg,
                                        borderRadius: 'var(--radius)',
                                        border: `1px solid ${style.color}30`
                                    }}>
                                        <div style={{
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            color: style.color,
                                            marginBottom: '4px'
                                        }}>
                                            {change.message}
                                        </div>
                                        <div style={{
                                            fontSize: '11px',
                                            color: 'var(--gray-600)'
                                        }}>
                                            {formatTime(change.time)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
