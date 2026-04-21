/**
 * Optimization Result Component
 * Hiển thị kết quả tối ưu hóa lịch trình
 */
export default function OptimizationResult({ report, onApply, onCancel, applying }) {
    console.log('OptimizationResult render:', { report, applying });

    if (!report) {
        console.log('No report provided');
        return null;
    }

    // Validate report structure
    if (!report.summary || !report.trackUsage) {
        console.error('Invalid report structure:', report);
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}>
                <div style={{
                    background: 'white',
                    padding: '40px',
                    borderRadius: 'var(--radius-lg)',
                    maxWidth: '500px'
                }}>
                    <h3 style={{ color: 'var(--red-600)', marginBottom: '16px' }}>❌ Lỗi dữ liệu</h3>
                    <p>Cấu trúc báo cáo không hợp lệ. Vui lòng thử lại.</p>
                    <button className="btn btn-secondary" onClick={onCancel} style={{ marginTop: '16px' }}>
                        Đóng
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                maxWidth: '900px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '24px',
                    borderBottom: '1px solid var(--gray-200)',
                    background: 'linear-gradient(135deg, var(--navy-600), var(--navy-700))',
                    color: 'white',
                    borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        marginBottom: '8px'
                    }}>
                        🎯 Kết Quả Tối Ưu Hóa Lịch Trình
                    </h2>
                    <p style={{ fontSize: '14px', opacity: 0.9 }}>
                        Hệ thống đã tự động sắp xếp lịch trình tối ưu tuân thủ tất cả quy tắc
                    </p>
                </div>

                {/* Score */}
                <div style={{
                    padding: '24px',
                    background: report.score >= 80 ? 'var(--green-50)' : report.score >= 60 ? 'var(--orange-50)' : 'var(--red-50)',
                    borderBottom: '1px solid var(--gray-200)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: report.score >= 80 ? 'var(--green-500)' : report.score >= 60 ? 'var(--orange-500)' : 'var(--red-500)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '32px',
                            fontWeight: 700
                        }}>
                            {report.score}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{
                                fontSize: '18px',
                                fontWeight: 700,
                                color: report.score >= 80 ? 'var(--green-700)' : report.score >= 60 ? 'var(--orange-700)' : 'var(--red-700)',
                                marginBottom: '4px'
                            }}>
                                {report.score >= 80 ? 'Tối ưu xuất sắc' : report.score >= 60 ? 'Tối ưu tốt' : 'Cần cải thiện'}
                            </div>
                            <div style={{ fontSize: '13px', color: 'var(--gray-600)' }}>
                                Điểm tối ưu hóa dựa trên hiệu suất sử dụng ray và phân bố thời gian
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Stats */}
                <div style={{
                    padding: '24px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '16px'
                }}>
                    <div style={{
                        padding: '16px',
                        background: 'var(--navy-50)',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--navy-200)'
                    }}>
                        <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--navy-700)' }}>
                            {report.summary.total}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--gray-600)', marginTop: '4px' }}>
                            Tổng số tàu
                        </div>
                    </div>

                    <div style={{
                        padding: '16px',
                        background: 'var(--green-50)',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--green-200)'
                    }}>
                        <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--green-700)' }}>
                            {report.summary.assigned}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--gray-600)', marginTop: '4px' }}>
                            Đã sắp xếp
                        </div>
                    </div>

                    <div style={{
                        padding: '16px',
                        background: 'var(--orange-50)',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--orange-200)'
                    }}>
                        <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--orange-700)' }}>
                            {report.summary.adjusted}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--gray-600)', marginTop: '4px' }}>
                            Đã điều chỉnh
                        </div>
                    </div>

                    <div style={{
                        padding: '16px',
                        background: 'var(--red-50)',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--red-200)'
                    }}>
                        <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--red-700)' }}>
                            {report.summary.failed}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--gray-600)', marginTop: '4px' }}>
                            Thất bại
                        </div>
                    </div>
                </div>

                {/* Track Usage */}
                <div style={{ padding: '24px', borderTop: '1px solid var(--gray-200)' }}>
                    <h3 style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: 'var(--navy-800)',
                        marginBottom: '16px'
                    }}>
                        📊 Mức Độ Sử Dụng Ray
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                        {Object.entries(report.trackUsage).map(([rayId, usage]) => (
                            <div
                                key={rayId}
                                style={{
                                    padding: '12px',
                                    background: 'var(--gray-50)',
                                    borderRadius: 'var(--radius)',
                                    border: '1px solid var(--gray-200)'
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '8px'
                                }}>
                                    <span style={{ fontWeight: 700, color: 'var(--navy-700)' }}>
                                        {rayId}
                                    </span>
                                    <span style={{ fontSize: '12px', color: 'var(--gray-600)' }}>
                                        {usage.count} tàu
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
                                        width: `${usage.percentage}%`,
                                        background: usage.percentage > 70 ? 'var(--red-500)' : usage.percentage > 50 ? 'var(--orange-500)' : 'var(--green-500)',
                                        transition: 'width 0.3s'
                                    }} />
                                </div>
                                <div style={{
                                    fontSize: '11px',
                                    color: 'var(--gray-600)',
                                    marginTop: '4px'
                                }}>
                                    {usage.percentage}% ({Math.floor(usage.totalMinutes / 60)}h {usage.totalMinutes % 60}m)
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Warnings */}
                {report.warnings.length > 0 && (
                    <div style={{ padding: '24px', borderTop: '1px solid var(--gray-200)' }}>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: 700,
                            color: 'var(--orange-700)',
                            marginBottom: '12px'
                        }}>
                            ⚠️ Cảnh Báo ({report.warnings.length})
                        </h3>
                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {report.warnings.map((warning, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: '12px',
                                        background: 'var(--orange-50)',
                                        border: '1px solid var(--orange-200)',
                                        borderRadius: 'var(--radius)',
                                        marginBottom: '8px',
                                        fontSize: '13px'
                                    }}
                                >
                                    <strong>{warning.train}:</strong> {warning.message}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Failures */}
                {report.failures.length > 0 && (
                    <div style={{ padding: '24px', borderTop: '1px solid var(--gray-200)' }}>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: 700,
                            color: 'var(--red-700)',
                            marginBottom: '12px'
                        }}>
                            ❌ Không Thể Sắp Xếp ({report.failures.length})
                        </h3>
                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {report.failures.map((failure, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: '12px',
                                        background: 'var(--red-50)',
                                        border: '1px solid var(--red-200)',
                                        borderRadius: 'var(--radius)',
                                        marginBottom: '8px',
                                        fontSize: '13px'
                                    }}
                                >
                                    <strong>{failure.train}</strong> ({failure.time}): {failure.reason}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div style={{
                    padding: '24px',
                    borderTop: '1px solid var(--gray-200)',
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'flex-end',
                    background: 'var(--gray-50)',
                    borderRadius: '0 0 var(--radius-lg) var(--radius-lg)'
                }}>
                    <button
                        className="btn btn-secondary"
                        onClick={onCancel}
                        disabled={applying}
                        style={{ minWidth: '120px' }}
                    >
                        Hủy bỏ
                    </button>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={onApply}
                        disabled={applying || report.summary.assigned === 0}
                        style={{
                            minWidth: '200px',
                            background: report.summary.assigned === 0 ? 'var(--gray-400)' : undefined
                        }}
                    >
                        {applying ? '⏳ Đang áp dụng...' : `✅ Áp dụng ${report.summary.assigned} lịch trình`}
                    </button>
                </div>
            </div>
        </div>
    );
}
