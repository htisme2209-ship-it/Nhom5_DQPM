import { formatTime } from '../../utils/timeUtils';
import { STATUS_MAP } from '../../constants/scheduleConstants';

/**
 * Schedule Table Component
 * Displays list of schedules in table format
 */
export default function ScheduleTable({
    schedules,
    loading,
    conflicts,
    onEdit,
    onDelete,
    onCreate
}) {
    if (loading) {
        return (
            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Mã LT</th><th>Chuyến tàu</th><th>Đường ray</th>
                                <th>Giờ đến DK</th><th>Giờ đi DK</th>
                                <th>Giờ đến TT</th><th>Giờ đi TT</th>
                                <th>Trễ</th><th>Sự cố</th><th>Trạng thái</th><th style={{ width: '120px' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="11" className="text-center text-muted" style={{ padding: '40px' }}>
                                    ⏳ Đang tải dữ liệu...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (schedules.length === 0) {
        return (
            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Mã LT</th><th>Chuyến tàu</th><th>Đường ray</th>
                                <th>Giờ đến DK</th><th>Giờ đi DK</th>
                                <th>Giờ đến TT</th><th>Giờ đi TT</th>
                                <th>Trễ</th><th>Sự cố</th><th>Trạng thái</th><th style={{ width: '120px' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="11" className="text-center text-muted" style={{ padding: '60px' }}>
                                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>📋</div>
                                    Không có lịch trình nào cho ngày này
                                    <br />
                                    <button className="btn btn-primary btn-sm" style={{ marginTop: '12px' }} onClick={onCreate}>
                                        + Thêm mới
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Mã LT</th><th>Chuyến tàu</th><th>Đường ray</th>
                            <th>Giờ đến DK</th><th>Giờ đi DK</th>
                            <th>Giờ đến TT</th><th>Giờ đi TT</th>
                            <th>Trễ</th><th>Sự cố</th><th>Trạng thái</th><th style={{ width: '120px' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.map(lt => {
                            const st = STATUS_MAP[lt.trangThai] || { label: lt.trangThai, cls: 'badge-gray' };
                            const hasConflict = conflicts.some(
                                c => lt.maRay && c.ray === lt.maRay &&
                                    (c.a === lt.maChuyenTau || c.b === lt.maChuyenTau)
                            );
                            const hasSuCo = lt.maSuCoAnhHuong != null;
                            const isPending = hasSuCo && lt.phuongAnXuLy === 'CHO_RAY';

                            return (
                                <tr
                                    key={lt.maLichTrinh}
                                    style={hasSuCo ? {
                                        background: isPending ? 'var(--red-50)' : 'var(--yellow-50)',
                                        borderLeft: isPending ? '4px solid var(--red-500)' : '4px solid var(--orange-500)'
                                    } : {}}
                                >
                                    <td className="font-semibold text-navy">{lt.maLichTrinh}</td>
                                    <td>
                                        <div className="font-bold text-navy">{lt.maChuyenTau}</div>
                                    </td>
                                    <td>
                                        <span className={`ray-badge ${hasConflict ? 'conflict' : ''}`}>
                                            {lt.maRay || '---'}{hasConflict && ' ⚠️'}
                                        </span>
                                    </td>
                                    <td className="time-display">{formatTime(lt.gioDenDuKien)}</td>
                                    <td className="time-display">{formatTime(lt.gioDiDuKien)}</td>
                                    <td>
                                        {lt.gioDenThucTe ? (
                                            <span className={lt.soPhutTre > 0 ? 'text-danger font-bold' : ''}>
                                                {formatTime(lt.gioDenThucTe)}
                                            </span>
                                        ) : (
                                            <span className="text-muted">---</span>
                                        )}
                                    </td>
                                    <td>
                                        {lt.gioDiThucTe ? formatTime(lt.gioDiThucTe) : <span className="text-muted">---</span>}
                                    </td>
                                    <td>
                                        {lt.soPhutTre > 0 ? (
                                            <span className="badge badge-danger">-{lt.soPhutTre}p</span>
                                        ) : (
                                            <span className="text-success font-semibold">⬤ 0</span>
                                        )}
                                    </td>
                                    <td>
                                        {hasSuCo ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <span
                                                    className="badge badge-danger"
                                                    style={{ fontSize: '11px' }}
                                                    title={`Sự cố: ${lt.maSuCoAnhHuong}`}
                                                >
                                                    ⚠️ {lt.maSuCoAnhHuong}
                                                </span>
                                                <span
                                                    className={`badge ${lt.phuongAnXuLy === 'CHO_RAY' ? 'badge-warning' :
                                                        lt.phuongAnXuLy === 'DOI_RAY' ? 'badge-info' :
                                                            'badge-danger'
                                                        }`}
                                                    style={{ fontSize: '10px' }}
                                                >
                                                    {lt.phuongAnXuLy === 'CHO_RAY' ? '⏳ Chờ ray' :
                                                        lt.phuongAnXuLy === 'DOI_RAY' ? '🔄 Đổi ray' :
                                                            '❌ Hủy'}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-muted">---</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`badge ${st.cls}`}>{st.label}</span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => onEdit(lt)}
                                                title="Chỉnh sửa"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => onDelete(lt)}
                                                title="Xóa"
                                                style={{ color: 'var(--red-500)' }}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="card-footer">
                <span className="text-sm text-muted">Hiển thị {schedules.length} lịch trình</span>
            </div>
        </div>
    );
}
