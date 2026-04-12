import { useState, useEffect } from 'react';
import { nhatKyAPI } from '../../services/api';

export default function NhatKyPage() {
  const [nhatKy, setNhatKy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await nhatKyAPI.getAll();
      setNhatKy(res.data.data || res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const actionColors = {
    'DANG_NHAP': { bg: '#DBEAFE', color: '#1E40AF' },
    'THEM': { bg: 'var(--green-100)', color: '#166534' },
    'CAP_NHAT': { bg: '#FEF3C7', color: '#92400E' },
    'XOA': { bg: 'var(--red-100)', color: '#991B1B' },
    'PHE_DUYET': { bg: 'var(--navy-100)', color: 'var(--navy-800)' },
  };

  const filtered = filterAction
    ? nhatKy.filter(nk => nk.hanhDong === filterAction)
    : nhatKy;

  return (
    <>
      <div className="page-header">
        <div className="page-header-actions">
          <div>
            <h1>Nhật ký Hệ thống</h1>
            <p>Theo dõi toàn bộ lịch sử hành động trong hệ thống</p>
          </div>
          <button className="btn btn-secondary" onClick={loadData}>🔄 Làm mới</button>
        </div>
      </div>

      <div className="filter-bar">
        <select className="form-control" style={{ width: 'auto' }} value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}>
          <option value="">Tất cả hành động</option>
          <option value="DANG_NHAP">Đăng nhập</option>
          <option value="THEM">Thêm mới</option>
          <option value="CAP_NHAT">Cập nhật</option>
          <option value="XOA">Xóa</option>
          <option value="PHE_DUYET">Phê duyệt</option>
        </select>
        <span className="text-sm text-muted" style={{ marginLeft: 'auto' }}>
          Tổng: {filtered.length} bản ghi
        </span>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Người dùng</th>
                <th>Hành động</th>
                <th>Đối tượng</th>
                <th>Chi tiết</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center text-muted" style={{ padding: '40px' }}>Đang tải...</td></tr>
              ) : filtered.map((nk, i) => {
                const ac = actionColors[nk.hanhDong] || { bg: 'var(--gray-100)', color: 'var(--gray-600)' };
                return (
                  <tr key={nk.maNhatKy || i}>
                    <td className="text-sm">{nk.ngayTao ? new Date(nk.ngayTao).toLocaleString('vi-VN') : '---'}</td>
                    <td className="font-semibold">{nk.maTaiKhoan}</td>
                    <td>
                      <span style={{
                        display: 'inline-flex', padding: '4px 10px', borderRadius: '20px',
                        fontSize: '11px', fontWeight: 600, background: ac.bg, color: ac.color
                      }}>{nk.hanhDong}</span>
                    </td>
                    <td className="text-sm">{nk.doiTuong}</td>
                    <td className="text-sm" style={{ maxWidth: '300px' }}>{nk.chiTiet}</td>
                    <td className="text-xs text-muted">{nk.diaChiIP || '---'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
