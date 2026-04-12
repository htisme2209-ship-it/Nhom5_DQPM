import { useState, useEffect } from 'react';
import { suCoAPI, lichTrinhAPI, duongRayAPI } from '../../services/api';

export default function GhiNhanSuCoPage() {
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
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [ltRes, rayRes] = await Promise.all([
                lichTrinhAPI.getAll(),
                duongRayAPI.getAll()
            ]);

            const lichTrinhData = Array.isArray(ltRes.data) ? ltRes.data :
                Array.isArray(ltRes.data?.data) ? ltRes.data.data : [];
            const rayData = Array.isArray(rayRes.data) ? rayRes.data :
                Array.isArray(rayRes.data?.data) ? rayRes.data.data : [];

            setLichTrinhs(lichTrinhData);
            setDuongRays(rayData);
        } catch (error) {
            console.error('Lỗi tải dữ liệu:', error);
            setLichTrinhs([]);
            setDuongRays([]);
        }
    };

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        // Tạo preview
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setImages(newImages);
        setImagePreviews(newPreviews);
    };

    const validateForm = () => {
        if (!form.maRay) {
            showToast('Vui lòng chọn đường ray!', 'error');
            return false;
        }
        if (!form.moTa.trim()) {
            showToast('Vui lòng nhập mô tả chi tiết!', 'error');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            await suCoAPI.ghiNhan({
                ...form,
                maSuCo: 'SC-' + Date.now(),
                ngayXayRa: new Date().toISOString()
            });
            showToast('Ghi nhận sự cố thành công!');
            resetForm();
        } catch (error) {
            showToast(error.response?.data?.message || error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDraft = async () => {
        if (!form.maRay || !form.moTa.trim()) {
            showToast('Vui lòng điền ít nhất đường ray và mô tả để lưu nháp', 'error');
            return;
        }

        setLoading(true);
        try {
            await suCoAPI.luuNhap({
                ...form,
                maSuCo: 'SC-DRAFT-' + Date.now(),
                ngayXayRa: new Date().toISOString()
            });
            showToast('Đã lưu nháp sự cố');
            resetForm();
        } catch (error) {
            showToast(error.response?.data?.message || error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm({
            maLichTrinh: '',
            maRay: '',
            loaiSuCo: 'SU_CO_KY_THUAT',
            moTa: '',
            mucDo: 'TRUNG_BINH',
            kichHoatPhongToa: false
        });
        setImages([]);
        setImagePreviews([]);
    };

    const getMucDoInfo = (mucDo) => {
        const info = {
            THAP: { label: 'Thấp', time: '30 phút', color: 'var(--green-500)', bg: 'var(--green-100)' },
            TRUNG_BINH: { label: 'Trung bình', time: '60 phút', color: 'var(--orange-500)', bg: 'var(--orange-100)' },
            CAO: { label: 'Cao', time: 'Phong tỏa cứng', color: 'var(--red-500)', bg: 'var(--red-100)' },
            KHAN_CAP: { label: 'Khẩn cấp', time: 'Phong tỏa cứng', color: '#DC2626', bg: '#FEE2E2' }
        };
        return info[mucDo] || info.TRUNG_BINH;
    };

    const mucDoInfo = getMucDoInfo(form.mucDo);

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
                            UC-09: GHI NHẬN SỰ CỐ
                        </p>
                        <h1>Ghi Nhận Sự Cố Tại Nhà Ga</h1>
                        <p>Báo cáo sự cố xảy ra tại đường ray và lịch trình tàu</p>
                    </div>
                </div>
            </div>

            {/* Info Card */}
            <div className="card" style={{ marginBottom: '20px', background: 'var(--navy-50)', border: '1px solid var(--navy-200)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                    <div style={{ fontSize: '24px' }}>ℹ️</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: 'var(--navy-700)', marginBottom: '4px' }}>
                            Quy trình tự động
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--navy-600)', lineHeight: '1.6' }}>
                            Khi ghi nhận sự cố, hệ thống sẽ tự động: <strong>(1)</strong> Phong tỏa đường ray theo mức độ,
                            <strong> (2)</strong> Quét và gắn thẻ các lịch trình bị ảnh hưởng, <strong>(3)</strong> Thông báo đến Nhân viên Điều hành
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
                                onChange={(e) => setForm({ ...form, maLichTrinh: e.target.value })}
                            >
                                <option value="">-- Không liên quan đến lịch trình cụ thể --</option>
                                {lichTrinhs.map(lt => (
                                    <option key={lt.maLichTrinh} value={lt.maLichTrinh}>
                                        {lt.maLichTrinh} - {lt.maChuyenTau}
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
                                onChange={(e) => setForm({ ...form, maRay: e.target.value })}
                                required
                            >
                                <option value="">-- Chọn đường ray --</option>
                                {duongRays.map(ray => (
                                    <option key={ray.maRay} value={ray.maRay}>
                                        {ray.maRay} - {ray.tenRay}
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
                                onChange={(e) => setForm({ ...form, loaiSuCo: e.target.value })}
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
                                onChange={(e) => setForm({ ...form, mucDo: e.target.value })}
                            >
                                <option value="THAP">🟢 Thấp (30 phút)</option>
                                <option value="TRUNG_BINH">🟡 Trung bình (60 phút)</option>
                                <option value="CAO">🟠 Cao (Phong tỏa cứng)</option>
                                <option value="KHAN_CAP">🔴 Khẩn cấp (Phong tỏa cứng)</option>
                            </select>
                        </div>
                    </div>

                    {/* Mức độ info badge */}
                    <div style={{
                        padding: '12px 16px',
                        background: mucDoInfo.bg,
                        border: `1px solid ${mucDoInfo.color}`,
                        borderRadius: 'var(--radius)',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: mucDoInfo.color
                        }}></div>
                        <div style={{ fontSize: '13px', color: 'var(--gray-700)' }}>
                            <strong>Mức độ {mucDoInfo.label}:</strong> Thời gian ước tính {mucDoInfo.time}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">MÔ TẢ CHI TIẾT <span style={{ color: 'var(--red-500)' }}>*</span></label>
                        <textarea
                            className="form-control"
                            value={form.moTa}
                            onChange={(e) => setForm({ ...form, moTa: e.target.value })}
                            rows="4"
                            placeholder="Mô tả chi tiết sự cố, vị trí, tình trạng hiện tại..."
                            required
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    {/* Upload hình ảnh */}
                    <div className="form-group">
                        <label className="form-label">HÌNH ẢNH MINH CHỨNG (Tùy chọn)</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="form-control"
                            style={{ padding: '8px' }}
                        />
                        {imagePreviews.length > 0 && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                gap: '12px',
                                marginTop: '12px'
                            }}>
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} style={{ position: 'relative' }}>
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '120px',
                                                objectFit: 'cover',
                                                borderRadius: 'var(--radius)',
                                                border: '1px solid var(--gray-200)'
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            style={{
                                                position: 'absolute',
                                                top: '4px',
                                                right: '4px',
                                                background: 'var(--red-500)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '24px',
                                                height: '24px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <small style={{ color: 'var(--gray-500)', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                            Có thể chọn nhiều hình ảnh. Định dạng: JPG, PNG, GIF
                        </small>
                    </div>

                    {/* Checkbox phong tỏa cứng */}
                    <div style={{
                        padding: '16px',
                        background: 'var(--yellow-100)',
                        border: '1px solid var(--yellow-500)',
                        borderRadius: 'var(--radius)',
                        marginBottom: '20px'
                    }}>
                        <label style={{ display: 'flex', alignItems: 'start', gap: '12px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={form.kichHoatPhongToa}
                                onChange={(e) => setForm({ ...form, kichHoatPhongToa: e.target.checked })}
                                style={{ marginTop: '2px' }}
                            />
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--gray-800)' }}>
                                    Kích hoạt phong tỏa cứng ngay lập tức
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--gray-600)', marginTop: '4px' }}>
                                    Bỏ qua mức độ tự động và phong tỏa cứng đường ray ngay lập tức
                                </div>
                            </div>
                        </label>
                    </div>

                    {/* Form Actions */}
                    <div className="modal-footer" style={{ padding: '16px 0 0', borderTop: '1px solid var(--gray-200)' }}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={resetForm}
                            disabled={loading}
                        >
                            🔄 Làm mới
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleSaveDraft}
                            disabled={loading}
                            style={{ marginLeft: 'auto' }}
                        >
                            {loading ? '⏳ Đang lưu...' : '💾 Lưu nháp'}
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? '⏳ Đang xử lý...' : '📝 Ghi nhận sự cố'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
