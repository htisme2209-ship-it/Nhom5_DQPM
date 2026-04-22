import { useState } from 'react';

export default function QuyTacHethongPage() {
  const [activeTab, setActiveTab] = useState('quy-trinh-phe-duyet');

  return (
    <>
      <div className="page-header">
        <div className="page-header-actions">
          <div>
            <h1>Quy tắc & Quy trình Hệ thống</h1>
            <p>Cấu hình quy trình phê duyệt và các quy tắc nghiệp vụ</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--gray-200)', overflowX: 'auto' }}>
          <button
            onClick={() => setActiveTab('quy-trinh-phe-duyet')}
            style={{
              padding: '15px 20px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'quy-trinh-phe-duyet' ? '3px solid var(--primary)' : 'none',
              color: activeTab === 'quy-trinh-phe-duyet' ? 'var(--primary)' : 'var(--gray-600)',
              fontWeight: activeTab === 'quy-trinh-phe-duyet' ? '600' : '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            ✅ Quy trình Phê duyệt
          </button>
          <button
            onClick={() => setActiveTab('quy-tac-nghiep-vu')}
            style={{
              padding: '15px 20px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'quy-tac-nghiep-vu' ? '3px solid var(--primary)' : 'none',
              color: activeTab === 'quy-tac-nghiep-vu' ? 'var(--primary)' : 'var(--gray-600)',
              fontWeight: activeTab === 'quy-tac-nghiep-vu' ? '600' : '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            📋 Quy tắc Nghiệp vụ
          </button>
          <button
            onClick={() => setActiveTab('quy-tac-tai-khoan')}
            style={{
              padding: '15px 20px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'quy-tac-tai-khoan' ? '3px solid var(--primary)' : 'none',
              color: activeTab === 'quy-tac-tai-khoan' ? 'var(--primary)' : 'var(--gray-600)',
              fontWeight: activeTab === 'quy-tac-tai-khoan' ? '600' : '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            👤 Quy tắc Tài khoản
          </button>
        </div>
      </div>

      {/* Approval Workflow Tab */}
      {activeTab === 'quy-trinh-phe-duyet' && (
        <div className="card">
          <div style={{ padding: '20px' }}>
            <h3 style={{ marginTop: '0', marginBottom: '20px', color: 'var(--navy-800)' }}>📌 Quy trình Phê duyệt</h3>

            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ color: 'var(--navy-700)', marginBottom: '12px' }}>1. Phê duyệt Kế hoạch Đặc biệt</h4>
              <div style={{ background: 'var(--gray-50)', padding: '15px', borderLeft: '4px solid var(--blue-500)', borderRadius: '4px' }}>
                <p style={{ marginBottom: '10px' }}>
                  <strong>Mô tả:</strong> Kế hoạch điều chỉnh lịch trình, lịch trình bất thường hoặc các kế hoạch khác cần sự chấp thuận của Ban quản lý.
                </p>
                <p style={{ marginBottom: '10px' }}>
                  <strong>Những người có thể tạo:</strong> Nhân viên điều hành, Ban quản lý
                </p>
                <p style={{ marginBottom: '10px' }}>
                  <strong>Những người có thể phê duyệt:</strong> Ban quản lý
                </p>
                <p style={{ marginBottom: '0' }}>
                  <strong>Quy trình:</strong> CHỜ PHÊ DUYỆT → ĐÃ PHÊ DUYỆT / TỪ CHỐI
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ color: 'var(--navy-700)', marginBottom: '12px' }}>2. Phê duyệt Cấu hình Hạ tầng</h4>
              <div style={{ background: 'var(--gray-50)', padding: '15px', borderLeft: '4px solid var(--green-500)', borderRadius: '4px' }}>
                <p style={{ marginBottom: '10px' }}>
                  <strong>Mô tả:</strong> Các thay đổi về cấu hình ga, tuyến đường, đường ray, hoặc chuyến tàu.
                </p>
                <p style={{ marginBottom: '10px' }}>
                  <strong>Những người có thể tạo:</strong> Quản trị viên
                </p>
                <p style={{ marginBottom: '10px' }}>
                  <strong>Những người có thể phê duyệt:</strong> Quản trị viên
                </p>
                <p style={{ marginBottom: '0' }}>
                  <strong>Quy trình:</strong> Trực tiếp áp dụng (không cần phê duyệt thêm)
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ color: 'var(--navy-700)', marginBottom: '12px' }}>3. Xác nhận Chuyến tàu</h4>
              <div style={{ background: 'var(--gray-50)', padding: '15px', borderLeft: '4px solid var(--purple-500)', borderRadius: '4px' }}>
                <p style={{ marginBottom: '10px' }}>
                  <strong>Mô tả:</strong> Cần phê duyệt từ Ban quản lý trước khi xác nhận chuyến tàu chạy.
                </p>
                <p style={{ marginBottom: '10px' }}>
                  <strong>Những người có thể tạo:</strong> Nhân viên điều hành
                </p>
                <p style={{ marginBottom: '10px' }}>
                  <strong>Những người có thể phê duyệt:</strong> Ban quản lý
                </p>
                <p style={{ marginBottom: '0' }}>
                  <strong>Quy trình:</strong> CHỜ XÁC NHẬN → ĐÃ XÁC NHẬN / HỦY XÁC NHẬN
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Business Rules Tab */}
      {activeTab === 'quy-tac-nghiep-vu' && (
        <div className="card">
          <div style={{ padding: '20px' }}>
            <h3 style={{ marginTop: '0', marginBottom: '20px', color: 'var(--navy-800)' }}>📋 Quy tắc Nghiệp vụ</h3>

            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ color: 'var(--navy-700)', marginBottom: '12px' }}>1. Quy tắc Chuyến tàu</h4>
              <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
                <li>Chỉ có thể tạo chuyến tàu trong vòng 1 tháng kể từ ngày hiện tại</li>
                <li>Mỗi tuyến có thể có nhiều chuyến tàu khác nhau</li>
                <li>Tàu phải được định nghĩa trước khi gán cho chuyến</li>
                <li>Ngày chạy phải là ngày hợp lệ (không được trong quá khứ quá 30 ngày)</li>
              </ul>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ color: 'var(--navy-700)', marginBottom: '12px' }}>2. Quy tắc Tuyến đường</h4>
              <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
                <li>Mỗi tuyến phải có ga đầu và ga cuối khác nhau</li>
                <li>Có thể thêm các ga giữa (trạm dừng trung gian)</li>
                <li>Không được thêm ga giữa trùng với ga đầu hoặc ga cuối</li>
                <li>Khoảng cách phải là số dương</li>
              </ul>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ color: 'var(--navy-700)', marginBottom: '12px' }}>3. Quy tắc Vai trò Tàu tại Đà Nẵng</h4>
              <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
                <li>XUẤT PHÁT: Tuyến bắt đầu từ Đà Nẵng → không cần giờ đến</li>
                <li>ĐIỂM CUỐI: Tuyến kết thúc tại Đà Nẵng → không cần giờ đi</li>
                <li>TRUNG GIAN: Tuyến đi qua Đà Nẵng → cần cả giờ đến và giờ đi</li>
              </ul>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ color: 'var(--navy-700)', marginBottom: '12px' }}>4. Quy tắc Lịch trình</h4>
              <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
                <li>Lịch trình không được xung đột với lịch trình khác trên cùng một tuyến/ray</li>
                <li>Giờ đến phải nhỏ hơn giờ đi</li>
                <li>Không được tạo lịch trình cho quá khứ</li>
                <li>Cần xác nhận trước khi chuyến tàu chạy chính thức</li>
              </ul>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ color: 'var(--navy-700)', marginBottom: '12px' }}>5. Quy tắc Sự cố</h4>
              <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
                <li>Mỗi sự cố phải được ghi nhận bởi nhân viên nhà ga hoặc nhân viên điều hành</li>
                <li>Sự cố phải có mô tả chi tiết và mức độ ưu tiên</li>
                <li>Cần có phương án xử lý trước khi kết thúc</li>
                <li>Phải cập nhật trạng thái ray sau khi sự cố được xử lý</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Account Rules Tab */}
      {activeTab === 'quy-tac-tai-khoan' && (
        <div className="card">
          <div style={{ padding: '20px' }}>
            <h3 style={{ marginTop: '0', marginBottom: '20px', color: 'var(--navy-800)' }}>👤 Quy tắc Tài khoản & Quyền hạn</h3>

            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ color: 'var(--navy-700)', marginBottom: '12px' }}>1. Vai trò & Quyền hạn</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--navy-50)' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid var(--navy-200)' }}>Vai trò</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid var(--navy-200)' }}>Mô tả</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid var(--navy-200)' }}>Quyền chính</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--gray-200)' }}>
                    <td style={{ padding: '12px' }}>
                      <span style={{ background: 'var(--navy-100)', padding: '4px 8px', borderRadius: '4px', fontWeight: '600', color: 'var(--navy-800)', fontSize: '12px' }}>
                        QUẢN TRỊ VIÊN
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>Quản lý hệ thống toàn diện</td>
                    <td style={{ padding: '12px' }}>
                      Quản lý tài khoản, hạ tầng, lịch trình, xem nhật ký
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--gray-200)' }}>
                    <td style={{ padding: '12px' }}>
                      <span style={{ background: 'var(--green-100)', padding: '4px 8px', borderRadius: '4px', fontWeight: '600', color: 'var(--green-800)', fontSize: '12px' }}>
                        BAN QUẢN LÝ
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>Phê duyệt quyết định quan trọng</td>
                    <td style={{ padding: '12px' }}>
                      Phê duyệt kế hoạch, xác nhận chuyến, xem lịch trình, báo cáo
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--gray-200)' }}>
                    <td style={{ padding: '12px' }}>
                      <span style={{ background: 'var(--blue-100)', padding: '4px 8px', borderRadius: '4px', fontWeight: '600', color: 'var(--blue-800)', fontSize: '12px' }}>
                        NHÂN VIÊN ĐIỀU HÀNH
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>Quản lý lịch trình hàng ngày</td>
                    <td style={{ padding: '12px' }}>
                      Tạo lịch trình, tạo kế hoạch, xử lý sự cố, xác nhận chuyến
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px' }}>
                      <span style={{ background: 'var(--orange-100)', padding: '4px 8px', borderRadius: '4px', fontWeight: '600', color: 'var(--orange-800)', fontSize: '12px' }}>
                        NHÂN VIÊN NHÀ GA
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>Ghi nhận thông tin tại ga</td>
                    <td style={{ padding: '12px' }}>
                      Ghi nhận sự cố, xem lịch trình, ghi nhận thông tin chuyến
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ color: 'var(--navy-700)', marginBottom: '12px' }}>2. Quy tắc Trạng thái Tài khoản</h4>
              <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
                <li><strong>HOẠT ĐỘNG:</strong> Tài khoản có thể đăng nhập và sử dụng hệ thống bình thường</li>
                <li><strong>CHỜ XÁC NHẬN:</strong> Tài khoản được tạo nhưng chưa kích hoạt, không thể đăng nhập</li>
                <li><strong>KHÓA:</strong> Tài khoản đã bị khóa, không thể đăng nhập cho đến khi được mở khóa</li>
              </ul>
            </div>

            <div>
              <h4 style={{ color: 'var(--navy-700)', marginBottom: '12px' }}>3. Quy tắc Mật khẩu</h4>
              <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
                <li>Mật khẩu tối thiểu 8 ký tự (nên có kết hợp chữ, số, ký tự đặc biệt)</li>
                <li>Mật khẩu được mã hóa an toàn trước khi lưu vào hệ thống</li>
                <li>Chỉ quản trị viên có thể đặt lại mật khẩu cho người khác</li>
                <li>Người dùng có thể thay đổi mật khẩu của chính mình bất cứ lúc nào</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
