/**
 * Simulation Conflict Panel
 * Hiển thị danh sách xung đột và gợi ý giải quyết
 */
export default function SimulationConflictPanel({ conflicts, onAcceptSuggestion }) {
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'HIGH': return { bg: 'var(--red-50)', border: 'var(--red-300)', text: 'var(--red-700)', label: 'CAO' };
            case 'MEDIUM': return { bg: 'var(--orange-50)', border: 'var(--orange-300)', text: 'var(--orange-700)', label: 'TRUNG BÌNH' };
            case 'LOW': return { bg: 'var(--yellow-50)', border: 'var(--yellow-300)', text: 'var(--yellow-700)', label: 'THẤP' };
            default: return { bg: 'var(--gray-50)', border: 'var(--gray-300)', text: 'var(--gray-700)', label: 'N/A' };
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'TRACK_OVERLAP': return 'Trùng đường ray';
            case 'TIME_CONFLICT': return 'Xung đột thời gian';
            case 'CLEARANCE_TIME': return 'Khung giờ giải tỏa';
            default: return type;
        }
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
                    <span style={{ fontSize: '18px' }}>⚠️</span>
                    <h3 style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: 'var(--navy-800)',
                        margin: 0
                    }}>
                        Phân tích xung đột chi tiết
                    </h3>
                </div>
                <div style={{
                    padding: '4px 12px',
                    background: conflicts.length > 0 ? 'var(--red-100)' : 'var(--green-100)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: conflicts.length > 0 ? 'var(--red-700)' : 'var(--green-700)'
                }}>
                    {conflicts.length} xung đột
                </div>
            </div>

            {/* Content */}
            <div style={{
                maxHeight: '400px',
                overflowY: 'auto',
                padding: '16px'
            }}>
                {conflicts.length === 0 ? (
                    <div style={{
                        padding: '40px 20px',
                        textAlign: 'center',
                        color: 'var(--gray-500)'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>
                            Không có xung đột
                        </div>
                        <div style={{ fontSize: '12px', marginTop: '4px' }}>
                            Lịch trình đã được tối ưu hóa tốt
                        </div>
                    </div>
                ) : (
                    conflicts.map((conflict, index) => {
                        const severityStyle = getSeverityColor(conflict.severity);

                        return (
                            <div
                                key={conflict.id}
                                style={{
                                    padding: '16px',
                                    background: severityStyle.bg,
                                    border: `1px solid ${severityStyle.border}`,
                                    borderRadius: 'var(--radius)',
                                    marginBottom: '12px'
                                }}
                            >
                                {/* Header */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '12px'
                                }}>
                                    <div style={{
                                        padding: '4px 10px',
                                        background: severityStyle.text,
                                        color: 'white',
                                        borderRadius: '4px',
                                        fontSize: '10px',
                                        fontWeight: 700,
                                        letterSpacing: '0.5px'
                                    }}>
                                        {severityStyle.label}
                                    </div>
                                    <div style={{
                                        fontSize: '11px',
                                        color: 'var(--gray-600)',
                                        fontWeight: 600
                                    }}>
                                        #{index + 1}
                                    </div>
                                </div>

                                {/* Details */}
                                <div style={{ marginBottom: '12px' }}>
                                    <div style={{
                                        fontSize: '13px',
                                        fontWeight: 700,
                                        color: severityStyle.text,
                                        marginBottom: '6px'
                                    }}>
                                        {getTypeLabel(conflict.type)}
                                    </div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: 'var(--gray-700)',
                                        marginBottom: '4px'
                                    }}>
                                        <strong>Tàu bị ảnh hưởng:</strong> {conflict.trains.join(', ')}
                                    </div>
                                    {conflict.track && (
                                        <div style={{
                                            fontSize: '12px',
                                            color: 'var(--gray-700)'
                                        }}>
                                            <strong>Đường ray:</strong> {conflict.track}
                                        </div>
                                    )}
                                </div>

                                {/* Suggestion */}
                                {conflict.suggestion && (
                                    <div style={{
                                        padding: '12px',
                                        background: 'white',
                                        borderRadius: 'var(--radius)',
                                        marginBottom: '12px'
                                    }}>
                                        <div style={{
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            color: 'var(--gray-600)',
                                            marginBottom: '6px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            💡 Gợi ý hệ thống
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: 'var(--gray-700)',
                                            lineHeight: '1.5'
                                        }}>
                                            {conflict.suggestion}
                                        </div>
                                    </div>
                                )}

                                {/* Action */}
                                {conflict.canAutoFix && (
                                    <button
                                        className="btn btn-sm"
                                        onClick={() => onAcceptSuggestion(conflict.id)}
                                        style={{
                                            width: '100%',
                                            background: severityStyle.text,
                                            color: 'white',
                                            fontSize: '12px',
                                            height: '32px'
                                        }}
                                    >
                                        ✓ Chấp nhận gợi ý
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
