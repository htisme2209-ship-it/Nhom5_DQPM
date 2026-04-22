import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { suCoAPI, lichTrinhAPI, duongRayAPI } from '../../services/api';

const MUC_DO_INFO = {
    THAP:      { label: 'Thấp',     time: '~30 phút',        color: '#16A34A', bg: '#F0FDF4', border: '#86EFAC', icon: '🟢' },
    TRUNG_BINH:{ label: 'Trung bình', time: '~60 phút',     color: '#D97706', bg: '#FFFBEB', border: '#FCD34D', icon: '🟡' },
    CAO:       { label: 'Cao',       time: 'Phong tỏa cứng', color: '#EA580C', bg: '#FFF7ED', border: '#FDBA74', icon: '🟠' },
    KHAN_CAP:  { label: 'Khẩn cấp', time: 'Phong tỏa cứng', color: '#DC2626', bg: '#FEF2F2', border: '#FCA5A5', icon: '🔴' },
};

export default function GhiNhanSuCoPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        maLichTrinh: '',
        maRay: '',
        loaiSuCo: 'SU_CO_KY_THUAT',
        moTa: '',
        mucDo: 'TRUNG_BINH',
        kichHoatPhongToa: false
    });

    const [lichTrinhs, setLichTrinhs] = useState([]);
    const [duongRays, setDuongRays] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    // Kết quả sau khi ghi nhận
    const [ghiNhanResult, setGhiNhanResult] = useState(null); // { suCo, lichTrinhBiAnhHuong }
    const [loadingResult, setLoadingResult] = useState(false);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [ltRes, rayRes] = await Promise.all([
                lichTrinhAPI.getAll(),
                duongRayAPI.getAll()
            ]);
            const lt = Array.isArray(ltRes.data) ? ltRes.data : (ltRes.data?.data || []);
            const ray = Array.isArray(rayRes.data) ? rayRes.data : (rayRes.data?.data || []);
            // Chỉ hiển thị lịch trình DA_XAC_NHAN để chọn
            setLichTrinhs(lt.filter(l => !l.trangThai || l.trangThai === 'DA_XAC_NHAN'));
            setDuongRays(ray);
        } catch (err) {
            console.error('Lỗi tải dữ liệu:', err);
        }
    };

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const validateForm = () => {
        if (!form.maRay) { showToast('Vui lòng chọn đường ray!', 'error'); return false; }
        if (!form.moTa.trim()) { showToast('Vui lòng nhập mô tả chi tiết!', 'error'); return false; }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            const res = await suCoAPI.ghiNhan({
                ...form,
                maSuCo: 'SC-' + Date.now(),
                ngayXayRa: new Date().toISOString()
            });
            const suCo = res.data?.data || res.data;
            showToast('Ghi nhận sự cố thành công! Đang tải danh sách lịch trình bị ảnh hưởng...');

            // Load lịch trình bị ảnh hưởng
            setLoadingResult(true);
            try {
                const ltRes = await suCoAPI.getLichTrinhAnhHuong(suCo.maSuCo);
                const lichTrinhBiAnhHuong = Array.isArray(ltRes.data) ? ltRes.data : (ltRes.data?.data || []);
                setGhiNhanResult({ suCo, lichTrinhBiAnhHuong });
            } catch (err) {
                // Không load được lịch trình — vẫn hiển thị kết quả
                setGhiNhanResult({ suCo, lichTrinhBiAnhHuong: [] });
            } finally {
                setLoadingResult(false);
            }
            resetForm();
        } catch (err) {
            showToast(err.response?.data?.message || err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm({ maLichTrinh: '', maRay: '', loaiSuCo: 'SU_CO_KY_THUAT', moTa: '', mucDo: 'TRUNG_BINH', kichHoatPhongToa: false });
    };

    // Hủy một lịch trình ngay từ trang ghi nhận
    const handleHuyLichTrinh = async (lt) => {
        if (!confirm(`Xác nhận hủy chuyến ${lt.maChuyenTau}?`)) return;
        try {
            await suCoAPI.xuLyPhuongAn({ maLichTrinh: lt.maLichTrinh, phuongAn: 'HUY_CHUYEN', maRayMoi: null });
            showToast(`Đã hủy chuyến ${lt.maChuyenTau}`);
            setGhiNhanResult(prev => ({
                ...prev,
                lichTrinhBiAnhHuong: prev.lichTrinhBiAnhHuong.map(
                    l => l.maLichTrinh === lt.maLichTrinh ? { ...l, phuongAnXuLy: 'HUY_CHUYEN' } : l
                )
            }));
        } catch (err) {
            showToast(err.response?.data?.message || err.message, 'error');
        }
    };

    // Chuyển sang điều phối ray
    const handleDieuPhoiRay = (lt) => {
        const params = new URLSearchParams({
            suCoId: ghiNhanResult.suCo.maSuCo,
            lichTrinhIds: lt.maLichTrinh
        });
        navigate(`/nha-ga/dieu-hanh/duong-ray?${params.toString()}`);
        // Hoặc điều hướng đến XuLySuCoPage để NVĐH xử lý
    };

    // Chuyển toàn bộ sang XuLySuCoPage (điều hành xử lý)
    const handleChuyenDieuHanh = () => {
        navigate('/dieu-hanh/xu-ly-su-co');
    };

    const mucDoInfo = MUC_DO_INFO[form.mucDo] || MUC_DO_INFO.TRUNG_BINH;

    const formatTime = (dtStr) => {
        if (!dtStr) return '--:--';
        const d = new Date(dtStr);
        return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    };

    return (
        <>
            {/* Toast */}
            {toast && (
                <div className="toast-container">
                    <div className={`toast ${toast.type}`}>
                        {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
                    </div>
                </div>
            )}

            {/* Page Header */}
            <div className="page-header">
                <div className="page-header-actions">
                    <div>
                        <p style={{ fontSize: '11px', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            UC-09: GHI NHẬN SỰ CỐ
                        </p>
                        <h1>Ghi Nhận Sự Cố Tại Nhà Ga</h1>
                        <p>Báo cáo sự cố xảy ra tại đường ray và lịch trình tàu</p>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                KẾT QUẢ SAU KHI GHI NHẬN SỰ CỐ
            ══════════════════════════════════════════ */}
            {ghiNhanResult && (
                <div style={{ marginBottom: '24px' }}>
                    {/* Banner thành công */}
                    <div style={{
                        background: '#F0FDF4', border: '1.5px solid #86EFAC',
                        borderRadius: 'var(--radius-md)', padding: '16px 20px',
                        display: 'flex', alignItems: 'start', gap: '14px', marginBottom: '16px'
                    }}>
                        <span style={{ fontSize: '28px' }}>✅</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: '15px', color: '#15803D', marginBottom: '4px' }}>
                                Đã ghi nhận sự cố: <strong>{ghiNhanResult.suCo.maSuCo}</strong>
                            </div>
                            <div style={{ fontSize: '13px', color: '#166534' }}>
                                Hệ thống đã tự động phong tỏa đường ray và quét
                                {' '}{ghiNhanResult.lichTrinhBiAnhHuong.length} lịch trình bị ảnh hưởng.
                                Nhân viên Điều hành sẽ xử lý tiếp theo.
                            </div>
                        </div>
                        <button
                            onClick={() => setGhiNhanResult(null)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#6B7280' }}
                        >×</button>
                    </div>

                    {/* Thông tin sự cố vừa tạo */}
                    <div className="card" style={{ marginBottom: '16px' }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-200)', fontWeight: 600, fontSize: '13px' }}>
                            THÔNG TIN SỰ CỐ VỪA GHI NHẬN
                        </div>
                        <div style={{ padding: '16px 20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                                {[
                                    { label: 'MÃ SỰ CỐ', value: ghiNhanResult.suCo.maSuCo },
                                    { label: 'ĐƯỜNG RAY', value: ghiNhanResult.suCo.maRay },
                                    { label: 'LOẠI SỰ CỐ', value: ghiNhanResult.suCo.loaiSuCo },
                                    { label: 'MỨC ĐỘ', value: ghiNhanResult.suCo.mucDo },
                                ].map(({ label, value }) => (
                                    <div key={label}>
                                        <div style={{ fontSize: '10px', color: 'var(--gray-500)', fontWeight: 600, marginBottom: '4px' }}>{label}</div>
                                        <div style={{ fontWeight: 700, fontSize: '14px' }}>{value || '—'}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Lịch trình bị ảnh hưởng */}
                    <div className="card">
                        <div style={{
                            padding: '14px 20px', borderBottom: '1px solid var(--gray-200)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--gray-700)' }}>
                                    LỊCH TRÌNH BỊ ẢNH HƯỞNG ({ghiNhanResult.lichTrinhBiAnhHuong.length})
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '2px' }}>
                                    Nhân viên Điều hành sẽ xử lý phương án — hủy chuyến hoặc đổi ray
                                </div>
                            </div>
                            {/* Nút chuyển cho điều hành xử lý */}
                            <button
                                onClick={handleChuyenDieuHanh}
                                style={{
                                    padding: '8px 18px', borderRadius: '8px', border: 'none',
                                    background: 'var(--navy-600)', color: 'white',
                                    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '6px'
                                }}
                            >
                                🔧 Chuyển Điều hành xử lý →
                            </button>
                        </div>

                        <div style={{ padding: '20px' }}>
                            {loadingResult ? (
                                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--gray-500)' }}>⏳ Đang tải...</div>
                            ) : ghiNhanResult.lichTrinhBiAnhHuong.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '32px', color: 'var(--gray-500)' }}>
                                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>📋</div>
                                    <div style={{ fontSize: '13px' }}>
                                        Không có lịch trình nào bị ảnh hưởng trực tiếp.<br />
                                        Nhân viên Điều hành sẽ theo dõi và xử lý nếu cần.
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {ghiNhanResult.lichTrinhBiAnhHuong.map(lt => {
                                        const isHuyed = lt.phuongAnXuLy === 'HUY_CHUYEN';
                                        return (
                                            <div key={lt.maLichTrinh} style={{
                                                border: isHuyed ? '1px solid #E5E7EB' : '1px solid #FCA5A5',
                                                borderRadius: 'var(--radius-md)', padding: '14px 18px',
                                                background: isHuyed ? '#F9FAFB' : 'white',
                                                opacity: isHuyed ? 0.65 : 1
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                                            <span style={{ fontWeight: 700, fontSize: '14px' }}>{lt.maLichTrinh}</span>
                                                            <span style={{ fontSize: '12px', color: 'var(--gray-500)' }}>—</span>
                                                            <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--navy-600)' }}>{lt.maChuyenTau}</span>
                                                        </div>
                                                        <div style={{ fontSize: '12px', color: 'var(--gray-600)', display: 'flex', gap: '14px' }}>
                                                            <span>🛤 Ray: <strong>{lt.maRay}</strong></span>
                                                            <span>🕐 {formatTime(lt.gioDenDuKien)} → {formatTime(lt.gioDiDuKien)}</span>
                                                        </div>
                                                    </div>
                                                    {isHuyed ? (
                                                        <span style={{
                                                            padding: '4px 12px', borderRadius: '20px', fontSize: '11px',
                                                            fontWeight: 600, background: '#F3F4F6', color: '#6B7280', border: '1px solid #D1D5DB'
                                                        }}>✖ Đã hủy</span>
                                                    ) : (
                                                        <span style={{
                                                            padding: '4px 12px', borderRadius: '20px', fontSize: '11px',
                                                            fontWeight: 600, background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5'
                                                        }}>⚡ Cần xử lý</span>
                                                    )}
                                                </div>

                                                {/* Action buttons — chỉ khi chưa xử lý, nhân viên nhà ga có thể hủy ngay */}
                                                {!isHuyed && (
                                                    <div style={{
                                                        marginTop: '12px', paddingTop: '12px',
                                                        borderTop: '1px dashed #FCA5A5',
                                                        display: 'flex', gap: '10px', alignItems: 'center'
                                                    }}>
                                                        <span style={{ fontSize: '11px', color: 'var(--gray-500)' }}>Xử lý nhanh:</span>
                                                        <button
                                                            onClick={() => handleHuyLichTrinh(lt)}
                                                            style={{
                                                                padding: '5px 14px', borderRadius: '8px',
                                                                border: '1.5px solid #DC2626', background: 'white',
                                                                color: '#DC2626', fontSize: '12px', fontWeight: 600, cursor: 'pointer'
                                                            }}
                                                        >
                                                            ❌ Hủy chuyến
                                                        </button>
                                                        <span style={{ color: 'var(--gray-300)', fontSize: '16px' }}>|</span>
                                                        <span style={{ fontSize: '11px', color: 'var(--gray-500)' }}>
                                                            hoặc chờ Điều hành đổi ray
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ghi nhận sự cố mới */}
                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                        <button className="btn btn-secondary" onClick={() => setGhiNhanResult(null)}>
                            + Ghi nhận sự cố mới
                        </button>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════
                FORM GHI NHẬN (ẩn khi đã có kết quả)
            ══════════════════════════════════════════ */}
            {!ghiNhanResult && (
                <>
                    {/* Info banner */}
                    <div className="card" style={{ marginBottom: '20px', background: 'var(--navy-50)', border: '1px solid var(--navy-200)' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                            <div style={{ fontSize: '24px' }}>ℹ️</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, color: 'var(--navy-700)', marginBottom: '4px' }}>
                                    Quy trình tự động sau khi ghi nhận
                                </div>
                                <div style={{ fontSize: '13px', color: 'var(--navy-600)', lineHeight: '1.6' }}>
                                    <strong>(1)</strong> Phong tỏa đường ray theo mức độ sự cố →{' '}
                                    <strong>(2)</strong> Quét và gắn thẻ lịch trình bị ảnh hưởng →{' '}
                                    <strong>(3)</strong> Nhân viên Điều hành xử lý: hủy chuyến hoặc đổi sang ray khác
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="card">
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">LỊCH TRÌNH (Tùy chọn)</label>
                                    <select
                                        className="form-control"
                                        value={form.maLichTrinh}
                                        onChange={e => setForm({ ...form, maLichTrinh: e.target.value })}
                                    >
                                        <option value="">-- Không liên quan đến lịch trình cụ thể --</option>
                                        {lichTrinhs.map(lt => (
                                            <option key={lt.maLichTrinh} value={lt.maLichTrinh}>
                                                {lt.maLichTrinh} — {lt.maChuyenTau} (Ray {lt.maRay})
                                            </option>
                                        ))}
                                    </select>
                                    <small style={{ color: 'var(--gray-500)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                                        Chỉ chọn nếu sự cố liên quan trực tiếp đến một lịch trình cụ thể
                                    </small>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">ĐƯỜNG RAY <span style={{ color: 'var(--red-500)' }}>*</span></label>
                                    <select
                                        className="form-control"
                                        value={form.maRay}
                                        onChange={e => setForm({ ...form, maRay: e.target.value })}
                                        required
                                    >
                                        <option value="">-- Chọn đường ray --</option>
                                        {duongRays.map(ray => (
                                            <option key={ray.maRay} value={ray.maRay}>
                                                {ray.maRay} — Ray {ray.soRay} ({ray.trangThai === 'SAN_SANG' ? '✅ Sẵn sàng' : '⚠️ ' + ray.trangThai})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">LOẠI SỰ CỐ</label>
                                    <select
                                        className="form-control"
                                        value={form.loaiSuCo}
                                        onChange={e => setForm({ ...form, loaiSuCo: e.target.value })}
                                    >
                                        <option value="SU_CO_KY_THUAT">Sự cố kỹ thuật</option>
                                        <option value="SU_CO_TAU">Sự cố tàu</option>
                                        <option value="SU_CO_DUONG_RAY">Sự cố đường ray</option>
                                        <option value="MAT_LIEN_LAC">Mất liên lạc</option>
                                        <option value="KHAC">Khác</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">MỨC ĐỘ</label>
                                    <select
                                        className="form-control"
                                        value={form.mucDo}
                                        onChange={e => setForm({ ...form, mucDo: e.target.value })}
                                    >
                                        <option value="THAP">🟢 Thấp (~30 phút)</option>
                                        <option value="TRUNG_BINH">🟡 Trung bình (~60 phút)</option>
                                        <option value="CAO">🟠 Cao (Phong tỏa cứng)</option>
                                        <option value="KHAN_CAP">🔴 Khẩn cấp (Phong tỏa cứng)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Mức độ info */}
                            <div style={{
                                padding: '12px 16px', background: mucDoInfo.bg,
                                border: `1px solid ${mucDoInfo.border}`, borderRadius: 'var(--radius)',
                                marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'
                            }}>
                                <span style={{ fontSize: '18px' }}>{mucDoInfo.icon}</span>
                                <div style={{ fontSize: '13px', color: 'var(--gray-700)' }}>
                                    <strong>Mức độ {mucDoInfo.label}:</strong> Thời gian xử lý ước tính {mucDoInfo.time}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">MÔ TẢ CHI TIẾT <span style={{ color: 'var(--red-500)' }}>*</span></label>
                                <textarea
                                    className="form-control"
                                    value={form.moTa}
                                    onChange={e => setForm({ ...form, moTa: e.target.value })}
                                    rows="4"
                                    placeholder="Mô tả chi tiết sự cố, vị trí, tình trạng hiện tại..."
                                    required
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            {/* Checkbox phong tỏa cứng */}
                            <div style={{
                                padding: '14px 16px', background: '#FFFBEB',
                                border: '1px solid #FCD34D', borderRadius: 'var(--radius)', marginBottom: '20px'
                            }}>
                                <label style={{ display: 'flex', alignItems: 'start', gap: '12px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={form.kichHoatPhongToa}
                                        onChange={e => setForm({ ...form, kichHoatPhongToa: e.target.checked })}
                                        style={{ marginTop: '2px' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--gray-800)' }}>
                                            ⚠️ Kích hoạt phong tỏa cứng ngay lập tức
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--gray-600)', marginTop: '4px' }}>
                                            Bỏ qua kết quả tự động và phong tỏa cứng đường ray ngay lập tức (dùng khi tình huống khẩn cấp)
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {/* Form Actions */}
                            <div className="modal-footer" style={{ padding: '16px 0 0', borderTop: '1px solid var(--gray-200)' }}>
                                <button type="button" className="btn btn-secondary" onClick={resetForm} disabled={loading}>
                                    🔄 Làm mới
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? '⏳ Đang xử lý...' : '📝 Ghi nhận sự cố'}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </>
    );
}
