import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { suCoAPI, duongRayAPI } from '../../services/api';

// ─── Trạng thái config ─────────────────────────────────────────────────────
const TRANG_THAI_CONFIG = {
    CHUA_XU_LY: {
        label: 'Chưa xử lý', icon: '🔴',
        bg: '#FEE2E2', color: '#DC2626', border: '#FCA5A5', badgeBg: '#FEF2F2', dot: '#EF4444'
    },
    DANG_XU_LY: {
        label: 'Đang xử lý', icon: '🟡',
        bg: '#FFFBEB', color: '#D97706', border: '#FCD34D', badgeBg: '#FFFBEB', dot: '#F59E0B'
    },
    DA_XU_LY: {
        label: 'Đã xử lý', icon: '🟢',
        bg: '#F0FDF4', color: '#16A34A', border: '#86EFAC', badgeBg: '#F0FDF4', dot: '#22C55E'
    }
};

function TrangThaiBadge({ trangThai, size = 'sm' }) {
    const cfg = TRANG_THAI_CONFIG[trangThai] || TRANG_THAI_CONFIG.CHUA_XU_LY;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: size === 'lg' ? '6px 14px' : '3px 10px',
            borderRadius: '20px', fontSize: size === 'lg' ? '13px' : '11px',
            fontWeight: 600, background: cfg.badgeBg, color: cfg.color,
            border: `1px solid ${cfg.border}`, whiteSpace: 'nowrap'
        }}>
            <span style={{
                width: size === 'lg' ? '8px' : '6px', height: size === 'lg' ? '8px' : '6px',
                borderRadius: '50%', background: cfg.dot, display: 'inline-block', flexShrink: 0,
                animation: trangThai === 'DANG_XU_LY' ? 'pulse 1.5s infinite' : 'none'
            }} />
            {cfg.label}
        </span>
    );
}

