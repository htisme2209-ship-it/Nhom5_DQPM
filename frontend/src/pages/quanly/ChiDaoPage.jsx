import { useState, useEffect } from 'react';
import { chiDaoAPI, taiKhoanAPI } from '../../services/api';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';

export default function ChiDaoPage() {
  const { user } = useAuth();
  const [chiDao, setChiDao] = useState([]);
  const [nhanVien, setNhanVien] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [form, setForm] = useState({
    maChiDao: '', maNguoiNhan: '', tieuDe: '', noiDung: '',
    mucDoUuTien: 'TRUNG_BINH'
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cdRes, nvRes] = await Promise.all([chiDaoAPI.getAll(), taiKhoanAPI.getAll()]);
      setChiDao(cdRes.data.data || cdRes.data || []);
      setNhanVien(nvRes.data.data || nvRes.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000);
  };

  const isManager = user?.quyenTruyCap === 'BAN_QUAN_LY';

  const openCreate = () => {
    setForm({
      maChiDao: 'CD' + Date.now().toString().slice(-6),
      maNguoiNhan: '', tieuDe: '', noiDung: '', mucDoUuTien: 'TRUNG_BINH'
    });
    setShowForm(true);
  };

  const handleCreate = async () => {
    if (!form.tieuDe || !form.noiDung || !form.maNguoiNhan) {
      showToast('Vui lòng nhập đầy đủ thông tin', 'error'); return;
    }
    setFormLoading(true);
    try {
      await chiDaoAPI.create({ ...form, maNguoiGui: user?.maTaiKhoan });
      showToast('Gửi chỉ đạo thành công!');
      setShowForm(false); loadData();
    } catch (e) { showToast(e.response?.data?.message || 'Lỗi khi gửi', 'error'); }
    finally { setFormLoading(false); }
  };

  const handleMarkRead = async (cd) => {
    try {
      await chiDaoAPI.markRead(cd.maChiDao);
      showToast('Đã đánh dấu đã đọc');
      loadData();
    } catch (e) { showToast('Lỗi', 'error'); }
  };

  const myDirectives = chiDao.filter(cd =>
    isManager ? cd.maNguoiGui === user?.maTaiKhoan : cd.maNguoiNhan === user?.maTaiKhoan
  );

  return (
    <>
      {toast && <div className="toast-container"><div className={`toast ${toast.type}`}>{toast.type === 'success' ? '✅' : '❌'} {toast.msg}</div></div>}

      <div className="page-header">
        <div className="page-header-actions">
          <div>
            <h1>{isManager ? 'Gửi Chỉ đạo Vận hành' : 'Chỉ đạo & Thông báo'}</h1>
            <p>{isManager ? 'Gửi chỉ đạo vận hành đến nhân viên' : 'Nhận và thực hiện chỉ đạo từ Ban Quản lý'}</p>
          </div>
          {isManager && <button className="btn btn-primary" onClick={openCreate}>📨 Gửi chỉ đạo mới</button>}
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card blue">
          <div className="stat-info"><div className="stat-label">Tổng chỉ đạo</div><div className="stat-value">{myDirectives.length}</div></div>
          <div className="stat-icon">📨</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-info"><div className="stat-label">Chưa đọc</div><div className="stat-value">{myDirectives.filter(c => c.trangThai === 'CHUA_DOC').length}</div></div>
          <div className="stat-icon">📬</div>
        </div>
        <div className="stat-card green">
          <div className="stat-info"><div className="stat-label">Đã thực hiện</div><div className="stat-value">{myDirectives.filter(c => c.trangThai === 'DA_DOC').length}</div></div>
          <div className="stat-icon">✅</div>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {myDirectives.length === 0 ? (
            <div className="text-center text-muted" style={{ padding: '60px' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>📭</div>
              Không có chỉ đạo nào
            </div>
          ) : myDirectives.map(cd => (
            <div key={cd.maChiDao} style={{
              padding: '20px', borderBottom: '1px solid var(--gray-100)',
              background: cd.trangThai === 'CHUA_DOC' ? 'var(--navy-50)' : 'var(--white)',
              cursor: 'pointer', transition: 'var(--transition)'
            }}>
              <div className="flex-between" style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className={`badge ${cd.mucDoUuTien === 'KHAN_CAP' ? 'badge-danger' : cd.mucDoUuTien === 'CAO' ? 'badge-warning' : 'badge-info'}`}>
                    {cd.mucDoUuTien === 'KHAN_CAP' ? '🔴 KHẨN CẤP' : cd.mucDoUuTien}
                  </span>
                  {cd.trangThai === 'CHUA_DOC' && <span className="badge badge-navy">MỚI</span>}
                </div>
                <span className="text-xs text-muted">{cd.maChiDao} • {cd.ngayTao ? new Date(cd.ngayTao).toLocaleString('vi-VN') : ''}</span>
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--navy-800)', marginBottom: '6px' }}>{cd.tieuDe}</h4>
              <p className="text-sm" style={{ color: 'var(--gray-600)', lineHeight: 1.6 }}>{cd.noiDung}</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <span className="text-xs text-muted">
                  {isManager ? `→ Gửi đến: ${cd.maNguoiNhan}` : `← Từ: ${cd.maNguoiGui}`}
                </span>
                {!isManager && cd.trangThai === 'CHUA_DOC' && (
                  <button className="btn btn-success btn-sm" onClick={() => handleMarkRead(cd)}>✅ Đã xem</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Gửi Chỉ đạo Vận hành" subtitle="Gửi chỉ đạo đến nhân viên" size="md">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">NGƯỜI NHẬN</label>
            <select className="form-control" value={form.maNguoiNhan}
              onChange={(e) => setForm({...form, maNguoiNhan: e.target.value})}>
              <option value="">Chọn nhân viên...</option>
              {nhanVien.filter(nv => nv.maTaiKhoan !== user?.maTaiKhoan).map(nv => (
                <option key={nv.maTaiKhoan} value={nv.maTaiKhoan}>{nv.hoTen} ({nv.quyenTruyCap})</option>
              ))}
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
        <div className="form-group">
          <label className="form-label">TIÊU ĐỀ</label>
          <input className="form-control" placeholder="Tiêu đề chỉ đạo..." value={form.tieuDe}
            onChange={(e) => setForm({...form, tieuDe: e.target.value})} />
        </div>
        <div className="form-group">
          <label className="form-label">NỘI DUNG</label>
          <textarea className="form-control" rows="5" placeholder="Nội dung chỉ đạo chi tiết..."
            value={form.noiDung} onChange={(e) => setForm({...form, noiDung: e.target.value})} />
        </div>
        <div className="modal-footer" style={{ padding: '16px 0 0', borderTop: '1px solid var(--gray-200)' }}>
          <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Hủy</button>
          <button className="btn btn-primary" onClick={handleCreate} disabled={formLoading}>
            {formLoading ? '⏳' : '📤 Gửi chỉ đạo'}
          </button>
        </div>
      </Modal>
    </>
  );
}
