import { useState, useEffect } from 'react';
import { lichTrinhAPI, suCoAPI, chiDaoAPI } from '../../services/api';

export default function NhaGaDashboard() {
  const [lichTrinh, setLichTrinh] = useState([]);
  const [suCo, setSuCo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const [ltRes, scRes] = await Promise.all([
        lichTrinhAPI.getAll({ ngay: today }),
        suCoAPI.getAll(),
      ]);
      setLichTrinh(ltRes.data.data || []);
      setSuCo(scRes.data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const formatTime = (dt) => {
    if (!dt) return '---';
    const d = new Date(dt);
    return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
  };

  const upcoming = lichTrinh
    .filter(lt => lt.trangThai === 'DA_XAC_NHAN' || lt.trangThai === 'CHO_XAC_NHAN')
    .slice(0, 5);

  const atStation = lichTrinh.filter(lt => lt.trangThai === 'DUNG_TAI_GA');

  return (
    <>
      <div className="page-header">
        <div className="page-header-actions">
          <div>
            <p style={{ fontSize: '11px', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '1px' }}>ĐIỀU HÀNH NHÀ GA</p>
            <h1>Trạng thái Sân ga</h1>
            <p>Giám sát tàu đang đỗ, tàu sắp đến và thông tin sân ga thời gian thực</p>
          </div>
          <button className="btn btn-danger">⚠️ Báo cáo Sự cố</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card green">
          <div className="stat-info">
            <div className="stat-label">Tàu đang đỗ</div>
            <div className="stat-value">{atStation.length}</div>
          </div>
          <div className="stat-icon">🅿️</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-info">
            <div className="stat-label">Sắp đến</div>
            <div className="stat-value">{upcoming.length}</div>
          </div>
          <div className="stat-icon">🚂</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-info">
            <div className="stat-label">Đã khởi hành</div>
            <div className="stat-value">{lichTrinh.filter(lt => lt.trangThai === 'DA_ROI_GA').length}</div>
          </div>
          <div className="stat-icon">🚄</div>
        </div>
        <div className="stat-card red">
          <div className="stat-info">
            <div className="stat-label">Sự cố hôm nay</div>
            <div className="stat-value">{suCo.length}</div>
          </div>
          <div className="stat-icon">⚠️</div>
        </div>
      </div>

      <div className="two-col-layout">
        <div className="main-col">
          {/* Tàu đang đỗ */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="card-header">
              <h3>🅿️ Tàu đang đỗ tại ga</h3>
            </div>
            <div className="card-body">
              {atStation.length === 0 ? (
                <p className="text-muted text-center" style={{ padding: '20px' }}>Không có tàu đang đỗ</p>
              ) : (
                <div className="grid-2" style={{ gap: '12px' }}>
                  {atStation.map(lt => (
                    <div key={lt.maLichTrinh} style={{
                      padding: '16px', borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--gray-200)', background: 'var(--green-100)'
                    }}>
                      <div className="flex-between">
                        <span className="font-bold text-navy">{lt.maChuyenTau}</span>
                        <span className="ray-badge">{lt.maRay}</span>
                      </div>
                      <p className="text-sm text-muted" style={{ marginTop: '4px' }}>
                        Đến: {formatTime(lt.gioDenThucTe)} {lt.soPhutTre > 0 && <span className="text-danger">(trễ {lt.soPhutTre}p)</span>}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming */}
          <div className="card">
            <div className="card-header">
              <h3>🔜 Chuyến tàu sắp tới</h3>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Chuyến tàu</th>
                    <th>Giờ đến DK</th>
                    <th>Đường ray</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {upcoming.map(lt => (
                    <tr key={lt.maLichTrinh}>
                      <td className="font-bold text-navy">{lt.maChuyenTau}</td>
                      <td className="time-display">{formatTime(lt.gioDenDuKien)}</td>
                      <td><span className="ray-badge">{lt.maRay || '---'}</span></td>
                      <td><span className="badge badge-warning">Sắp đến</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="side-col">
          <div className="card">
            <div className="card-header">
              <h3>⚠️ Sự cố gần đây</h3>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {suCo.slice(0, 4).map(sc => (
                <div key={sc.maSuCo} style={{ padding: '14px 20px', borderBottom: '1px solid var(--gray-100)' }}>
                  <div className="flex-between" style={{ marginBottom: '4px' }}>
                    <span className="font-bold text-sm">{sc.maSuCo}</span>
                    <span className={`badge ${sc.trangThaiXuLy === 'DA_XU_LY' ? 'badge-success' : 'badge-danger'}`}>
                      {sc.trangThaiXuLy === 'DA_XU_LY' ? 'Đã xử lý' : 'Đang xử lý'}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>{sc.moTa.substring(0, 80)}...</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
