import { useState, useEffect } from 'react';
import { lichTrinhAPI, duongRayAPI, suCoAPI, chuyenTauAPI } from '../../services/api';

export default function DieuHanhDashboard() {
  const [stats, setStats] = useState({
    tongChuyen: 0, dungGio: 0, tre: 0, suCo: 0
  });
  const [lichTrinh, setLichTrinh] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const [ltRes, scRes] = await Promise.all([
        lichTrinhAPI.getAll({ ngay: today }),
        suCoAPI.getAll(),
      ]);
      const lt = ltRes.data.data || [];
      const sc = scRes.data.data || [];

      setLichTrinh(lt);
      setStats({
        tongChuyen: lt.length,
        dungGio: lt.filter(l => l.soPhutTre === 0).length,
        tre: lt.filter(l => l.soPhutTre > 0).length,
        suCo: sc.filter(s => s.trangThaiXuLy !== 'DA_XU_LY').length,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getTrangThaiLabel = (tt) => {
    const map = {
      'CHO_XAC_NHAN': { label: 'Chờ xác nhận', cls: 'badge-warning' },
      'DA_XAC_NHAN': { label: 'Đã xác nhận', cls: 'badge-info' },
      'DUNG_TAI_GA': { label: 'Đang ở ga', cls: 'badge-success' },
      'DA_ROI_GA': { label: 'Đã rời ga', cls: 'badge-gray' },
      'BI_HUY': { label: 'Bị hủy', cls: 'badge-danger' },
    };
    return map[tt] || { label: tt, cls: 'badge-gray' };
  };

  const formatTime = (dt) => {
    if (!dt) return '---';
    const d = new Date(dt);
    return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
  };

  if (loading) return <div className="text-center text-muted" style={{ padding: '60px' }}>Đang tải...</div>;

  return (
    <>
      <div className="page-header">
        <div className="page-header-actions">
          <div>
            <p style={{ fontSize: '11px', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '1px' }}>BẢNG ĐIỀU KHIỂN ĐIỀU HÀNH</p>
            <h1>Tổng quan Vận hành</h1>
            <p>Giám sát thời gian thực các chuyến tàu qua Ga Đà Nẵng hôm nay</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm">📅 Hôm nay</button>
            <button className="btn btn-primary btn-sm">+ Thêm Lịch trình</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-info">
            <div className="stat-label">Tổng chuyến hôm nay</div>
            <div className="stat-value">{stats.tongChuyen}</div>
            <div className="stat-change text-success">↑ Đang hoạt động</div>
          </div>
          <div className="stat-icon">🚂</div>
        </div>
        <div className="stat-card green">
          <div className="stat-info">
            <div className="stat-label">Đúng giờ</div>
            <div className="stat-value">{stats.dungGio}</div>
            <div className="stat-change text-success">
              {stats.tongChuyen > 0 ? Math.round(stats.dungGio / stats.tongChuyen * 100) : 0}%
            </div>
          </div>
          <div className="stat-icon">✅</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-info">
            <div className="stat-label">Trễ giờ</div>
            <div className="stat-value">{stats.tre}</div>
            <div className="stat-change text-danger">Cần xử lý</div>
          </div>
          <div className="stat-icon">⏰</div>
        </div>
        <div className="stat-card red">
          <div className="stat-info">
            <div className="stat-label">Sự cố chưa xử lý</div>
            <div className="stat-value">{String(stats.suCo).padStart(2, '0')}</div>
            <div className="stat-change text-danger">Cần giải quyết</div>
          </div>
          <div className="stat-icon">⚠️</div>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="card">
        <div className="card-header">
          <h3>📋 Lịch trình hôm nay</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select className="form-control" style={{ width: 'auto', padding: '6px 32px 6px 12px', fontSize: '12px' }}>
              <option>Tất cả trạng thái</option>
              <option>Chờ xác nhận</option>
              <option>Đúng giờ</option>
              <option>Trễ</option>
            </select>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Mã Chuyến</th>
                <th>Giờ đến (DK)</th>
                <th>Giờ đi (DK)</th>
                <th>Giờ thực tế</th>
                <th>Đường ray</th>
                <th>Trễ</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {lichTrinh.length === 0 ? (
                <tr><td colSpan="8" className="text-center text-muted" style={{ padding: '40px' }}>Chưa có lịch trình</td></tr>
              ) : (
                lichTrinh.map(lt => {
                  const { label, cls } = getTrangThaiLabel(lt.trangThai);
                  return (
                    <tr key={lt.maLichTrinh}>
                      <td>
                        <div className="train-code">
                          <div className="font-bold text-navy">{lt.maChuyenTau}</div>
                        </div>
                      </td>
                      <td className="time-display">{formatTime(lt.gioDenDuKien)}</td>
                      <td className="time-display">{formatTime(lt.gioDiDuKien)}</td>
                      <td>
                        {lt.gioDenThucTe && <span className={lt.soPhutTre > 0 ? 'time-display late' : 'time-display'}>{formatTime(lt.gioDenThucTe)}</span>}
                        {!lt.gioDenThucTe && <span className="text-muted">---</span>}
                      </td>
                      <td><span className="ray-badge">{lt.maRay || '---'}</span></td>
                      <td>
                        {lt.soPhutTre > 0
                          ? <span className="badge badge-danger">-{lt.soPhutTre}p</span>
                          : <span className="badge badge-success">Đúng giờ</span>
                        }
                      </td>
                      <td><span className={`badge ${cls}`}>{label}</span></td>
                      <td>
                        <button className="btn btn-secondary btn-sm">Xem</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
