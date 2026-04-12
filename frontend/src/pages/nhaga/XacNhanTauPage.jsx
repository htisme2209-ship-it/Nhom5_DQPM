import { useState, useEffect } from 'react';
import { xacNhanTauAPI } from '../../services/api';
import Modal from '../../components/Modal';

/**
 * UC-10: Xác nhận tàu
 * Nhân viên nhà ga xác nhận trạng thái thực tế của tàu
 */
export default function XacNhanTauPage() {
    const [lichTrinhs, setLichTrinhs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedLT, setSelectedLT] = useState(null);
    const [form, setForm] = useState({
        trangThai: 'VAO_GA',
        daKiemTraAnToan: false,
        ghiChu: ''
    });
    const [toast, setToast] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadData();
        // Auto refresh mỗi 30 giây
        const interval = setInterval(loadData, 30000);
        return () => clearInterval(interval);
    }, []);

    // Kiểm tra mất liên lạc mỗi 45 giây
    useEffect(() => {
        const checkMatLienLac = async () => {
            try {
                await xacNhanTauAPI.kiemTraQuaHan();
            } catch (error) {
                console.error('Lỗi kiểm tra mất liên lạc:', error);
            }
        };

        // Chạy ngay lần đầu sau 10 giây
        const initialTimeout = setTimeout(checkMatLienLac, 10000);

        // Sau đó chạy mỗi 45 giây
        const interval = setInterval(checkMatLienLac, 45000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, []);

    const loadData = async () => {
        try {
            const res = await xacNhanTauAPI.getDanhSachChoXacNhan();
            setLichTrinhs(res.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const formatTime = (dt) => {
        if (!dt) return '---';
        const d = new Date(dt);
        return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
    };

    const getTimeDiff = (duKien) => {
        if (!duKien) return 0;
        const now = new Date();
        const expected = new Date(duKien);
        return Math.floor((now - expected) / 60000); // phút
    };

    const openXacNhan = (lt, trangThai) => {
        setSelectedLT(lt);
        setForm({
            trangThai,
            daKiemTraAnToan: false,
            ghiChu: ''
        });
        setShowModal(true);
    };

    const handleXacNhan = async () => {
        if (!form.daKiemTraAnToan) {
            showToast('Vui lòng xác nhận đã kiểm tra an toàn kỹ thuật!', 'error');
            return;
        }

        setSubmitting(true);
        try {
            const res = await xacNhanTauAPI.xacNhan({
                maLichTrinh: selectedLT.maLichTrinh,
                ...form
            });

            showToast(res.data.message || 'Xác nhận thành công!');

            if (res.data.soPhutTre > 0) {
                showToast(`⚠️ Tàu trễ ${res.data.soPhutTre} phút`, 'warning');
            }

            setShowModal(false);
            loadData();
        } catch (e) {
            showToast(e.response?.data?.message || 'Lỗi khi xác nhận', 'error');
        } finally {
            setSubmitting(false);
        }
    };


    const handleHuyXacNhan = async (maLichTrinh) => {
        if (!confirm('Bạn có chắc muốn hủy xác nhận này?')) return;

        try {
            await xacNhanTauAPI.huyXacNhan(maLichTrinh);
            showToast('Đã hủy xác nhận thành công');
            loadData();
        } catch (e) {
            showToast(e.response?.data?.message || 'Lỗi khi hủy xác nhận', 'error');
        }
    };

    const handleThuHoiLenh = async (maLichTrinh) => {
        const lyDo = prompt('Nhập lý do thu hồi lệnh:');
        if (!lyDo) return;

        setLoading(true);
        try {
            await suCoAPI.thuHoiLenh({
                maLichTrinh: maLichTrinh,
                lyDo
            });
            showToast('Thu hồi lệnh thành công!');
            loadData();
        } catch (error) {
            showToast(error.response?.data?.message || 'Lỗi khi thu hồi lệnh', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleBaoCaoNhanh = async (lichTrinh) => {
        const moTa = prompt(
            `Báo cáo nhanh về tàu ${lichTrinh.maChuyenTau}:\n` +
            `(Để trống để dùng mô tả tự động)`
        );

        // Cho phép để trống
        if (moTa === null) return; // User clicked Cancel

        setLoading(true);
        try {
            await suCoAPI.baoCaoNhanh({
                maLichTrinh: lichTrinh.maLichTrinh,
                loaiSuCo: 'TRE_TAU',
                moTa: moTa || undefined
            });
            showToast('Đã gửi báo cáo đến Điều hành!', 'success');
            loadData();
        } catch (error) {
            showToast(error.response?.data?.message || 'Lỗi khi báo cáo', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Phân loại tàu
    const tauChoVaoGa = lichTrinhs.filter(lt =>
        lt.trangThai === 'CHO_XAC_NHAN' || lt.trangThai === 'DA_XAC_NHAN'
    );
    const tauDangDo = lichTrinhs.filter(lt => lt.trangThai === 'DUNG_TAI_GA');
    const tauQuaHan = tauChoVaoGa.filter(lt => getTimeDiff(lt.gioDenDuKien) >= 10);

    return (
        <>
            {/* Toast */}
            {toast && (
                <div className="toast-container">
                    <div className={`toast ${toast.type}`}>
                        {toast.type === 'success' ? '✅' : toast.type === 'warning' ? '⚠️' : '❌'} {toast.msg}
                    </div>
                </div>
            )}

            {/* Page Header */}
            <div className="page-header">
                <div className="page-header-actions">
                    <div>
                        <p style={{
                            fontSize: '11px',
                            color: 'var(--gray-500)',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            UC-10: XÁC NHẬN TÀU
                        </p>
                        <h1>Xác Nhận Tàu Vào/Xuất Ga</h1>
                        <p>Xác nhận trạng thái thực tế của tàu tại sân ga theo QCVN 08:2018/BGTVT</p>
                    </div>
                    <button className="btn btn-secondary" onClick={loadData}>
                        🔄 Làm mới
                    </button>
                </div>
            </div>

            {/* Warning - Tàu quá hạn */}
            {tauQuaHan.length > 0 && (
                <div style={{
                    background: '#FEE2E2',
                    border: '2px solid #DC2626',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 20px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <div style={{ fontSize: '24px' }}>🚨</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#991B1B', marginBottom: '4px' }}>
                            CẢNH BÁO: {tauQuaHan.length} tàu quá hạn 10 phút chưa xác nhận!
                        </div>
                        <div style={{ fontSize: '13px', color: '#991B1B' }}>
                            Hệ thống sẽ tự động tạo sự cố "Mất liên lạc" nếu không xác nhận ngay.
                        </div>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="stats-grid" style={{ marginBottom: '24px' }}>
                <div className="stat-card blue">
                    <div className="stat-info">
                        <div className="stat-label">Chờ vào ga</div>
                        <div className="stat-value">{tauChoVaoGa.length}</div>
                    </div>
                    <div className="stat-icon">🚂</div>
                </div>
                <div className="stat-card green">
                    <div className="stat-info">
                        <div className="stat-label">Đang đỗ</div>
                        <div className="stat-value">{tauDangDo.length}</div>
                    </div>
                    <div className="stat-icon">🅿️</div>
                </div>
                <div className="stat-card red">
                    <div className="stat-info">
                        <div className="stat-label">Quá hạn</div>
                        <div className="stat-value">{tauQuaHan.length}</div>
                    </div>
                    <div className="stat-icon">⚠️</div>
                </div>
            </div>

            {/* Tàu chờ vào ga */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div className="card-header">
                    <h3>🚂 Tàu chờ xác nhận vào ga</h3>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Chuyến tàu</th>
                                <th>Giờ đến DK</th>
                                <th>Đường ray</th>
                                <th>Độ lệch</th>
                                <th>Trạng thái</th>
                                <th style={{ width: '200px' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted" style={{ padding: '40px' }}>
                                        ⏳ Đang tải...
                                    </td>
                                </tr>
                            ) : tauChoVaoGa.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted" style={{ padding: '40px' }}>
                                        Không có tàu chờ xác nhận
                                    </td>
                                </tr>
                            ) : (
                                tauChoVaoGa.map(lt => {
                                    const diff = getTimeDiff(lt.gioDenDuKien);
                                    const isOverdue = diff >= 10;
                                    return (
                                        <tr key={lt.maLichTrinh} style={isOverdue ? {
                                            background: '#FEE2E2',
                                            borderLeft: '4px solid #DC2626'
                                        } : {}}>
                                            <td className="font-bold text-navy">{lt.maChuyenTau}</td>
                                            <td className="time-display">{formatTime(lt.gioDenDuKien)}</td>
                                            <td><span className="ray-badge">{lt.maRay || '---'}</span></td>
                                            <td>
                                                {diff > 0 ? (
                                                    <span className={`badge ${isOverdue ? 'badge-danger' : 'badge-warning'}`}>
                                                        +{diff}p
                                                    </span>
                                                ) : diff < 0 ? (
                                                    <span className="badge badge-info">
                                                        {diff}p
                                                    </span>
                                                ) : (
                                                    <span className="text-success">⬤ Đúng giờ</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className="badge badge-warning">Chờ xác nhận</span>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => openXacNhan(lt, 'VAO_GA')}
                                                    style={{ width: '100%' }}
                                                >
                                                    ✅ Xác nhận vào ga
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tàu đang đỗ */}
            <div className="card">
                <div className="card-header">
                    <h3>🅿️ Tàu đang đỗ tại ga</h3>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Chuyến tàu</th>
                                <th>Giờ đến TT</th>
                                <th>Giờ đi DK</th>
                                <th>Đường ray</th>
                                <th>Trễ</th>
                                <th style={{ width: '250px' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tauDangDo.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted" style={{ padding: '40px' }}>
                                        Không có tàu đang đỗ
                                    </td>
                                </tr>
                            ) : (
                                tauDangDo.map(lt => (
                                    <tr key={lt.maLichTrinh} style={{
                                        background: 'var(--green-50)',
                                        borderLeft: '4px solid var(--green-500)'
                                    }}>
                                        <td className="font-bold text-navy">{lt.maChuyenTau}</td>
                                        <td className="time-display">{formatTime(lt.gioDenThucTe)}</td>
                                        <td className="time-display">{formatTime(lt.gioDiDuKien)}</td>
                                        <td><span className="ray-badge">{lt.maRay}</span></td>
                                        <td>
                                            {lt.soPhutTre > 0 ? (
                                                <span className="badge badge-danger">-{lt.soPhutTre}p</span>
                                            ) : (
                                                <span className="text-success">⬤ 0</span>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => openXacNhan(lt, 'XUAT_PHAT')}
                                                    style={{ flex: 1 }}
                                                >
                                                    🚀 Xuất phát
                                                </button>
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => handleHuyXacNhan(lt.maLichTrinh)}
                                                    title="Hủy xác nhận"
                                                >
                                                    ↩️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal xác nhận */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={form.trangThai === 'VAO_GA' ? '✅ Xác nhận Tàu Vào Ga' : '🚀 Xác nhận Tàu Xuất Phát'}
                subtitle={`Chuyến tàu: ${selectedLT?.maChuyenTau || ''}`}
                size="md"
            >
                {selectedLT && (
                    <>
                        {/* Thông tin tàu */}
                        <div style={{
                            background: 'var(--navy-50)',
                            padding: '16px',
                            borderRadius: 'var(--radius)',
                            marginBottom: '20px',
                            border: '1px solid var(--navy-200)'
                        }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                                <div>
                                    <div style={{ color: 'var(--gray-600)', marginBottom: '4px' }}>Mã lịch trình</div>
                                    <div style={{ fontWeight: 600, color: 'var(--navy-800)' }}>{selectedLT.maLichTrinh}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--gray-600)', marginBottom: '4px' }}>Đường ray</div>
                                    <div style={{ fontWeight: 600, color: 'var(--navy-800)' }}>{selectedLT.maRay || '---'}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--gray-600)', marginBottom: '4px' }}>
                                        {form.trangThai === 'VAO_GA' ? 'Giờ đến dự kiến' : 'Giờ đi dự kiến'}
                                    </div>
                                    <div style={{ fontWeight: 600, color: 'var(--navy-800)' }}>
                                        {formatTime(form.trangThai === 'VAO_GA' ? selectedLT.gioDenDuKien : selectedLT.gioDiDuKien)}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--gray-600)', marginBottom: '4px' }}>Thời gian hiện tại</div>
                                    <div style={{ fontWeight: 600, color: 'var(--green-600)' }}>
                                        {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Checkbox an toàn */}
                        <div style={{
                            background: 'var(--yellow-50)',
                            border: '2px solid var(--yellow-500)',
                            borderRadius: 'var(--radius)',
                            padding: '16px',
                            marginBottom: '20px'
                        }}>
                            <label style={{ display: 'flex', alignItems: 'start', gap: '12px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={form.daKiemTraAnToan}
                                    onChange={(e) => setForm({ ...form, daKiemTraAnToan: e.target.checked })}
                                    style={{ marginTop: '2px', width: '18px', height: '18px' }}
                                />
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--gray-800)', marginBottom: '4px' }}>
                                        ✓ Xác nhận an toàn kỹ thuật (QCVN 08:2018/BGTVT)
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--gray-600)', lineHeight: '1.5' }}>
                                        Tôi xác nhận đã kiểm tra đường {form.trangThai === 'VAO_GA' ? 'đón' : 'gửi'} tàu thông thoáng
                                        và các bộ ghi đã khóa an toàn theo quy định.
                                    </div>
                                </div>
                            </label>
                        </div>

                        {/* Ghi chú */}
                        <div className="form-group">
                            <label className="form-label">GHI CHÚ VẬN HÀNH (Tùy chọn)</label>
                            <textarea
                                className="form-control"
                                value={form.ghiChu}
                                onChange={(e) => setForm({ ...form, ghiChu: e.target.value })}
                                rows="3"
                                placeholder="Ghi chú về tình hình hành khách, vấn đề phát sinh..."
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        {/* Actions */}
                        <div className="modal-footer" style={{ padding: '16px 0 0', borderTop: '1px solid var(--gray-200)' }}>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowModal(false)}
                                disabled={submitting}
                            >
                                Hủy
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleXacNhan}
                                disabled={!form.daKiemTraAnToan || submitting}
                                style={{
                                    opacity: !form.daKiemTraAnToan ? 0.5 : 1,
                                    cursor: !form.daKiemTraAnToan ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {submitting ? '⏳ Đang xử lý...' :
                                    form.trangThai === 'VAO_GA' ? '✅ Xác nhận vào ga' : '🚀 Xác nhận xuất phát'}
                            </button>
                        </div>
                    </>
                )}
            </Modal>
        </>
    );
}