export default function XuLySuCoPage() {
    const navigate = useNavigate();
    const [suCos, setSuCos] = useState([]);
    const [selectedSuCo, setSelectedSuCo] = useState(null);
    const [lichTrinhBiAnhHuong, setLichTrinhBiAnhHuong] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState({}); // per-item loading
    const [toast, setToast] = useState(null);
    const [filterTab, setFilterTab] = useState('CHUA_XU_LY');
    const [confirmHuy, setConfirmHuy] = useState(null); // lịch trình đang confirm hủy

    useEffect(() => { loadSuCos(); }, []);

    const loadSuCos = async () => {
        try {
            const res = await suCoAPI.getAll();
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setSuCos(data);
        } catch (err) { console.error(err); setSuCos([]); }
    };

    const loadLichTrinhBiAnhHuong = async (maSuCo) => {
        try {
            const res = await suCoAPI.getLichTrinhAnhHuong(maSuCo);
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setLichTrinhBiAnhHuong(data);
        } catch (err) {
            console.error(err);
            setLichTrinhBiAnhHuong([]);
            showToast(err.response?.data?.message || err.message, 'error');
        }
    };

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const handleSelectSuCo = (suCo) => {
        setSelectedSuCo(suCo);
        loadLichTrinhBiAnhHuong(suCo.maSuCo);
    };

    // ── Bắt đầu xử lý: CHUA → DANG ─────────────────────────────────────────
    const handleBatDauXuLy = async (suCo) => {
        if (!confirm(`Bắt đầu xử lý sự cố ${suCo.maSuCo}?`)) return;
        setLoading(true);
        try {
            await suCoAPI.capNhatTrangThai(suCo.maSuCo, 'DANG_XU_LY');
            showToast('Đã chuyển sang trạng thái Đang xử lý!');
            await loadSuCos();
            setSelectedSuCo(prev => prev ? { ...prev, trangThaiXuLy: 'DANG_XU_LY' } : prev);
        } catch (err) {
            showToast(err.response?.data?.message || err.message, 'error');
        } finally { setLoading(false); }
    };

    // ── Hủy chuyến một lịch trình ───────────────────────────────────────────
    const handleHuyMotChuyen = async (lt) => {
        setActionLoading(prev => ({ ...prev, [lt.maLichTrinh]: true }));
        try {
            await suCoAPI.xuLyPhuongAn({
                maLichTrinh: lt.maLichTrinh,
                phuongAn: 'HUY_CHUYEN',
                maRayMoi: null
            });
            showToast(`Đã hủy chuyến ${lt.maChuyenTau}`);
            loadLichTrinhBiAnhHuong(selectedSuCo.maSuCo);
        } catch (err) {
            showToast(err.response?.data?.message || err.message, 'error');
        } finally {
            setActionLoading(prev => ({ ...prev, [lt.maLichTrinh]: false }));
            setConfirmHuy(null);
        }
    };

    // ── Điều phối một lịch trình sang DieuPhoiRayPage ───────────────────────
    const handleDieuPhoiMotLichTrinh = (lt) => {
        const params = new URLSearchParams({
            suCoId: selectedSuCo.maSuCo,
            lichTrinhIds: lt.maLichTrinh
        });
        navigate(`/dieu-hanh/duong-ray?${params.toString()}`);
    };

    // ── Điều phối TẤT CẢ lịch trình bị ảnh hưởng ───────────────────────────
    const handleDieuPhoiTatCa = () => {
        const ids = lichTrinhBiAnhHuong
            .filter(lt => lt.phuongAnXuLy !== 'HUY_CHUYEN')
            .map(lt => lt.maLichTrinh)
            .join(',');
        if (!ids) { showToast('Không có lịch trình nào cần điều phối', 'error'); return; }
        const params = new URLSearchParams({ suCoId: selectedSuCo.maSuCo, lichTrinhIds: ids });
        navigate(`/dieu-hanh/duong-ray?${params.toString()}`);
    };

    // ── Hoàn thành xử lý — gọi khi DANG_XU_LY và không còn lịch trình ────────
    const handleHoanThanhXuLy = async () => {
        if (!selectedSuCo) return;
        if (!confirm(
            `Xác nhận hoàn thành xử lý sự cố ${selectedSuCo.maSuCo}?\n` +
            `Đường ray ${selectedSuCo.maRay} sẽ được giải phóng và chuyển về SẴN SÀNG.`
        )) return;
        setLoading(true);
        try {
            await suCoAPI.giaiPhongRay({ maRay: selectedSuCo.maRay, maSuCo: selectedSuCo.maSuCo });
            showToast('✅ Hoàn thành xử lý! Đường ray đã được giải phóng.');
            await loadSuCos();
            setSelectedSuCo(null);
            setLichTrinhBiAnhHuong([]);
        } catch (err) {
            showToast(err.response?.data?.message || err.message, 'error');
        } finally { setLoading(false); }
    };

    // ── Giải phóng ray ───────────────────────────────────────────────────────
    const handleGiaiPhongRay = async () => {
        if (!selectedSuCo) return;
        if (!confirm('Bạn có chắc muốn giải phóng đường ray? Tất cả lịch trình phải đã được xử lý.')) return;
        setLoading(true);
        try {
            await suCoAPI.giaiPhongRay({ maRay: selectedSuCo.maRay, maSuCo: selectedSuCo.maSuCo });
            showToast('Giải phóng ray thành công!');
            loadSuCos();
            setSelectedSuCo(null);
            setLichTrinhBiAnhHuong([]);
        } catch (err) {
            showToast(err.response?.data?.message || err.message, 'error');
        } finally { setLoading(false); }
    };


    const countByStatus = {
        CHUA_XU_LY: suCos.filter(s => s.trangThaiXuLy === 'CHUA_XU_LY').length,
        DANG_XU_LY: suCos.filter(s => s.trangThaiXuLy === 'DANG_XU_LY').length,
        DA_XU_LY: suCos.filter(s => s.trangThaiXuLy === 'DA_XU_LY').length,
    };
    const filteredSuCos = filterTab === 'ALL' ? suCos : suCos.filter(s => s.trangThaiXuLy === filterTab);
    // Chỉ tính những lịch trình thực sự cần xử lý (CHO_RAY)
    const pendingLichTrinh = lichTrinhBiAnhHuong.filter(lt => lt.phuongAnXuLy === 'CHO_RAY' || !lt.phuongAnXuLy);
    // Kiểm tra đã xử lý hết chưa: không còn CHO_RAY nào
    const daXuLyHetLichTrinh = lichTrinhBiAnhHuong.length === 0 || pendingLichTrinh.length === 0;
    // Hiển thị nút "Hoàn thành" khi DANG_XU_LY và không còn việc gì
    const hienThiNutHoanThanh = selectedSuCo?.trangThaiXuLy === 'DANG_XU_LY' && daXuLyHetLichTrinh;

    const tabs = [
        { key: 'ALL', label: 'Tất cả', count: suCos.length, color: '#4B5563' },
        { key: 'CHUA_XU_LY', label: 'Chưa xử lý', count: countByStatus.CHUA_XU_LY, color: '#DC2626' },
        { key: 'DANG_XU_LY', label: 'Đang xử lý', count: countByStatus.DANG_XU_LY, color: '#D97706' },
        { key: 'DA_XU_LY', label: 'Đã xử lý', count: countByStatus.DA_XU_LY, color: '#16A34A' },
    ];

    return (
        <>
            <style>{`
                @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }
            `}</style>

            {/* Toast */}
            {toast && (
                <div className="toast-container">
                    <div className={`toast ${toast.type}`}>
                        {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
                    </div>
                </div>
            )}

            {/* Confirm hủy overlay */}
            {confirmHuy && (
                <div className="confirm-overlay" onClick={() => setConfirmHuy(null)}>
                    <div className="confirm-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
                        <div style={{ fontSize: '32px', textAlign: 'center', marginBottom: '12px' }}>❌</div>
                        <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>
                            Xác nhận hủy chuyến
                        </h3>
                        <p style={{ fontSize: '13px', color: 'var(--gray-600)', textAlign: 'center', marginBottom: '20px' }}>
                            Bạn có chắc muốn hủy chuyến <strong>{confirmHuy.maChuyenTau}</strong>?<br />
                            Hành động này không thể hoàn tác.
                        </p>
                        <div className="confirm-actions">
                            <button className="btn btn-secondary" onClick={() => setConfirmHuy(null)}>
                                Quay lại
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleHuyMotChuyen(confirmHuy)}
                                disabled={actionLoading[confirmHuy.maLichTrinh]}
                            >
                                {actionLoading[confirmHuy.maLichTrinh] ? '⏳ Đang xử lý...' : '❌ Xác nhận hủy'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Page Header */}
            <div className="page-header">
                <div className="page-header-actions">
                    <div>
                        <p style={{ fontSize: '11px', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            UC-06: XỬ LÝ SỰ CỐ
                        </p>
                        <h1>Điều Hành và Xử Lý Sự Cố</h1>
                        <p>Quản lý phương án xử lý cho lịch trình bị ảnh hưởng</p>
                    </div>
                    {selectedSuCo && (
                        <button className="btn btn-primary" onClick={handleGiaiPhongRay} disabled={loading}>
                            🔓 Giải phóng ray
                        </button>
                    )}
                </div>
            </div>

            {/* Summary Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                {Object.entries(TRANG_THAI_CONFIG).map(([key, cfg]) => (
                    <div key={key} onClick={() => setFilterTab(key)} style={{
                        background: filterTab === key ? cfg.bg : 'white',
                        border: `2px solid ${filterTab === key ? cfg.border : 'var(--gray-200)'}`,
                        borderRadius: 'var(--radius-md)', padding: '16px 20px',
                        cursor: 'pointer', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', gap: '16px'
                    }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: cfg.bg, border: `1px solid ${cfg.border}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '22px', flexShrink: 0
                        }}>{cfg.icon}</div>
                        <div>
                            <div style={{ fontSize: '24px', fontWeight: 700, color: cfg.color, lineHeight: 1 }}>
                                {countByStatus[key]}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--gray-600)', marginTop: '2px' }}>{cfg.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
                {/* Sidebar */}
                <div className="card" style={{ height: 'fit-content' }}>
                    {/* Filter tabs */}
                    <div style={{ padding: '8px', borderBottom: '1px solid var(--gray-200)', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {tabs.map(tab => (
                            <button key={tab.key} onClick={() => setFilterTab(tab.key)} style={{
                                padding: '4px 10px', borderRadius: '16px', border: 'none', cursor: 'pointer',
                                fontSize: '11px', fontWeight: 600, transition: 'all 0.2s',
                                background: filterTab === tab.key ? tab.color : 'var(--gray-100)',
                                color: filterTab === tab.key ? 'white' : 'var(--gray-600)',
                                display: 'flex', alignItems: 'center', gap: '4px'
                            }}>
                                {tab.label}
                                <span style={{
                                    background: filterTab === tab.key ? 'rgba(255,255,255,0.3)' : 'var(--gray-200)',
                                    borderRadius: '10px', padding: '0 5px', fontSize: '10px'
                                }}>{tab.count}</span>
                            </button>
                        ))}
                    </div>
                    {/* List */}
                    <div style={{ maxHeight: '580px', overflowY: 'auto' }}>
                        {filteredSuCos.length === 0 ? (
                            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--gray-500)' }}>
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                                <div style={{ fontSize: '13px' }}>Không có sự cố nào</div>
                            </div>
                        ) : filteredSuCos.map(suCo => {
                            const cfg = TRANG_THAI_CONFIG[suCo.trangThaiXuLy] || TRANG_THAI_CONFIG.CHUA_XU_LY;
                            const isSelected = selectedSuCo?.maSuCo === suCo.maSuCo;
                            return (
                                <div key={suCo.maSuCo} onClick={() => handleSelectSuCo(suCo)}
                                    style={{
                                        padding: '14px 16px', borderBottom: '1px solid var(--gray-200)',
                                        cursor: 'pointer', transition: 'all 0.15s',
                                        background: isSelected ? 'var(--navy-50)' : 'transparent',
                                        borderLeft: `4px solid ${isSelected ? 'var(--navy-500)' : cfg.dot}`,
                                    }}
                                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--gray-50)'; }}
                                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '8px' }}>
                                        <div style={{ fontWeight: 600, fontSize: '13px' }}>{suCo.maSuCo}</div>
                                        <TrangThaiBadge trangThai={suCo.trangThaiXuLy} />
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--gray-600)', margin: '4px 0' }}>
                                        Ray: {suCo.maRay}
                                    </div>
                                    <span style={{
                                        display: 'inline-block', padding: '2px 8px', borderRadius: '12px',
                                        fontSize: '11px', fontWeight: 600,
                                        background: suCo.mucDo === 'KHAN_CAP' ? '#FEE2E2' : suCo.mucDo === 'CAO' ? '#FFEDD5' : '#FFFBEB',
                                        color: suCo.mucDo === 'KHAN_CAP' ? '#DC2626' : suCo.mucDo === 'CAO' ? '#EA580C' : '#CA8A04'
                                    }}>
                                        {suCo.mucDo === 'KHAN_CAP' ? '🔴' : suCo.mucDo === 'CAO' ? '🟠' : '🟡'} {suCo.mucDo}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content */}
                <div>
                    {selectedSuCo ? (
                        <>
                            {/* Cảnh báo mất liên lạc */}
                            {selectedSuCo.loaiSuCo === 'MAT_LIEN_LAC' && (
                                <div style={{
                                    background: '#FEE2E2', border: '2px solid #DC2626',
                                    borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '20px',
                                    display: 'flex', alignItems: 'start', gap: '16px'
                                }}>
                                    <div style={{ fontSize: '32px' }}>🚨</div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '16px', color: '#991B1B', marginBottom: '8px' }}>
                                            CHẾ ĐỘ VẬN HÀNH KHẨN CẤP
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#991B1B', lineHeight: '1.6' }}>
                                            Tàu mất liên lạc {'>'}10 phút. Áp dụng quy trình khẩn cấp theo
                                            <strong> Thông tư 15/2023/TT-GTVT</strong>.
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Thông tin sự cố */}
                            <div className="card" style={{ marginBottom: '20px' }}>
                                <div style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                                        <div>
                                            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
                                                {selectedSuCo.maSuCo}
                                            </h2>
                                            <p style={{ fontSize: '13px', color: 'var(--gray-600)' }}>{selectedSuCo.moTa}</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <TrangThaiBadge trangThai={selectedSuCo.trangThaiXuLy} size="lg" />
                                            {selectedSuCo.trangThaiXuLy === 'CHUA_XU_LY' && (
                                                <button onClick={() => handleBatDauXuLy(selectedSuCo)} disabled={loading}
                                                    style={{
                                                        padding: '6px 16px', borderRadius: '20px', border: 'none',
                                                        background: '#D97706', color: 'white', fontSize: '12px', fontWeight: 600,
                                                        cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
                                                        display: 'flex', alignItems: 'center', gap: '5px'
                                                    }}>
                                                    🔧 Bắt đầu xử lý
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{
                                        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px',
                                        padding: '16px', background: 'var(--gray-50)', borderRadius: 'var(--radius)'
                                    }}>
                                        {[
                                            { label: 'ĐƯỜNG RAY', value: selectedSuCo.maRay },
                                            { label: 'LOẠI SỰ CỐ', value: selectedSuCo.loaiSuCo },
                                            { label: 'MỨC ĐỘ', value: selectedSuCo.mucDo },
                                            { label: 'TRẠNG THÁI', value: <TrangThaiBadge trangThai={selectedSuCo.trangThaiXuLy} /> }
                                        ].map(({ label, value }) => (
                                            <div key={label}>
                                                <div style={{ fontSize: '11px', color: 'var(--gray-500)', marginBottom: '6px' }}>{label}</div>
                                                <div style={{ fontWeight: 600, fontSize: '13px' }}>{value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Lịch trình bị ảnh hưởng */}
                            <div className="card">
                                {/* Header + nút Điều phối tất cả */}
                                <div style={{
                                    padding: '16px 20px', borderBottom: '1px solid var(--gray-200)',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--gray-700)' }}>
                                            LỊCH TRÌNH BỊ ẢNH HƯỞNG ({lichTrinhBiAnhHuong.length})
                                        </div>
                                        {pendingLichTrinh.length > 0 && (
                                            <div style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '2px' }}>
                                                {pendingLichTrinh.length} lịch trình cần xử lý
                                            </div>
                                        )}
                                    </div>
                                    {pendingLichTrinh.length > 0 && (
                                        <button onClick={handleDieuPhoiTatCa}
                                            style={{
                                                padding: '8px 18px', borderRadius: '8px', border: 'none',
                                                background: 'var(--navy-600)', color: 'white',
                                                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: '6px',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'var(--navy-700)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'var(--navy-600)'}
                                        >
                                            🔄 Điều phối tất cả ({pendingLichTrinh.length}) →
                                        </button>
                                    )}
                                </div>

                                {/* Body */}
                                <div style={{ padding: '20px' }}>
                                    {lichTrinhBiAnhHuong.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--gray-500)' }}>
                                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📋</div>
                                            <div style={{ fontSize: '13px', marginBottom: '16px' }}>
                                                Không có lịch trình nào bị ảnh hưởng
                                            </div>
                                            {/* Nút Hoàn thành khi đang xử lý và không có lịch trình */}
                                            {hienThiNutHoanThanh && (
                                                <button
                                                    onClick={handleHoanThanhXuLy}
                                                    disabled={loading}
                                                    style={{
                                                        padding: '10px 24px', borderRadius: '10px', border: 'none',
                                                        background: '#16A34A', color: 'white',
                                                        fontSize: '14px', fontWeight: 700,
                                                        cursor: loading ? 'not-allowed' : 'pointer',
                                                        opacity: loading ? 0.6 : 1,
                                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                                        boxShadow: '0 2px 8px rgba(22,163,74,0.3)',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#15803D'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = '#16A34A'; }}
                                                >
                                                    {loading ? '⏳ Đang xử lý...' : '✅ Hoàn thành Xử lý — Giải phóng Ray'}
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {lichTrinhBiAnhHuong.map(lt => (
                                                <LichTrinhAnhHuongCard
                                                    key={lt.maLichTrinh}
                                                    lichTrinh={lt}
                                                    actionLoading={actionLoading}
                                                    onHuy={() => setConfirmHuy(lt)}
                                                    onDieuPhoi={() => handleDieuPhoiMotLichTrinh(lt)}
                                                />
                                            ))}

                                            {/* Nút Hoàn thành khi tất cả lịch trình đã được xử lý */}
                                            {hienThiNutHoanThanh && (
                                                <div style={{
                                                    marginTop: '8px', paddingTop: '16px',
                                                    borderTop: '2px dashed #86EFAC',
                                                    display: 'flex', flexDirection: 'column',
                                                    alignItems: 'center', gap: '8px'
                                                }}>
                                                    <div style={{ fontSize: '12px', color: '#16A34A', fontWeight: 600 }}>
                                                        ✅ Tất cả lịch trình đã được xử lý
                                                    </div>
                                                    <button
                                                        onClick={handleHoanThanhXuLy}
                                                        disabled={loading}
                                                        style={{
                                                            padding: '10px 28px', borderRadius: '10px', border: 'none',
                                                            background: '#16A34A', color: 'white',
                                                            fontSize: '14px', fontWeight: 700,
                                                            cursor: loading ? 'not-allowed' : 'pointer',
                                                            opacity: loading ? 0.6 : 1,
                                                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                                                            boxShadow: '0 2px 8px rgba(22,163,74,0.3)',
                                                            transition: 'all 0.2s'
                                                        }}
                                                        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#15803D'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = '#16A34A'; }}
                                                    >
                                                        {loading ? '⏳ Đang xử lý...' : '✅ Hoàn thành Xử lý — Giải phóng Ray'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="card">
                            <div style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--gray-500)' }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                                <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>
                                    Chọn một sự cố để xem chi tiết
                                </div>
                                <div style={{ fontSize: '13px' }}>
                                    Chọn sự cố từ danh sách bên trái để bắt đầu xử lý
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

// ─── Card lịch trình bị ảnh hưởng với 2 option ────────────────────────────
function LichTrinhAnhHuongCard({ lichTrinh, actionLoading, onHuy, onDieuPhoi }) {
    const isHuyed = lichTrinh.phuongAnXuLy === 'HUY_CHUYEN' || lichTrinh.trangThai === 'HUY_CHUYEN';
    const isDone = lichTrinh.phuongAnXuLy === 'DOI_RAY';
    const soPhutTre = lichTrinh.soPhutTre || 0;
    const isLoading = actionLoading[lichTrinh.maLichTrinh];

    const formatDT = (dt) => {
        if (!dt) return '--:--';
        const d = new Date(dt);
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    return (
        <div style={{
            border: isHuyed ? '1px solid #E5E7EB' : isDone ? '1px solid #86EFAC' : '1px solid #FCA5A5',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            background: isHuyed ? '#F9FAFB' : isDone ? '#F0FDF4' : 'white',
            opacity: isHuyed ? 0.65 : 1,
            transition: 'all 0.2s'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                {/* Thông tin lịch trình */}
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px' }}>{lichTrinh.maLichTrinh}</span>
                        <span style={{ fontSize: '12px', color: 'var(--gray-500)' }}>—</span>
                        <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--navy-600)' }}>
                            {lichTrinh.maChuyenTau}
                        </span>
                        {soPhutTre > 0 && (
                            <span style={{
                                padding: '2px 8px', borderRadius: '12px', fontSize: '11px',
                                fontWeight: 600, background: '#FEE2E2', color: '#DC2626'
                            }}>
                                ⏱ Trễ {soPhutTre} phút
                            </span>
                        )}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--gray-600)', display: 'flex', gap: '16px' }}>
                        <span>🛤 Ray: <strong>{lichTrinh.maRay || '—'}</strong></span>
                        <span>🕐 Đến: <strong>{formatDT(lichTrinh.gioDenDuKien)}</strong></span>
                        <span>🕐 Đi: <strong>{formatDT(lichTrinh.gioDiDuKien)}</strong></span>
                    </div>
                </div>

                {/* Status badge */}
                <div style={{ marginLeft: '12px' }}>
                    {isHuyed ? (
                        <span style={{
                            padding: '4px 12px', borderRadius: '20px', fontSize: '11px',
                            fontWeight: 600, background: '#F3F4F6', color: '#6B7280',
                            border: '1px solid #D1D5DB'
                        }}>✖ Đã hủy</span>
                    ) : isDone ? (
                        <span style={{
                            padding: '4px 12px', borderRadius: '20px', fontSize: '11px',
                            fontWeight: 600, background: '#F0FDF4', color: '#16A34A',
                            border: '1px solid #86EFAC'
                        }}>✓ Đã đổi ray</span>
                    ) : (
                        <span style={{
                            padding: '4px 12px', borderRadius: '20px', fontSize: '11px',
                            fontWeight: 600, background: '#FEF2F2', color: '#DC2626',
                            border: '1px solid #FCA5A5'
                        }}>⚡ Cần xử lý</span>
                    )}
                </div>
            </div>

            {/* Action buttons — chỉ hiển thị khi chưa xử lý */}
            {!isHuyed && !isDone && (
                <div style={{
                    marginTop: '14px', paddingTop: '14px',
                    borderTop: '1px dashed #FCA5A5',
                    display: 'flex', gap: '10px', alignItems: 'center'
                }}>
                    <span style={{ fontSize: '11px', color: 'var(--gray-500)', marginRight: '4px' }}>
                        Chọn phương án:
                    </span>

                    {/* Nút Hủy chuyến */}
                    <button
                        onClick={onHuy}
                        disabled={isLoading}
                        style={{
                            padding: '7px 16px', borderRadius: '8px',
                            border: '1.5px solid #DC2626', background: 'white',
                            color: '#DC2626', fontSize: '12px', fontWeight: 600,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            transition: 'all 0.15s'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}
                    >
                        ❌ Hủy chuyến
                    </button>

                    {/* Divider */}
                    <span style={{ color: 'var(--gray-300)', fontSize: '18px' }}>|</span>

                    {/* Nút Điều phối ray */}
                    <button
                        onClick={onDieuPhoi}
                        disabled={isLoading}
                        style={{
                            padding: '7px 16px', borderRadius: '8px',
                            border: '1.5px solid var(--navy-500)',
                            background: 'var(--navy-600)', color: 'white',
                            fontSize: '12px', fontWeight: 600,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            transition: 'all 0.15s'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--navy-700)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--navy-600)'; }}
                    >
                        🔄 Điều phối ray →
                    </button>
                </div>
            )}
        </div>
    );
}
