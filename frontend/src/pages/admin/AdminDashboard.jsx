import { useState, useEffect } from 'react';
import { taiKhoanAPI, nhatKyAPI, gaAPI, tauAPI, duongRayAPI } from '../../services/api';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    accounts: { total: 0, active: 0, pending: 0 },
    infrastructure: { ga: 0, tau: 0, ray: 0 },
    activities: []
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [accountsRes, gaRes, tauRes, rayRes, nhatKyRes] = await Promise.all([
        taiKhoanAPI.getAll().catch(() => ({ data: { data: [] } })),
        gaAPI.getAll().catch(() => ({ data: { data: [] } })),
        tauAPI.getAll().catch(() => ({ data: { data: [] } })),
        duongRayAPI.getAll().catch(() => ({ data: { data: [] } })),
        nhatKyAPI.getAll().catch(() => ({ data: { data: [] } }))
      ]);

      const accounts = accountsRes.data.data || accountsRes.data || [];
      const ga = gaRes.data.data || gaRes.data || [];
      const tau = tauRes.data.data || tauRes.data || [];
      const ray = rayRes.data.data || rayRes.data || [];
      const nhatKy = nhatKyRes.data.data || nhatKyRes.data || [];

      setStats({
        accounts: {
          total: accounts.length,
          active: accounts.filter(a => a.trangThai === 'HOAT_DONG').length,
          pending: accounts.filter(a => a.trangThai === 'CHO_XAC_NHAN').length
        },
        infrastructure: {
          ga: ga.length,
          tau: tau.length,
          ray: ray.length
        }
      });

      setRecentActivities(nhatKy.slice(0, 10));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    const icons = {
      'TAO_LICH_TRINH': '📅',
      'PHAN_BO_RAY': '🛤️',
      'GHI_NHAN_SU_CO': '⚠️',
      'SUA_GIO': '⏰',
      'CAP_NHAT_TAI_KHOAN': '👤',
      'PHE_DUYET': '✅',
      'DOI_RAY': '🔄',
      'THAY_DOI_CAU_HINH': '⚙️'
    };
    return icons[action] || '📝';
  };

  const getActionLabel = (action) => {
    const labels = {
      'TAO_LICH_TRINH': 'Tạo lịch trình',
      'PHAN_BO_RAY': 'Phân bổ ray',
      'GHI_NHAN_SU_CO': 'Ghi nhận sự cố',
      'SUA_GIO': 'Sửa giờ',
      'CAP_NHAT_TAI_KHOAN': 'Cập nhật tài khoản',
      'PHE_DUYET': 'Phê duyệt',
      'DOI_RAY': 'Đổi ray',
      'THAY_DOI_CAU_HINH': 'Thay đổi cấu hình'
    };
    return labels[action] || action;
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Dashboard Quản trị</h1>
          <p>Tổng quan hệ thống quản lý lịch trình tàu Đà Nẵng</p>
        </div>
      </div>

      {/* System Overview Stats */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--navy-700)' }}>
          📊 Tổng quan hệ thống
        </h3>
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-info">
              <div className="stat-label">Tổng nhân sự</div>
              <div className="stat-value">{stats.accounts.total}</div>
              <div className="text-xs text-muted" style={{ marginTop: '4px' }}>
                {stats.accounts.active} đang hoạt động
              </div>
            </div>
            <div className="stat-icon">👥</div>
          </div>
          <div className="stat-card green">
            <div className="stat-info">
              <div className="stat-label">Ga hoạt động</div>
              <div className="stat-value">{stats.infrastructure.ga}</div>
              <div className="text-xs text-muted" style={{ marginTop: '4px' }}>
                Trên toàn tuyến
              </div>
            </div>
            <div className="stat-icon">🏢</div>
          </div>
          <div className="stat-card purple">
            <div className="stat-info">
              <div className="stat-label">Đoàn tàu</div>
              <div className="stat-value">{stats.infrastructure.tau}</div>
              <div className="text-xs text-muted" style={{ marginTop: '4px' }}>
                Đang quản lý
              </div>
            </div>
            <div className="stat-icon">🚂</div>
          </div>
          <div className="stat-card orange">
            <div className="stat-info">
              <div className="stat-label">Đường ray</div>
              <div className="stat-value">{stats.infrastructure.ray}</div>
              <div className="text-xs text-muted" style={{ marginTop: '4px' }}>
                Tại ga Đà Nẵng
              </div>
            </div>
            <div className="stat-icon">🛤️</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--navy-700)' }}>
          ⚡ Thao tác nhanh
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <Link to="/admin/tai-khoan" className="quick-action-card">
            <div className="quick-action-icon" style={{ background: 'var(--blue-100)', color: 'var(--blue-600)' }}>👤</div>
            <div>
              <div className="quick-action-title">Quản lý nhân sự</div>
              <div className="quick-action-desc">Tài khoản & phân quyền</div>
            </div>
          </Link>
          <Link to="/admin/ha-tang" className="quick-action-card">
            <div className="quick-action-icon" style={{ background: 'var(--green-100)', color: 'var(--green-600)' }}>🏗️</div>
            <div>
              <div className="quick-action-title">Hạ tầng</div>
              <div className="quick-action-desc">Ga, tàu, đường ray</div>
            </div>
          </Link>
          <Link to="/admin/nhat-ky" className="quick-action-card">
            <div className="quick-action-icon" style={{ background: 'var(--purple-100)', color: 'var(--purple-600)' }}>📋</div>
            <div>
              <div className="quick-action-title">Nhật ký</div>
              <div className="quick-action-desc">Lịch sử hoạt động</div>
            </div>
          </Link>
          <button className="quick-action-card" onClick={loadData}>
            <div className="quick-action-icon" style={{ background: 'var(--orange-100)', color: 'var(--orange-600)' }}>🔄</div>
            <div>
              <div className="quick-action-title">Làm mới</div>
              <div className="quick-action-desc">Cập nhật dữ liệu</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--navy-700)' }}>
            🕐 Hoạt động gần đây
          </h3>
          <Link to="/admin/nhat-ky" className="btn btn-secondary btn-sm">
            Xem tất cả
          </Link>
        </div>
        <div style={{ padding: '0' }}>
          {loading ? (
            <div className="text-center text-muted" style={{ padding: '40px' }}>Đang tải...</div>
          ) : recentActivities.length === 0 ? (
            <div className="text-center text-muted" style={{ padding: '40px' }}>Chưa có hoạt động nào</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {recentActivities.map((activity, index) => (
                <div
                  key={activity.maNhatKy || index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 20px',
                    borderBottom: index < recentActivities.length - 1 ? '1px solid var(--gray-200)' : 'none',
                    transition: 'background 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-50)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--blue-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    flexShrink: 0
                  }}>
                    {getActionIcon(activity.hanhDong)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="font-semibold" style={{ fontSize: '14px' }}>
                        {getActionLabel(activity.hanhDong)}
                      </span>
                      <span className="badge badge-gray" style={{ fontSize: '11px' }}>
                        {activity.doiTuong}
                      </span>
                    </div>
                    <div className="text-sm text-muted" style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {activity.noiDungMoi || activity.noiDungCu || 'Không có mô tả'}
                    </div>
                  </div>
                  <div style={{
                    textAlign: 'right',
                    fontSize: '12px',
                    color: 'var(--gray-500)',
                    flexShrink: 0,
                    minWidth: '100px'
                  }}>
                    {formatTimeAgo(activity.thoiGian)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .quick-action-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: white;
          border: 1px solid var(--gray-200);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          color: inherit;
        }
        .quick-action-card:hover {
          border-color: var(--navy-300);
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }
        .quick-action-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }
        .quick-action-title {
          font-weight: 600;
          font-size: 14px;
          color: var(--navy-700);
          margin-bottom: 2px;
        }
        .quick-action-desc {
          font-size: 12px;
          color: var(--gray-500);
        }
      `}</style>
    </>
  );
}
