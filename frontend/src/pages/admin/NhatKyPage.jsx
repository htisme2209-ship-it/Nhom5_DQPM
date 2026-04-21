import { useState, useEffect } from 'react';
import { nhatKyAPI, taiKhoanAPI } from '../../services/api';

export default function NhatKyPage() {
  const [nhatKy, setNhatKy] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [searchPersonnel, setSearchPersonnel] = useState('');
  const [activeTab, setActiveTab] = useState('nhat-ky');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resLogs, resAccounts] = await Promise.all([
        nhatKyAPI.getAll(),
        taiKhoanAPI.getAll()
      ]);
      setNhatKy(resLogs.data.data || resLogs.data || []);
      setAccounts(resAccounts.data.data || resAccounts.data || []);
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

  const filteredAccounts = accounts.filter(acc => {
    const matchSearch = acc.hoTen?.toLowerCase().includes(searchPersonnel.toLowerCase()) ||
                       acc.email?.toLowerCase().includes(searchPersonnel.toLowerCase()) ||
                       acc.maTaiKhoan?.toLowerCase().includes(searchPersonnel.toLowerCase());
    const matchRole = !filterRole || acc.quyenTruyCap === filterRole;
    return matchSearch && matchRole;
  });

  const getRoleLabel = (role) => {
    const roleMap = {
      'QUAN_TRI_VIEN': 'Quản trị viên',
      'NHAN_VIEN_DIEU_HANH': 'Nhân viên điều hành',
      'NHAN_VIEN_NHA_GA': 'Nhân viên nhà ga',
      'BAN_QUAN_LY': 'Ban quản lý'
    };
    return roleMap[role] || role;
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'HOAT_DONG': 'Hoạt động',
      'CHO_XAC_NHAN': 'Chờ xác nhận',
      'KHOA': 'Khóa'
    };
    return statusMap[status] || status;
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-actions">
          <div>
            <h1>Quản lý Thông tin Nhân sự & Nhật ký</h1>
            <p>Xem thông tin nhân sự và theo dõi lịch sử hành động trong hệ thống</p>
          </div>
          <button className="btn btn-secondary" onClick={loadData}>🔄 Làm mới</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--gray-200)' }}>
          <button
            onClick={() => setActiveTab('nhat-ky')}
            style={{
              padding: '15px 20px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'nhat-ky' ? '3px solid var(--primary)' : 'none',
              color: activeTab === 'nhat-ky' ? 'var(--primary)' : 'var(--gray-600)',
              fontWeight: activeTab === 'nhat-ky' ? '600' : '500',
              cursor: 'pointer',
              marginRight: '20px'
            }}
          >
            📋 Nhật ký Hệ thống
          </button>
          <button
            onClick={() => setActiveTab('nhan-su')}
            style={{
              padding: '15px 20px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'nhan-su' ? '3px solid var(--primary)' : 'none',
              color: activeTab === 'nhan-su' ? 'var(--primary)' : 'var(--gray-600)',
              fontWeight: activeTab === 'nhan-su' ? '600' : '500',
              cursor: 'pointer'
            }}
          >
            👥 Thông tin Nhân sự
          </button>
        </div>
      </div>

      {/* Activity Log Tab */}
      {activeTab === 'nhat-ky' && (
        <>
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
      )}

      {/* Personnel Directory Tab */}
      {activeTab === 'nhan-su' && (
        <>
          <div className="filter-bar">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Tìm theo tên, email, hoặc mã tài khoản..."
              value={searchPersonnel}
              onChange={(e) => setSearchPersonnel(e.target.value)}
              style={{ flex: 1 }}
            />
            <select className="form-control" style={{ width: 'auto', marginLeft: '10px' }} value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}>
              <option value="">Tất cả vai trò</option>
              <option value="QUAN_TRI_VIEN">Quản trị viên</option>
              <option value="BAN_QUAN_LY">Ban quản lý</option>
              <option value="NHAN_VIEN_DIEU_HANH">Nhân viên điều hành</option>
              <option value="NHAN_VIEN_NHA_GA">Nhân viên nhà ga</option>
            </select>
            <span className="text-sm text-muted" style={{ marginLeft: 'auto' }}>
              Tổng: {filteredAccounts.length} nhân sự
            </span>
          </div>

          <div className="card">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Mã tài khoản</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Vai trò</th>
                    <th>Giới tính</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" className="text-center text-muted" style={{ padding: '40px' }}>Đang tải...</td></tr>
                  ) : filteredAccounts.length === 0 ? (
                    <tr><td colSpan="7" className="text-center text-muted" style={{ padding: '40px' }}>Không tìm thấy nhân sự</td></tr>
                  ) : (
                    filteredAccounts.map((acc, i) => (
                      <tr key={acc.maTaiKhoan || i}>
                        <td className="font-bold text-navy">{acc.maTaiKhoan}</td>
                        <td className="font-semibold">{acc.hoTen}</td>
                        <td className="text-sm">{acc.email}</td>
                        <td className="text-sm">{acc.sdt || '---'}</td>
                        <td>
                          <span style={{
                            display: 'inline-flex', padding: '4px 10px', borderRadius: '20px',
                            fontSize: '11px', fontWeight: 600, background: 'var(--navy-100)', color: 'var(--navy-800)'
                          }}>{getRoleLabel(acc.quyenTruyCap)}</span>
                        </td>
                        <td className="text-sm">{acc.gioiTinh === 'NAM' ? 'Nam' : acc.gioiTinh === 'NU' ? 'Nữ' : '---'}</td>
                        <td>
                          <span className={`badge ${acc.trangThai === 'HOAT_DONG' ? 'badge-success' : acc.trangThai === 'CHO_XAC_NHAN' ? 'badge-warning' : 'badge-danger'}`}>
                            {getStatusLabel(acc.trangThai)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}
