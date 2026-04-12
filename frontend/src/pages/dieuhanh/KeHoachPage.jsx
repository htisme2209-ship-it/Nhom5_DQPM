import { useState, useEffect } from 'react';
import { keHoachAPI } from '../../services/api';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';

export default function KeHoachPage() {
  const { user } = useAuth();
  const [keHoach, setKeHoach] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [toast, setToast] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [form, setForm] = useState({
    maKeHoach: '', tieuDe: '', noiDung: '', loaiKeHoach: 'DIEU_CHINH_LICH',
    mucDoUuTien: 'TRUNG_BINH', ngayBatDau: '', ngayKetThuc: ''
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await keHoachAPI.getAll();
      setKeHoach(res.data.data || res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000);
  };

  const openCreate = () => {
    setForm({
      maKeHoach: 'KH' + Date.now().toString().slice(-6),
      tieuDe: '', noiDung: '', loaiKeHoach: 'DIEU_CHINH_LICH',
      mucDoUuTien: 'TRUNG_BINH',
      ngayBatDau: new Date().toISOString().split('T')[0],
      ngayKetThuc: ''
    });
    setShowForm(true);
  };

  const handleCreate = async () => {
    if (!form.tieuDe || !form.noiDung) { showToast('Vui lòng nhập đầy đủ', 'error'); return; }
    setFormLoading(true);
    try {
      await keHoachAPI.create({
        ...form, maNguoiGui: user?.maTaiKhoan,
        ngayBatDau: form.ngayBatDau + 'T00:00:00',
        ngayKetThuc: form.ngayKetThuc ? form.ngayKetThuc + 'T23:59:59' : null
      });
      showToast('Gửi kế hoạch phê duyệt thành công!');
      setShowForm(false); loadData();
    } catch (e) { showToast(e.response?.data?.message || 'Lỗi khi gửi', 'error'); }
    finally { setFormLoading(false); }
  };

  const handleApprove = async (kh, approved) => {
    try {
      await keHoachAPI.pheDuyet(kh.maKeHoach, {
        trangThai: approved ? 'DA_PHE_DUYET' : 'TU_CHOI',
        maNguoiPheDuyet: user?.maTaiKhoan,
        lyDoTuChoi: approved ? null : 'Từ chối bởi quản lý'
      });
      showToast(approved ? 'Đã phê duyệt kế hoạch!' : 'Đã từ chối kế hoạch');
      setShowDetail(null); loadData();
    } catch (e) { showToast('Lỗi khi xử lý', 'error'); }
  };

  const ttMap = {
    'CHO_PHE_DUYET': { label: 'Chờ phê duyệt', cls: 'badge-warning' },
    'DA_PHE_DUYET': { label: 'Đã phê duyệt', cls: 'badge-success' },
    'TU_CHOI': { label: 'Từ chối', cls: 'badge-danger' },
  };

  const isQuanLy = user?.quyenTruyCap === 'BAN_QUAN_LY';

  return (
    <>
      {toast && <div className="toast-container"><div className={`toast ${toast.type}`}>{toast.type === 'success' ? '✅' : '❌'} {toast.msg}</div></div>}

      <div className="page-header">
        <div className="page-header-actions">
          <div>
            <h1>{isQuanLy ? 'Phê duyệt Kế hoạch' : 'Kế hoạch Đặc biệt'}</h1>
            <p>{isQuanLy ? 'Xem xét và phê duyệt các kế hoạch đặc biệt' : 'Tạo và theo dõi kế hoạch đặc biệt'}</p>
          </div>
          {!isQuanLy && <button className="btn btn-primary" onClick={openCreate}>📝 Tạo kế hoạch mới</button>}
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card orange">
          <div className="stat-info"><div className="stat-label">Chờ duyệt</div><div className="stat-value">{keHoach.filter(k => k.trangThai === 'CHO_PHE_DUYET').length}</div></div>
          <div className="stat-icon">⏳</div>
        </div>
        <div className="stat-card green">
          <div className="stat-info"><div className="stat-label">Đã duyệt</div><div className="stat-value">{keHoach.filter(k => k.trangThai === 'DA_PHE_DUYET').length}</div></div>
          <div className="stat-icon">✅</div>
        </div>
        <div className="stat-card red">
          <div className="stat-info"><div className="stat-label">Từ chối</div><div className="stat-value">{keHoach.filter(k => k.trangThai === 'TU_CHOI').length}</div></div>
          <div className="stat-icon">❌</div>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead><tr><th>Mã</th><th>Tiêu đề</th><th>Loại</th><th>Ưu tiên</th><th>Ngày bắt đầu</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
            <tbody>
              {keHoach.map(kh => {
                const tt = ttMap[kh.trangThai] || { label: kh.trangThai, cls: 'badge-gray' };
                return (
                  <tr key={kh.maKeHoach}>
                    <td className="font-bold">{kh.maKeHoach}</td>
                    <td>{kh.tieuDe}</td>
                    <td className="text-sm">{kh.loaiKeHoach}</td>
                    <td><span className={`badge ${kh.mucDoUuTien === 'KHAN_CAP' ? 'badge-danger' : kh.mucDoUuTien === 'CAO' ? 'badge-warning' : 'badge-info'}`}>{kh.mucDoUuTien}</span></td>
                    <td className="text-sm">{kh.ngayBatDau ? new Date(kh.ngayBatDau).toLocaleDateString('vi-VN') : '---'}</td>
                    <td><span className={`badge ${tt.cls}`}>{tt.label}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => setShowDetail(kh)}>👁️ Xem</button>
                        {isQuanLy && kh.trangThai === 'CHO_PHE_DUYET' && (
                          <>
                            <button className="btn btn-success btn-sm" onClick={() => handleApprove(kh, true)}>✅</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleApprove(kh, false)}>❌</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Tạo Kế hoạch Đặc biệt" subtitle="Gửi kế hoạch tới Ban Quản lý phê duyệt" size="md">
        <div className="form-group">
          <label className="form-label">TIÊU ĐỀ</label>
          <input className="form-control" placeholder="Tiêu đề kế hoạch..."
            value={form.tieuDe} onChange={(e) => setForm({...form, tieuDe: e.target.value})} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">LOẠI KẾ HOẠCH</label>
            <select className="form-control" value={form.loaiKeHoach}
              onChange={(e) => setForm({...form, loaiKeHoach: e.target.value})}>
              <option value="DIEU_CHINH_LICH">Điều chỉnh lịch</option>
              <option value="BAO_TRI">Bảo trì</option>
              <option value="SU_KIEN">Sự kiện đặc biệt</option>
              <option value="KHAN_CAP">Khẩn cấp</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">MỨC ĐỘ ƯU TIÊN</label>
            <select className="form-control" value={form.mucDoUuTien}
              onChange={(e) => setForm({...form, mucDoUuTien: e.target.value})}>
              <option value="THAP">Thấp</option>
              <option value="TRUNG_BINH">Trung bình</option>
              <option value="CAO">Cao</option>
              <option value="KHAN_CAP">Khẩn cấp</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">NGÀY BẮT ĐẦU</label>
            <input type="date" className="form-control" value={form.ngayBatDau}
              onChange={(e) => setForm({...form, ngayBatDau: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">NGÀY KẾT THÚC</label>
            <input type="date" className="form-control" value={form.ngayKetThuc}
              onChange={(e) => setForm({...form, ngayKetThuc: e.target.value})} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">NỘI DUNG CHI TIẾT</label>
          <textarea className="form-control" rows="5" placeholder="Mô tả chi tiết kế hoạch..."
            value={form.noiDung} onChange={(e) => setForm({...form, noiDung: e.target.value})} />
        </div>
        <div className="modal-footer" style={{ padding: '16px 0 0', borderTop: '1px solid var(--gray-200)' }}>
          <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Hủy</button>
          <button className="btn btn-primary" onClick={handleCreate} disabled={formLoading}>
            {formLoading ? '⏳' : '📤 Gửi phê duyệt'}
          </button>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={!!showDetail} onClose={() => setShowDetail(null)} title="Chi tiết Kế hoạch" subtitle={showDetail?.maKeHoach} size="md">
        {showDetail && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <div className="flex-between">
                <span className={`badge ${(ttMap[showDetail.trangThai] || {}).cls}`}>{(ttMap[showDetail.trangThai] || {}).label}</span>
                <span className={`badge ${showDetail.mucDoUuTien === 'KHAN_CAP' ? 'badge-danger' : 'badge-info'}`}>{showDetail.mucDoUuTien}</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginTop: '12px', color: 'var(--navy-800)' }}>{showDetail.tieuDe}</h3>
              <p className="text-sm text-muted" style={{ marginTop: '4px' }}>Loại: {showDetail.loaiKeHoach}</p>
            </div>
            <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius)', padding: '16px', whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: 1.7 }}>
              {showDetail.noiDung}
            </div>
            {isQuanLy && showDetail.trangThai === 'CHO_PHE_DUYET' && (
              <div className="modal-footer" style={{ padding: '16px 0 0', borderTop: '1px solid var(--gray-200)', marginTop: '16px' }}>
                <button className="btn btn-danger" onClick={() => handleApprove(showDetail, false)}>❌ Từ chối</button>
                <button className="btn btn-success" onClick={() => handleApprove(showDetail, true)}>✅ Phê duyệt</button>
              </div>
            )}
          </>
        )}
      </Modal>
    </>
  );
}
