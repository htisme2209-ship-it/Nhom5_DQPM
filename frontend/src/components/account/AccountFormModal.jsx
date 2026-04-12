import Modal from '../Modal';

export default function AccountFormModal({
    isOpen,
    onClose,
    form,
    onChange,
    onSave,
    isEdit,
    loading
}) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Chỉnh sửa Tài khoản' : 'Tạo Tài khoản Mới'}
            subtitle="Cấu hình thông tin đăng nhập và quyền truy cập hệ thống"
            size="md"
        >
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">MÃ TÀI KHOẢN</label>
                    <input
                        className="form-control"
                        value={form.maTaiKhoan}
                        onChange={(e) => onChange({ ...form, maTaiKhoan: e.target.value })}
                        disabled={isEdit}
                        style={isEdit ? { background: 'var(--gray-100)' } : {}}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">HỌ TÊN</label>
                    <input
                        className="form-control"
                        placeholder="Nguyễn Văn A"
                        value={form.hoTen}
                        onChange={(e) => onChange({ ...form, hoTen: e.target.value })}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">EMAIL</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="email@dsvn.vn"
                        value={form.email}
                        onChange={(e) => onChange({ ...form, email: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">
                        {isEdit ? 'MẬT KHẨU MỚI (để trống nếu giữ nguyên)' : 'MẬT KHẨU'}
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="••••••••"
                        value={form.matKhau}
                        onChange={(e) => onChange({ ...form, matKhau: e.target.value })}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">VAI TRÒ TRUY CẬP</label>
                    <select
                        className="form-control"
                        value={form.quyenTruyCap}
                        onChange={(e) => onChange({ ...form, quyenTruyCap: e.target.value })}
                    >
                        <option value="QUAN_TRI_VIEN">Quản trị viên</option>
                        <option value="NHAN_VIEN_DIEU_HANH">Nhân viên Điều hành</option>
                        <option value="NHAN_VIEN_NHA_GA">Nhân viên Nhà ga</option>
                        <option value="BAN_QUAN_LY">Ban Quản lý</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">TRẠNG THÁI</label>
                    <select
                        className="form-control"
                        value={form.trangThai}
                        onChange={(e) => onChange({ ...form, trangThai: e.target.value })}
                    >
                        <option value="HOAT_DONG">Hoạt động</option>
                        <option value="CHO_XAC_NHAN">Chờ xác nhận</option>
                        <option value="KHOA">Khóa</option>
                    </select>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">SỐ ĐIỆN THOẠI</label>
                    <input
                        className="form-control"
                        placeholder="0901 234 567"
                        value={form.soDienThoai}
                        onChange={(e) => onChange({ ...form, soDienThoai: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">GIỚI TÍNH</label>
                    <select
                        className="form-control"
                        value={form.gioiTinh}
                        onChange={(e) => onChange({ ...form, gioiTinh: e.target.value })}
                    >
                        <option value="NAM">Nam</option>
                        <option value="NU">Nữ</option>
                        <option value="KHAC">Khác</option>
                    </select>
                </div>
            </div>

            <div className="modal-footer" style={{
                padding: '16px 0 0',
                borderTop: '1px solid var(--gray-200)',
                marginTop: '8px'
            }}>
                <button className="btn btn-secondary" onClick={onClose}>
                    Hủy
                </button>
                <button className="btn btn-primary" onClick={onSave} disabled={loading}>
                    {loading ? '⏳ Đang lưu...' : `🔒 ${isEdit ? 'Cập nhật' : 'Tạo tài khoản'}`}
                </button>
            </div>
        </Modal>
    );
}
