import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, getRolePath } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authAPI.login({ email, matKhau });
      if (res.data.success) {
        const { token, ...userData } = res.data.data;
        login(userData, token);
        const path = getRolePath();
        navigate(path);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi kết nối đến máy chủ');
    } finally {
      setLoading(false);
    }
  };

  // Demo accounts for quick login
  const demoAccounts = [
    { email: 'admin@dsvn.vn', label: 'Quản trị viên', color: '#3B82F6' },
    { email: 'tuan.dh@dsvn.vn', label: 'NV Điều hành', color: '#F97316' },
    { email: 'thanh.ng@dsvn.vn', label: 'NV Nhà ga', color: '#22C55E' },
    { email: 'vinh.bql@dsvn.vn', label: 'Ban Quản lý', color: '#8B5CF6' },
  ];

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-banner">
          <div className="banner-content">
            <div className="banner-icon">🚂</div>
            <h1>
              Đường sắt Đà Nẵng<br />
              <em>Điều hành Nhà ga</em>
            </h1>
            <p>
              Hệ thống quản lý vận tải đường sắt tập trung thế hệ mới.
              Hiệu quả - Chính xác - An toàn tuyệt đối.
            </p>
            <div className="system-status">
              <span>TRẠNG THÁI HỆ THỐNG</span>
              <br />
              <span className="status-dot"></span>
              Đang hoạt động bình thường
            </div>
          </div>
        </div>

        <div className="login-form-wrapper">
          <h2>Đăng nhập</h2>
          <p className="login-subtitle">
            Vui lòng nhập thông tin để truy cập hệ thống điều hành.
          </p>

          {error && (
            <div className="login-error">
              ⚠️ {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">EMAIL / TÊN ĐĂNG NHẬP</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="admin.danang@dsvn.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                MẬT KHẨU
                <a href="#" style={{ fontSize: '12px', color: 'var(--navy-500)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                  Quên mật khẩu?
                </a>
              </label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••••••"
                  value={matKhau}
                  onChange={(e) => setMatKhau(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-extras">
              <label>
                <input type="checkbox" />
                Ghi nhớ phiên làm việc này
              </label>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Đăng nhập →'}
            </button>
          </form>

          <div style={{ marginTop: '24px' }}>
            <p style={{ fontSize: '11px', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              TÀI KHOẢN DEMO
            </p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {demoAccounts.map(acc => (
                <button
                  key={acc.email}
                  onClick={() => { setEmail(acc.email); setMatKhau('123456'); }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 500,
                    background: acc.color + '15',
                    color: acc.color,
                    border: `1px solid ${acc.color}30`,
                    cursor: 'pointer'
                  }}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          <div className="login-footer">
            © 2026 ĐÀ NẴNG &nbsp;&nbsp;
            <a href="#">TRỢ GIÚP</a>
            <a href="#">CHÍNH SÁCH BẢO MẬT</a>
          </div>
        </div>
      </div>
    </div>
  );
}
