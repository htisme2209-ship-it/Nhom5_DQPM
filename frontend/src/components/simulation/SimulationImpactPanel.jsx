/**
 * Simulation Impact Panel
 * Hiển thị tác động của mô phỏng lên hệ thống
 */
export default function SimulationImpactPanel({ impacts }) {
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
                gap: '8px'
            }}>
                <span style={{ fontSize: '18px' }}>📈</span>
                <h3 style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--navy-800)',
                    margin: 0
                }}>
                    Tác động mô phỏng
                </h3>
            </div>

            {/* Content */}
            <div style={{ padding: '20px' }}>
                {/* Network Delay */}
                <div style={{ marginBottom: '20px' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                    }}>
                        <span style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'var(--gray-600)'
                        }}>
                            Mức độ trễ mạng lưới
                        </span>
                        <span style={{
                            fontSize: '18px',
                            fontWeight: 700,
                            color: impacts.networkDelay > 5 ? 'var(--red-600)' : 'var(--green-600)'
                        }}>
                            +{impacts.networkDelay}p
                        </span>
                    </div>
                    <div style={{
                        height: '8px',
                        background: 'var(--gray-200)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${Math.min(impacts.networkDelay * 10, 100)}%`,
                            background: impacts.networkDelay > 5
                                ? 'linear-gradient(90deg, var(--red-500), var(--red-600))'
                                : 'linear-gradient(90deg, var(--green-500), var(--green-600))',
                            transition: 'width 0.3s'
                        }} />
                    </div>
                </div>

                {/* Track Utilization */}
                <div style={{ marginBottom: '20px' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                    }}>
                        <span style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'var(--gray-600)'
                        }}>
                            Hiệu suất sử dụng đường ray
                        </span>
                        <span style={{
                            fontSize: '18px',
                            fontWeight: 700,
                            color: 'var(--navy-700)'
                        }}>
                            {impacts.trackUtilization}%
                        </span>
                    </div>
                    <div style={{
                        height: '8px',
                        background: 'var(--gray-200)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${impacts.trackUtilization}%`,
                            background: 'linear-gradient(90deg, var(--orange-400), var(--orange-500))',
                            transition: 'width 0.3s'
                        }} />
                    </div>
                </div>

                {/* Statistics */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginTop: '20px',
                    paddingTop: '20px',
                    borderTop: '1px solid var(--gray-200)'
                }}>
                    <div style={{
                        padding: '12px',
                        background: 'var(--blue-50)',
                        borderRadius: 'var(--radius)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '24px',
                            fontWeight: 700,
                            color: 'var(--blue-700)'
                        }}>
                            {impacts.arrivals}
                        </div>
                        <div style={{
                            fontSize: '11px',
                            color: 'var(--gray-600)',
                            marginTop: '4px'
                        }}>
                            Chuyến đến
                        </div>
                    </div>

                    <div style={{
                        padding: '12px',
                        background: 'var(--purple-50)',
                        borderRadius: 'var(--radius)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '24px',
                            fontWeight: 700,
                            color: 'var(--purple-700)'
                        }}>
                            {impacts.departures}
                        </div>
                        <div style={{
                            fontSize: '11px',
                            color: 'var(--gray-600)',
                            marginTop: '4px'
                        }}>
                            Chuyến đi
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
