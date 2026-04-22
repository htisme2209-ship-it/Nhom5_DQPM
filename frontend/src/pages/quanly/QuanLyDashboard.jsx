import { useState, useEffect } from 'react';
import { keHoachAPI, chiDaoAPI, lichTrinhAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom'; // Thêm thư viện chuyển trang

export default function QuanLyDashboard() {
  const navigate = useNavigate(); // Khởi tạo biến chuyển trang
  const [keHoach, setKeHoach] = useState([]);
  const [chiDao, setChiDao] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [khRes, cdRes, ltRes] = await Promise.all([
        keHoachAPI.getAll(),
        chiDaoAPI.getAll(),
        lichTrinhAPI.getAll({ ngay: new Date().toISOString().split('T')[0] }),
      ]);
      const kh = khRes.data.data || [];
      const cd = cdRes.data.data || [];
      const lt = ltRes.data.data || [];
      
      // Lọc kế hoạch mới nhất lên đầu và chỉ lấy 5 cái cho gọn Dashboard
      const sortedKh = kh.sort((a, b) => new Date(b.ngayGui) - new Date(a.ngayGui));
      setKeHoach(sortedKh.slice(0, 5)); 
      
      setChiDao(cd);
      setStats({
        tongChuyen: lt.length,
        choDuyet: kh.filter(k => k.trangThai === 'CHO_PHE_DUYET').length,
        dungGio: lt.length > 0 ? Math.round(lt.filter(l => l.soPhutTre === 0).length / lt.length * 100) : 0,
        chiDaoGui: cd.length,
      });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const ttMap = {
    'CHO_PHE_DUYET': { label: 'Chờ phê duyệt', cls: 'badge-warning' },
    'DA_PHE_DUYET': { label: 'Đã duyệt', cls: 'badge-success' },
    'TU_CHOI': { label: 'Từ chối', cls: 'badge-danger' },
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-actions">
          <div>
            <p style={{ fontSize: '11px', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '1px' }}>TRUNG TÂM QUẢN LÝ</p>
            <h1>Tổng quan Vận hành</h1>
            <p>Giám sát toàn diện hoạt động Ga Đà Nẵng</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/quan-ly/bao-cao')}>📊 Xuất báo cáo</button>
            <button className="btn btn-primary" onClick={() => navigate('/quan-ly/chi-dao')}>📝 Gửi chỉ đạo</button>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-info">
            <div className="stat-label">Chuyến hôm nay</div>
            <div className="stat-value">{stats.tongChuyen}</div>
          </div>
          <div className="stat-icon">🚂</div>
        </div>
        <div className="stat-card green">
          <div className="stat-info">
            <div className="stat-label">Tỷ lệ đúng giờ</div>
            <div className="stat-value">{stats.dungGio}%</div>
          </div>
          <div className="stat-icon">✅</div>
        </div>
        <div className="stat-card orange" style={{ cursor: 'pointer' }} onClick={() => navigate('/quan-ly/phe-duyet')}>
          <div className="stat-info">
            <div className="stat-label">Chờ phê duyệt</div>
            <div className="stat-value">{stats.choDuyet}</div>
          </div>
          <div className="stat-icon">📋</div>
        </div>
        <div className="stat-card navy" style={{ cursor: 'pointer' }} onClick={() => navigate('/quan-ly/chi-thi')}>
          <div className="stat-info">
            <div className="stat-label">Chỉ đạo đã gửi</div>
            <div className="stat-value">{stats.chiDaoGui}</div>
          </div>
          <div className="stat-icon">📨</div>
        </div>
      </div>

      <div className="two-col-layout">
        <div className="main-col">
          <div className="card">
            <div className="card-header">
              <h3>📋 Kế hoạch chờ phê duyệt</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/quan-ly/phe-duyet')}>Xem tất cả ➔</button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>Tiêu đề</th>
                    <th>Người gửi</th>
                    <th>Ưu tiên</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {keHoach.map(kh => {
                    const tt = ttMap[kh.trangThai] || { label: kh.trangThai, cls: 'badge-gray' };
                    return (
                      <tr key={kh.maKeHoach}>
                        <td className="font-bold">{kh.maKeHoach}</td>
                        <td>{kh.tieuDe}</td>
                        <td>{kh.maNguoiGui}</td>
                        <td><span className={`badge ${kh.mucDoUuTien === 'KHAN_CAP' ? 'badge-danger' : kh.mucDoUuTien === 'CAO' ? 'badge-warning' : 'badge-info'}`}>{kh.mucDoUuTien}</span></td>
                        <td><span className={`badge ${tt.cls}`}>{tt.label}</span></td>
                        <td>
                          {kh.trangThai === 'CHO_PHE_DUYET' ? (
                            <span className="text-muted text-sm">Chờ phê duyệt</span>
                          ) : (
                            <span className="text-muted text-sm">Đã xử lý</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {keHoach.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center text-muted" style={{ padding: '20px' }}>
                        Không có kế hoạch nào gần đây.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="side-col">
          <div className="card card-accent" style={{ marginBottom: '16px' }}>
            <div className="card-body">
              <div className="accent-label">TỶ LỆ TUÂN THỦ</div>
              <div style={{ fontSize: '48px', fontWeight: 700, marginTop: '8px' }}>{stats.dungGio}%</div>
              <p style={{ opacity: 0.7, fontSize: '12px' }}>Tổng số nhân viên đã xác nhận trong 24 giờ qua</p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>📨 Chỉ đạo gần đây</h3>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {chiDao.slice(0, 3).map(cd => (
                <div key={cd.maChiDao} style={{
                  padding: '16px 20px', borderBottom: '1px solid var(--gray-100)',
                  cursor: 'pointer', transition: 'var(--transition)'
                }} onClick={() => navigate('/quan-ly/chi-thi')}>
                  <div className="flex-between" style={{ marginBottom: '4px' }}>
                    <span className={`badge ${cd.mucDoUuTien === 'KHAN_CAP' ? 'badge-danger' : 'badge-info'}`}>{cd.mucDoUuTien === 'KHAN_CAP' ? '🔴 KHẨN CẤP' : '🔵 ' + cd.mucDoUuTien}</span>
                    <span className="text-xs text-muted">{cd.trangThai === 'DA_DOC' ? 'Đã xem' : 'Đã gửi'}</span>
                  </div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy-800)', margin: '4px 0' }}>{cd.tieuDe}</h4>
                  <p className="text-sm text-muted" style={{ lineHeight: 1.4 }}>{cd.noiDung.substring(0, 100)}...</p>
                </div>
              ))}
              {chiDao.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--gray-500)' }}>
                  Chưa có chỉ đạo nào.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}