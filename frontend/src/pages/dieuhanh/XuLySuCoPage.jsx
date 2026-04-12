import { useState, useEffect } from 'react';
import { suCoAPI, duongRayAPI } from '../../services/api';

export default function XuLySuCoPage() {
    const [suCos, setSuCos] = useState([]);
    const [selectedSuCo, setSelectedSuCo] = useState(null);
    const [lichTrinhBiAnhHuong, setLichTrinhBiAnhHuong] = useState([]);
    const [duongRays, setDuongRays] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    // Modal states
    const [showTreChuyenModal, setShowTreChuyenModal] = useState(false);
    const [selectedLichTrinh, setSelectedLichTrinh] = useState(null);
    const [treChuyenForm, setTreChuyenForm] = useState({
        soPhutTre: 0,
        lyDo: ''
    });

    useEffect(() => {
        loadSuCos();
        loadDuongRays();
    }, []);

    const loadSuCos = async () => {
        try {
            const res = await suCoAPI.getAll();
            const suCoData = Array.isArray(res.data) ? res.data :
                Array.isArray(res.data?.data) ? res.data.data : [];
            setSuCos(suCoData);
        } catch (error) {
            console.error('Lỗi tải sự cố:', error);
            setSuCos([]);
        }
    };

    const loadDuongRays = async () => {
        try {
            const res = await duongRayAPI.getAll();
            const rayData = Array.isArray(res.data) ? res.data :
                Array.isArray(res.data?.data) ? res.data.data : [];
            setDuongRays(rayData);
        } catch (error) {
            console.error('Lỗi tải đường ray:', error);
            setDuongRays([]);
        }
    };

    const loadLichTrinhBiAnhHuong = async (maSuCo) => {
        try {
            const res = await suCoAPI.getLichTrinhAnhHuong(maSuCo);
            const ltData = Array.isArray(res.data) ? res.data :
                Array.isArray(res.data?.data) ? res.data.data : [];
            setLichTrinhBiAnhHuong(ltData);
        } catch (error) {
            console.error('Lỗi tải lịch trình:', error);
            setLichTrinhBiAnhHuong([]);
            showToast(error.response?.data?.message || error.message, 'error');
        }
    };

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSelectSuCo = (suCo) => {
        setSelectedSuCo(suCo);
        loadLichTrinhBiAnhHuong(suCo.maSuCo);
    };

    const handleXuLyPhuongAn = async (lichTrinh, phuongAn, maRayMoi = null) => {
        setLoading(true);
        try {
            await suCoAPI.xuLyPhuongAn({
                maLichTrinh: lichTrinh.maLichTrinh,
                phuongAn,
                maRayMoi
            });
            showToast('Xử lý phương án thành công!');
            loadLichTrinhBiAnhHuong(selectedSuCo.maSuCo);
        } catch (error) {
            showToast(error.response?.data?.message || error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleGiaiPhongRay = async () => {
        if (!selectedSuCo) return;

        if (!confirm('Bạn có chắc muốn giải phóng đường ray? Tất cả lịch trình phải đã được xử lý.')) return;

        setLoading(true);
        try {
            await suCoAPI.giaiPhongRay({
                maRay: selectedSuCo.maRay,
                maSuCo: selectedSuCo.maSuCo
            });
            showToast('Giải phóng ray thành công!');
            loadSuCos();
            setSelectedSuCo(null);
            setLichTrinhBiAnhHuong([]);
        } catch (error) {
            showToast(error.response?.data?.message || error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const openTreChuyenModal = (lichTrinh) => {
        setSelectedLichTrinh(lichTrinh);
        setTreChuyenForm({
            soPhutTre: lichTrinh.soPhutTre || 0,
            lyDo: ''
        });
        setShowTreChuyenModal(true);
    };

    const handleXuLyTreChuyen = async () => {
        if (!treChuyenForm.lyDo.trim()) {
            showToast('Vui lòng nhập lý do trễ chuyến', 'error');
            return;
        }

        setLoading(true);
        try {
            await suCoAPI.xuLyTreChuyen({
                maLichTrinh: selectedLichTrinh.maLichTrinh,
                soPhutTre: parseInt(treChuyenForm.soPhutTre),
                lyDo: treChuyenForm.lyDo
            });
            showToast('Xử lý trễ chuyến thành công!');
            setShowTreChuyenModal(false);
            loadLichTrinhBiAnhHuong(selectedSuCo.maSuCo);
        } catch (error) {
            showToast(error.response?.data?.message || error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleThuHoiLenh = async (lichTrinh) => {
        const lyDo = prompt('Nhập lý do thu hồi lệnh:');
        if (!lyDo) return;

        setLoading(true);
        try {
            await suCoAPI.thuHoiLenh({
                maLichTrinh: lichTrinh.maLichTrinh,
                lyDo
            });
            showToast('Thu hồi lệnh thành công!');
            loadLichTrinhBiAnhHuong(selectedSuCo.maSuCo);
        } catch (error) {
            showToast(error.response?.data?.message || error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const suCoChuaXuLy = suCos.filter(sc => sc.trangThaiXuLy !== 'DA_XU_LY');

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
                        <p style={{
                            fontSize: '11px',
                            color: 'var(--gray-500)',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            UC-06: XỬ LÝ SỰ CỐ
                        </p>
                        <h1>Điều Hành và Xử Lý Sự Cố</h1>
                        <p>Quản lý phương án xử lý cho lịch trình bị ảnh hưởng</p>
                    </div>
                    {selectedSuCo && (
                        <button
                            className="btn btn-primary"
                            onClick={handleGiaiPhongRay}
                            disabled={loading}
                        >
                            🔓 Giải phóng ray
                        </button>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px' }}>
                {/* Sidebar - Danh sách sự cố */}
                <div className="card" style={{ height: 'fit-content' }}>
                    <div style={{
                        padding: '16px',
                        borderBottom: '1px solid var(--gray-200)',
                        fontWeight: 600,
                        fontSize: '13px',
                        color: 'var(--gray-700)'
                    }}>
                        SỰ CỐ ĐANG XỬ LÝ ({suCoChuaXuLy.length})
                    </div>
                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        {suCoChuaXuLy.length === 0 ? (
                            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--gray-500)' }}>
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                                <div style={{ fontSize: '13px' }}>Không có sự cố nào</div>
                            </div>
                        ) : (
                            suCoChuaXuLy.map(suCo => (
                                <div
                                    key={suCo.maSuCo}
                                    onClick={() => handleSelectSuCo(suCo)}
                                    style={{
                                        padding: '16px',
                                        borderBottom: '1px solid var(--gray-200)',
                                        cursor: 'pointer',
                                        background: selectedSuCo?.maSuCo === suCo.maSuCo ? 'var(--navy-50)' : 'transparent',
                                        borderLeft: selectedSuCo?.maSuCo === suCo.maSuCo ? '3px solid var(--navy-500)' : '3px solid transparent',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (selectedSuCo?.maSuCo !== suCo.maSuCo) {
                                            e.currentTarget.style.background = 'var(--gray-50)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedSuCo?.maSuCo !== suCo.maSuCo) {
                                            e.currentTarget.style.background = 'transparent';
                                        }
                                    }}
                                >
                                    <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>
                                        {suCo.maSuCo}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--gray-600)', marginBottom: '8px' }}>
                                        Ray: {suCo.maRay}
                                    </div>
                                    <div>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            background: suCo.mucDo === 'KHAN_CAP' ? 'var(--red-100)' :
                                                suCo.mucDo === 'CAO' ? 'var(--orange-100)' :
                                                    'var(--yellow-100)',
                                            color: suCo.mucDo === 'KHAN_CAP' ? 'var(--red-600)' :
                                                suCo.mucDo === 'CAO' ? 'var(--orange-500)' :
                                                    'var(--yellow-500)'
                                        }}>
                                            {suCo.mucDo}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Content - Chi tiết sự cố */}
                <div>
                    {selectedSuCo ? (
                        <>
                            {/* Cảnh báo vận hành khẩn cấp */}
                            {selectedSuCo.loaiSuCo === 'MAT_LIEN_LAC' && (
                                <div style={{
                                    background: '#FEE2E2',
                                    border: '2px solid #DC2626',
                                    borderRadius: 'var(--radius-md)',
                                    padding: '20px',
                                    marginBottom: '20px',
                                    display: 'flex',
                                    alignItems: 'start',
                                    gap: '16px'
                                }}>
                                    <div style={{ fontSize: '32px' }}>🚨</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: '16px', color: '#991B1B', marginBottom: '8px' }}>
                                            CHẾ ĐỘ VẬN HÀNH KHẨN CẤP
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#991B1B', lineHeight: '1.6' }}>
                                            Tàu mất liên lạc {'>'}10 phút. Áp dụng quy trình khẩn cấp theo
                                            <strong> Thông tư 15/2023/TT-GTVT</strong> và
                                            <strong> QCVN 07:2011/BGTVT</strong>.
                                            <br />
                                            Yêu cầu: Liên hệ ngay với nhà ga, kiểm tra camera giám sát,
                                            chuẩn bị phương án dự phòng.
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* ✅ FIX 1: Xoá 2 thẻ </div></div> thừa ở đây */}

                            {/* Thông tin sự cố */}
                            <div className="card" style={{ marginBottom: '20px' }}>
                                <div style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                                        <div>
                                            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>
                                                {selectedSuCo.maSuCo}
                                            </h2>
                                            <p style={{ fontSize: '13px', color: 'var(--gray-600)' }}>
                                                {selectedSuCo.moTa}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(4, 1fr)',
                                        gap: '16px',
                                        padding: '16px',
                                        background: 'var(--gray-50)',
                                        borderRadius: 'var(--radius)'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '11px', color: 'var(--gray-500)', marginBottom: '4px' }}>
                                                ĐƯỜNG RAY
                                            </div>
                                            <div style={{ fontWeight: 600, fontSize: '13px' }}>
                                                {selectedSuCo.maRay}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '11px', color: 'var(--gray-500)', marginBottom: '4px' }}>
                                                LOẠI SỰ CỐ
                                            </div>
                                            <div style={{ fontWeight: 600, fontSize: '13px' }}>
                                                {selectedSuCo.loaiSuCo}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '11px', color: 'var(--gray-500)', marginBottom: '4px' }}>
                                                MỨC ĐỘ
                                            </div>
                                            <div style={{ fontWeight: 600, fontSize: '13px' }}>
                                                {selectedSuCo.mucDo}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '11px', color: 'var(--gray-500)', marginBottom: '4px' }}>
                                                TRẠNG THÁI
                                            </div>
                                            <div style={{ fontWeight: 600, fontSize: '13px' }}>
                                                {selectedSuCo.trangThaiXuLy}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Lịch trình bị ảnh hưởng */}
                            <div className="card">
                                <div style={{
                                    padding: '16px 20px',
                                    borderBottom: '1px solid var(--gray-200)',
                                    fontWeight: 600,
                                    fontSize: '13px',
                                    color: 'var(--gray-700)'
                                }}>
                                    LỊCH TRÌNH BỊ ẢNH HƯỞNG ({lichTrinhBiAnhHuong.length})
                                </div>
                                <div style={{ padding: '20px' }}>
                                    {lichTrinhBiAnhHuong.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-500)' }}>
                                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📋</div>
                                            <div style={{ fontSize: '13px' }}>Không có lịch trình bị ảnh hưởng</div>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            {lichTrinhBiAnhHuong.map(lt => (
                                                <LichTrinhCard
                                                    key={lt.maLichTrinh}
                                                    lichTrinh={lt}
                                                    duongRays={duongRays}
                                                    onXuLy={handleXuLyPhuongAn}
                                                    onTreChuyen={openTreChuyenModal}
                                                    onThuHoiLenh={handleThuHoiLenh}
                                                    loading={loading}
                                                />
                                            ))}
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

            {/* Modal xử lý trễ chuyến */}
            {showTreChuyenModal && selectedLichTrinh && (
                <div className="confirm-overlay" onClick={() => setShowTreChuyenModal(false)}>
                    <div className="confirm-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                                ⏰ Xử lý Trễ chuyến
                            </h3>
                            <p style={{ fontSize: '13px', color: 'var(--gray-600)' }}>
                                Chuyến tàu: <strong>{selectedLichTrinh.maChuyenTau}</strong>
                            </p>
                        </div>

                        <div className="form-group" style={{ marginBottom: '16px' }}>
                            <label className="form-label">SỐ PHÚT TRỄ</label>
                            <input
                                type="number"
                                className="form-control"
                                value={treChuyenForm.soPhutTre}
                                onChange={(e) => setTreChuyenForm({
                                    ...treChuyenForm,
                                    soPhutTre: parseInt(e.target.value) || 0
                                })}
                                min="0"
                                style={{ fontSize: '16px', fontWeight: 600 }}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '16px' }}>
                            <label className="form-label">LÝ DO TRỄ <span style={{ color: 'var(--red-500)' }}>*</span></label>
                            <textarea
                                className="form-control"
                                value={treChuyenForm.lyDo}
                                onChange={(e) => setTreChuyenForm({
                                    ...treChuyenForm,
                                    lyDo: e.target.value
                                })}
                                rows="3"
                                placeholder="Nhập lý do trễ chuyến..."
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        {treChuyenForm.soPhutTre >= 20 && (
                            <div style={{
                                padding: '12px 16px',
                                background: '#FEE2E2',
                                border: '1px solid #DC2626',
                                borderRadius: 'var(--radius)',
                                marginBottom: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <span style={{ fontSize: '20px' }}>⚠️</span>
                                <div style={{ fontSize: '13px', color: '#991B1B' }}>
                                    <strong>Cảnh báo:</strong> Trễ {'>'}= 20 phút tại ga xuất phát.
                                    Cần thu hồi lệnh/giải phóng ray theo Thông tư 15/2023/TT-GTVT.
                                </div>
                            </div>
                            // ✅ FIX 2: Xoá thẻ </div> thừa ở đây
                        )}

                        <div className="confirm-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowTreChuyenModal(false)}
                                disabled={loading}
                            >
                                Hủy
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleXuLyTreChuyen}
                                disabled={loading || !treChuyenForm.lyDo.trim()}
                            >
                                {loading ? '⏳ Đang xử lý...' : '✓ Xác nhận'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function LichTrinhCard({ lichTrinh, duongRays, onXuLy, loading, onTreChuyen, onThuHoiLenh }) {
    const [showDoiRay, setShowDoiRay] = useState(false);
    const [maRayMoi, setMaRayMoi] = useState('');

    const handleDoiRay = () => {
        if (!maRayMoi) {
            alert('Vui lòng chọn ray mới!');
            return;
        }
        onXuLy(lichTrinh, 'DOI_RAY', maRayMoi);
        setShowDoiRay(false);
        setMaRayMoi('');
    };

    const getPhuongAnColor = (phuongAn) => {
        if (phuongAn === 'CHO_RAY') return { bg: 'var(--yellow-100)', color: 'var(--yellow-500)' };
        if (phuongAn === 'DOI_RAY') return { bg: 'var(--blue-100)', color: 'var(--blue-500)' };
        return { bg: 'var(--red-100)', color: 'var(--red-500)' };
    };

    const colors = getPhuongAnColor(lichTrinh.phuongAnXuLy);
    const soPhutTre = lichTrinh.soPhutTre || 0;
    const canThuHoiLenh = soPhutTre >= 20 && !lichTrinh.gioDiThucTe;

    return (
        <div style={{
            border: canThuHoiLenh ? '2px solid var(--red-500)' : '1px solid var(--gray-200)',
            borderRadius: 'var(--radius)',
            padding: '16px',
            background: canThuHoiLenh ? 'var(--red-50)' : 'var(--white)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                        {lichTrinh.maLichTrinh} - {lichTrinh.maChuyenTau}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--gray-600)' }}>
                        Ray: {lichTrinh.maRay} | Đến: {new Date(lichTrinh.gioDenDuKien).toLocaleString('vi-VN')} | Đi: {new Date(lichTrinh.gioDiDuKien).toLocaleString('vi-VN')}
                    </div>
                    {soPhutTre > 0 && (
                        <div style={{ marginTop: '4px' }}>
                            <span className="badge badge-danger" style={{ fontSize: '11px' }}>
                                Trễ {soPhutTre} phút
                            </span>
                        </div>
                    )}
                </div>
                <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 600,
                    background: colors.bg,
                    color: colors.color
                }}>
                    {lichTrinh.phuongAnXuLy}
                </span>
            </div>

            {canThuHoiLenh && (
                <div style={{
                    padding: '12px',
                    background: '#FEE2E2',
                    border: '1px solid #DC2626',
                    borderRadius: 'var(--radius)',
                    marginBottom: '12px',
                    fontSize: '12px',
                    color: '#991B1B'
                }}>
                    <strong>⚠️ Ngưỡng 20 phút:</strong> Tàu trễ {'>'}= 20 phút tại ga xuất phát.
                    Bắt buộc thu hồi lệnh theo quy định.
                </div>
                // ✅ FIX 3: Xoá thẻ </div> thừa ở đây
            )}

            {lichTrinh.phuongAnXuLy === 'CHO_RAY' && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => onTreChuyen(lichTrinh)}
                        disabled={loading}
                        className="btn btn-secondary"
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                        ⏰ Xử lý Trễ
                    </button>
                    <button
                        onClick={() => setShowDoiRay(!showDoiRay)}
                        disabled={loading}
                        className="btn btn-secondary"
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                        🔄 Đổi Ray
                    </button>
                    {canThuHoiLenh ? (
                        <button
                            onClick={() => onThuHoiLenh(lichTrinh)}
                            disabled={loading}
                            className="btn btn-danger"
                            style={{ fontSize: '12px', padding: '6px 12px', fontWeight: 700 }}
                        >
                            🚫 Thu hồi lệnh
                        </button>
                    ) : (
                        <button
                            onClick={() => onXuLy(lichTrinh, 'HUY_CHUYEN')}
                            disabled={loading}
                            className="btn btn-danger"
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                            ❌ Hủy Chuyến
                        </button>
                    )}
                </div>
            )}

            {showDoiRay && (
                <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    background: 'var(--gray-50)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--gray-200)'
                }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>CHỌN RAY MỚI</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <select
                            className="form-control"
                            value={maRayMoi}
                            onChange={(e) => setMaRayMoi(e.target.value)}
                            style={{ flex: 1, fontSize: '13px' }}
                        >
                            <option value="">-- Chọn ray --</option>
                            {duongRays.filter(r => r.maRay !== lichTrinh.maRay).map(ray => (
                                <option key={ray.maRay} value={ray.maRay}>
                                    {ray.maRay} - {ray.tenRay}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleDoiRay}
                            className="btn btn-primary"
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                            ✓ Xác nhận
                        </button>
                        <button
                            onClick={() => setShowDoiRay(false)}
                            className="btn btn-secondary"
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
